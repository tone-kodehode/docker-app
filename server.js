// Import required packages
let express = require('express'); // Express framework
let path = require('path'); // Path module for handling file paths
let fs = require('fs'); // File system module for file operations
let MongoClient = require('mongodb').MongoClient; // MongoDB client
let bodyParser = require('body-parser'); // Middleware for parsing request data
const cors = require('cors'); // CORS middleware for enabling cross-origin requests
const dotenv = require('dotenv'); // Environment variable configuration
let app = express(); // Create an Express application

// Middleware 
// Use CORS middleware to enable cross-origin requests
app.use(cors());

// Use body-parser middleware to parse request data
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json();

// Serve the HTML file at the root URL '/'
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

// Serve profile picture as an image
app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.png"));
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(img, 'binary');
});

// Set MongoDB connection URLs for local and Docker environments
const mongoUrlLocal = process.env.MONGO_URL_LOCAL;
const mongoUrlDocker = process.env.MONGO_URL_DOCKER;

// Configure MongoDB client options to avoid DeprecationWarning
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// Define the database name
let databaseName = "docker-app";

// Update user profile data
app.post('/update-profile', function (req, res) {
  let userObj = req.body;

  // Connect to the local MongoDB
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    userObj['userid'] = 1;

    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };

    // Update the user's profile data
    db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, result) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});

// Retrieve user profile data
app.get('/get-profile', function (req, res) {
  let response = {};
  
  // Connect to the local MongoDB
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);

    let myquery = { userid: 1 };

    // Retrieve the user's profile data
    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      // Send response
      res.send(response ? response : {});
    });
  });
});

// Start the Express server on port 3000
app.listen(3000, function () {
  console.log("app listening on port 3000!");
});

