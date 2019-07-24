
// // Dependencies
// var cheerio = require("cheerio");
// var axios = require("axios");
// var express = require("express");
// var bodyParser = require('body-parser'),
// var logger = require("morgan");
// var mongojs = require("mongojs");
// var mongoose = require("mongoose");

// // port
// const PORT = process.env.PORT || 8000;

// // Initialize Express
// var app = express();

// // Configure our app for morgan and body parsing with express.json and express.urlEncoded
// app.use(logger("dev"));

// // Parse request body as JSON
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Make public a static folder
// app.use(express.static("public"));

// // Mongojs configuration

// // Mongojs configuration
// // var databaseUrl = "scrapeItApp";
// // var collections = ["articles"]

// // Hook our mongojs config to the db var
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI, {useNewUrlParser: true });

// //????????????????
// // var db = mongojs(databaseUrl, collections);

// // db.on("error", function (error) {
// //   console.log("Database Error:", error);
// // });

// //handlebars
// // app.engine("handlebars", exphbs({ defaultLayout: "main"}));
// // app.set("view engine", "handlebars");
  
// // ===============================ROUTES==============================
// // require("./routes/api-routes.js")(app);


// // Listen on port 3000
// app.listen(3000, function () {
//   console.log("App running on port 3000!");
// });

'use strict';





// dependencies
// =============================================================
const express = require('express'),
      exphbs = require('express-handlebars'),
      bodyParser = require('body-parser'),
      logger = require('morgan'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override');

// set up express app
// =============================================================
const PORT = process.env.PORT || 8000;
let app = express();

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended:true }))
    .use(bodyParser.text())
    .use(bodyParser.json({ type: 'application/vnd.api+json' }))
    .use(methodOverride('_method'))
    .use(logger('dev'))
    .use(express.static(__dirname + '/public'))
    .engine('handlebars', exphbs({ defaultLayout: 'main' }))
    .set('view engine', 'handlebars')
    .use(require('./routes/api-routes.js'));

// configure mongoose and start the server
// =============================================================
// set mongoose to leverage promises
mongoose.Promise = Promise;


// Database configuration with mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true });
mongoose.set('useCreateIndex', true)
// mongoose.connect(dbURI, { useNewUrlParser: true });

const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
    // start the server, listen on port 3000
    app.listen(PORT, function() {
        console.log("App running on port " + PORT);
    });
});

module.exports = app;
    
