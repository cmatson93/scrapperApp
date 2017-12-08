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
  console.log("HOME");
  Article
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

//NOTE ROUTES
//Post a new note
app.post("/note/:id", function(req, res) {
  var note = new Note(req.body);
  note.save(function(err, doc) {
    if (err) throw err;
    Article.findByIdAndUpdate(req.params.id, {$set: {"note": doc._id}}, {new: true}, function(err, newdoc) {
      if (err) throw err;
      else {
        res.send(newdoc);
      }
    });
  });
});


//Get a old note
app.get("/note/:id", function(req, res) {
  var id = req.params.id;
  Article.findById(id).populate("note").exec(function(err, data) {
    res.send(data);
  })
})

// Route to update if an article is saved or not 
app.post("/save/:id", function(req, res) {
  console.log("changing saved");
  db.Article
    .findById(req.params.id)
    .then(function(dbArticle) {
      //Check to see if article is already saved. If so "delete" from saved artcles.
      console.log(dbArticle);
      if (dbArticle.saved === true) {
        console.log("was saved");
        db.Article.findByIdAndUpdate(req.params.id, {$set: {saved: false }}, function(err, data){
          res.redirect("/");
        });
      }
      //If article is not already saved that means user wants to save it. 
      else {
        console.log("was not saved");
        db.Article.findByIdAndUpdate(req.params.id, {$set: {saved:true}}, function(err, data){
          res.redirect("/saved");
        })
      }
    })
});


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
      // res.render("index", {articles: dbArticle});
      res.render("index", {articles: found});
    }
  });
})






// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


