
// Dependencies
var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var logger = require("morgan");
var mongojs = require("mongojs");
var mongoose = require("mongoose");

// Initialize Express
var app = express();

// Configure our app for morgan and body parsing with express.json and express.urlEncoded
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Mongojs configuration

// Mongojs configuration
var databaseUrl = "scrapeItApp";
var collections = ["articles"];

// Hook our mongojs config to the db var
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_b2tj6rs5:kalrqo2br8jnlglquskqboevta@ds223756.mlab.com:23756/heroku_b2tj6rs5 ";
mongoose.connect(MONGODB_URI);
//????????????????
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
  console.log("Database Error:", error);
});

//handlebars
// app.engine("handlebars", exphbs({ defaultLayout: "main"}));
// app.set("view engine", "handlebars");
  
// ===============================ROUTES==============================
// require("./routes/api-routes.js")(app);


// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});









// Make a request via axios to grab the HTML body from the site of your choice
axios.get("https://www.tmz.com/").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $(".article").each(function(i, element) {

    var header = $(element).find(".article__header-title").text();
    var summary = $(element).find("p").text();
    var linkURL = $(element).find("a").attr("href");
    var imageURL = $(element).find("a").find("img").attr("src");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      header: header,
      summary: summary,
      link: linkURL,
      image:imageURL
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});






// // Routes
// // ======

// // TODO: Fill in each route so that the server performs
// // the proper mongojs functions for the site to function
// // -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/

// // Post a book to the mongoose database
// app.post("/submit", function (req, res) {
//   // Save the request body as an object called book
//   var book = req.body;

//   // If we want the object to have a boolean value of false,
//   // we have to do it here, because the ajax post will convert it
//   // to a string instead of a boolean
//   book.read = false;
//   db.books.create(book).then(data => res.json(data));
// });

// // Find all books marked as read
// app.get("/read", function (req, res) {
//   // JAMIE
//   db.books.find({ "read": true }).then(res.json)
// });

// // Find all books marked as unread
// app.get("/unread", function (req, res) {
//   //WILL
//   db.books.find({
//     'read': false
//   }).then(res.json)
// });

// // Mark a book as having been read
// app.put("/markread/:id", function (req, res) {
//   // Remember: when searching by an id, the id needs to be passed in
//   // as (mongojs.ObjectId(IdYouWantToFind))
//   // PAULINA
//   updateRead(true, req.params.id).then(res.json);
// });

// // Mark a book as having been not read
// app.put("/markunread/:id", function (req, res) {
//   // Remember: when searching by an id, the id needs to be passed in
//   // as (mongojs.ObjectId(IdYouWantToFind))
//   updateRead(false, req.params.id).then(res.json);
// });

// function updateRead(read, id) {
//   return db.books.update({
//     id: mongojs.ObjectId(id)
//   }, {
//       $set: { read }
//     })
// }




