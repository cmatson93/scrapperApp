// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var port = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var Note = require("./models/Note");
var Article = require("./models/Article");



// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/businessinsider_db";
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Require Routes
require("./controller/routes.js")(app);


// Set the app to listen on port 3000
app.listen(port, function() {
  console.log("App running on port 3000!");
});


