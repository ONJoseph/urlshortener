const express = require('express');
const shortid = require('shortid');

const app = express();
const port = process.env.PORT || 3000;

// In-memory database for storing URL mappings
const urlDatabase = {};

app.use(express.json());

// Endpoint to shorten a URL
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;

  if (!longUrl) {
    return res.status(400).json({ error: 'Long URL is required' });
  }

  const shortUrl = generateShortUrl();
  urlDatabase[shortUrl] = longUrl;

  res.json({ shortUrl });
});

// Redirect to the original URL
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl];

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to generate a unique short URL
function generateShortUrl() {
  return shortid.generate();
}

/*
- curl -X POST -H "Content-Type: application/json" -d '{"longUrl": "https://www.usatoday.com/story/travel/2022/02/10/amtrak-deal-valentines-offer-sale/6741296001/"}' http://localhost:3000/shorten
- http://localhost:3000/sja0x7vgq
 
It allows users to shorten long URLs and then access the original URL by using the shortened version. Here's a detailed explanation of how this code works:

Import Required Modules:

const express = require('express');
const shortid = require('shortid');
express: The Express.js framework for building web applications.
shortid: A library for generating short and unique IDs.
Create an Express Application:

const app = express();
An instance of the Express application is created, which will be used to define routes and handle HTTP requests.
Define a Port:

const port = process.env.PORT || 3000;
This code sets the port for the server to listen on. It uses the value of the PORT environment variable if it's set, or defaults to port 3000.
In-Memory Database for URL Mappings:

const urlDatabase = {};
An in-memory database (urlDatabase) is used to store mappings between short URLs and their corresponding long URLs. This allows the server to redirect users to the original URL when they access a short URL.
Set Up Middleware:

app.use(express.json());
This line configures Express to parse incoming JSON data from HTTP requests, making it available in req.body.
Shorten a URL (POST Endpoint):

app.post('/shorten', (req, res) => {
  // Extract the long URL from the request body
  const longUrl = req.body.longUrl;
  
  // Validate that a long URL is provided
  if (!longUrl) {
    return res.status(400).json({ error: 'Long URL is required' });
  }
  
  // Generate a unique short URL
  const shortUrl = generateShortUrl();
  
  // Store the mapping in the in-memory database
  urlDatabase[shortUrl] = longUrl;
  
  // Respond with the generated short URL
  res.json({ shortUrl });
});
This route listens for POST requests at the /shorten endpoint.
It extracts the long URL from the request body and validates that it's provided.
If a valid long URL is provided, a unique short URL is generated using the generateShortUrl function.
The short URL and its corresponding long URL are stored in the urlDatabase.
The generated short URL is then sent as a response.
Redirect to the Original URL (GET Endpoint):

app.get('/:shortUrl', (req, res) => {
  // Extract the short URL from the request parameters
  const shortUrl = req.params.shortUrl;
  
  // Look up the original long URL in the in-memory database
  const longUrl = urlDatabase[shortUrl];
  
  // If the mapping exists, redirect to the original URL
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    // If the short URL is not found, return a 404 error
    res.status(404).json({ error: 'Short URL not found' });
  }
});
This route listens for GET requests with a dynamic parameter :shortUrl, which represents the shortened URL.
It looks up the original long URL corresponding to the provided short URL in the urlDatabase.
If the mapping exists, the server redirects the user to the original URL.
If the short URL is not found in the database, it returns a 404 error with an error message.
Start the Express Server:

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
The server is started, and it listens on the specified port. When the server starts, a message is logged to the console.
Generate Short URLs (Helper Function):

function generateShortUrl() {
  return shortid.generate();
}
This is a helper function that generates unique short URLs using the shortid library. It's called when a new URL is being shortened.

*/