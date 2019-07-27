"use strict";

// dependencies
// =============================================================
const express = require("express"),
  router = express.Router(),
  db = require("../models");

// root route
router.get("/", function(req, res) {
  db.Article.find({})
    // .where("saved")
    // .equals(false)
    // .where("deleted")
    // .equals(false)
    // .limit(10)
    .exec(function(error, articles) {
      var flag = false;
      if (articles.length == 0) {
        flag = true;
      } else {
        flag = false;
      }
      console.log("obj empty flag in home api-route:", flag, "\n");
      console.log(articles)
      res.render("index", { articleObj: articles, objEmpty: flag });
      // if (error) {
      //     console.log(error);
      //     res.status(500);
      // } else {
      //     console.log(articles);
      //     let hbsObj = {
      //         title: 'All the News That\'s Fit to Scrape',
      //         subtitle: 'Hacker News Edition',
      //         articles: articles
      //     };
      //     console.log(hbsObj)
      //     res.render('index', {data: hbsObj});
      // }
    });
});

// saved articles
router.get("/saved", function(req, res) {
  db.Article.find({})
    .where("saved")
    .equals(true)
    .where("deleted")
    .equals(false)
    .populate("comments")
    .exec(function(error, articles) {
      var flag = false;
      if (articles.length == 0) {
        flag = true;
      } else {
        flag = false;
      }
      console.log("obj empty flag in saved articles api-route:", flag);
      res.render("saved", { articleObj: articles, objEmpty: flag });
    })
    .catch(function(err) {
      res.json(err);
    });
  //   if (error) {
  //     console.log(error);
  //     res.status(500);
  //   } else {
  //     console.log(articles);
  //     let hbsObj = {
  //       title: "All the News That's Fit to Scrape",
  //       subtitle: "Saved Hacker News",
  //       articles: articles
  //     };
  //     res.render("saved", hbsObj);
  //   }
  // });
});




// require controllers
router.use("/api", require("./api-routes"));

module.exports = router;
