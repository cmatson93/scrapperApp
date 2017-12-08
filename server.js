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
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var Note = require("./models/Note");
var Article = require("./models/Article");


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/businessinsider_db", {
  useMongoClient: true
});


app.get("/", function(req, res) {
  db.Article
  .find({})
  .then(function(dbArticle) {
    res.render("index", {articles: dbArticle});
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

      var entry = new Article(result);
      Article.find({title: result.title}, function(err, data) {
        if (data.length === 0) {
          entry.save(function(err, data) {
            if (err) throw err;
          });
        }
      });

    });
    console.log("---scrape Complete");
          res.redirect("/");
  });
})

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route to update if an article is saved or not 



//Route to get all saved Articles
app.get("/saved", function(req, res){
  db.Article 
  .find({saved: true}, function(error, found) {
    // Show any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the articles we found to the browser as a json
    else {
      res.json(found);
    }
  });
})






// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


