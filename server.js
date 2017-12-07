// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/businessinsider_db", {
  useMongoClient: true
});

// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");


// // This makes sure that any errors are logged if mongodb runs into an issue
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

// Routes

app.get("/all", function(req, res) {
  db.Article
  .find({})
  .then(function(dbArticle) {
    res.json(dbArticle)
  })
  .catch(function(err){
    res.json(err);
  });
});

app.get("/scrape", function(req, res){
  // db.articles.drop();
  console.log("-----SCRAPPING-------");
  // Make request to grab the HTML from Business Insiders website 
  request("http://www.businessinsider.com/", function(error, response, html) {

    // Load the HTML into cheerio
    var $ = cheerio.load(html);

    $("h2.overridable").each(function(i, element) {

      var result = {};
      
      result.title = $(element).text();
      result.link = $(element).find("a").attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          res.send("Scrape Complete");
          console.log("---scrape Complete");
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });

    });

  });
})


// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


