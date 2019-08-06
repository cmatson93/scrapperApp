//Dependencies
var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");

var Note = require("../models/Note");
var Article = require("../models/Article");

function allRoutes(app) {


	app.get("/", function(req, res) {
	  Article
	  .find({}).sort({created: -1})
	  .then(function(dbArticle) {
	    res.render("index", {articles: dbArticle});
	  })
	  .catch(function(err){
	    res.json(err);
	  });
	});


	app.get("/scrape", function(req, res){
	  // db.articles.drop();
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
	    res.redirect("/");
	  });
	})


	//NOTE ROUTES
	//Post a new note
	app.post("/note/:id", function(req, res) {
	  // console.log(req.body);
	  db.Note
	    .create(req.body)
	    .then(function(dbNote) {
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


	//Get a old note
	app.get("/note/:id", function(req, res) {
	  var id = req.params.id;
	  Article.findById(id).populate("note").exec(function(err, data) {
	    res.send(data);
	  })
	})

	// Route to update if an article is saved or not 
	app.post("/save/:id", function(req, res) {
	  db.Article
	    .findById(req.params.id)
	    .then(function(dbArticle) {
	      //Check to see if article is already saved. If so "delete" from saved artcles.
	      if (dbArticle.saved === true) {
	        db.Article.findByIdAndUpdate(req.params.id, {$set: {saved: false }}, function(err, data){
	          res.redirect("/");
	        });
	      }
	      //If article is not already saved that means user wants to save it. 
	      else {
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
	      res.render("index", {articles: found});
	    }
	  });
	})


}

module.exports = allRoutes;


