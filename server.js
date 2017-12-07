// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "businessInsider_db";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
app.get("/", function(req, res){
  // db.articles.drop();
  db.article.find({}), function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  };
})

// 2. At the "/all" path, display every entry in the animals collection
app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.articles.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
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
      
      var imgLink = $(element).find("a").attr("href");
      var title = $(element).text();

      // Push the image's URL (saved to the imgLink var) into the results array
      db.articles.insert({ 
        "title": title,
        "link": imgLink
       }, function(err, inserted){
        if (err) {
          console.log(err);
        }
        else {
          console.log(inserted);
        }
       });
    });

  });
})
// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


