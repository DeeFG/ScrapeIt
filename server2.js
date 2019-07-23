// Your assignment is to define the routes below. Good luck!

// Dependencies
var express = require("express");
var logger = require("morgan");
var mongojs = require("mongojs");
var db = require("./models");

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

// Routes
// ======

// ===============================ROUTES==============================
require("./routes/api-routes.js")(app);


//handlebars
app.engine("handlebars", exphbs({ 
    defaultLayout: "main",
    partialsDir: [
          'views/partials/'
    ] 
  }));
  app.set("view engine", "handlebars");
  



// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});