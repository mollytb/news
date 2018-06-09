var cheerio = require("cheerio");
var request = require("request");

// First, tell the console what server2.js is doing
console.log("\n******************************************\n" +
    "Grabbing every article headline and link\n" +
    "from the NPR website:" +
    "\n******************************************\n");
app.get("/scrape", function (req, res) {
    // Making a request for `npr.com`'s homepage
    request("https://www.npr.org/sections/news/", function (error, response, html) {

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
            });
            // Make an object with data we scraped for this h4 and push it to the results array

        });

        // After looping through each h2.title-link, log the results
        console.log(results);
    });
});