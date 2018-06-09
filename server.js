
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var PORT = 3000;

// Requiring the `User` model for accessing the `users` collection
//var article = require("./articleModel.js");

var db = require("./models");
var PORT = 3000;
// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/news");

// Routes
app.get("/scrape", function (req, res) {
    // Making a request for `npr.com`'s homepage
    axios.get("https://www.npr.org/sections/news/", function (error, response, html) {

        // Load the body of the HTML into cheerio
        var $ = cheerio.load(html);

        // Empty array to save our scraped data
        var results = [];
        $("p.teaser").each(function (i, element) {
            result.summary = $(this).text();

        });

        $("img").each(function (i, element) {
            result.image = $(this).attr("src");

         

        });

        // With cheerio, find each article-tag with the class "item" and loop through the results
        $("h2.title").each(function (i, element) {

            // Save the text of the article-tag as "title"
            result.title = $(this).children().text();

            // Find the h4 tag's parent a-tag, and save it's href value as "link"
            result.link = $(this).children().attr("href");
            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
                
            })
            .catch(function(err){
                return res.json(err);
                console.log(results);
            });
            // Make an object with data we scraped for this h4 and push it to the results array
            res.send(dbArticle);
        });

        // After looping through each h2.title-link, log the results
        console.log(results);
    });
});
// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
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
    db.Note.create(req.body)
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


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});