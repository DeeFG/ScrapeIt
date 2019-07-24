var db = require("../models");
// Scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method. It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Routes
module.exports = function(app) {
  //home page
  app.get("/", function(req, res) {
    db.Article.find({ savedArticle: false }).then(function(dbArticle) {
      console.log("inside home api-route");
      var flag = false;
      if (dbArticle.length == 0) {
        flag = true;
      } else {
        flag = false;
      }
      console.log("obj empty flag in home api-route:", flag, "\n");
      res.render("index", { articleObj: dbArticle, objEmpty: flag });
    });
  });

  // get saved articles
  app.get("/api/getSavedArticles", function(req, res) {
    db.Article.find({ savedArticle: true })
      .then(function(dbArticle) {
        // console.log("inside saved Article api-route",dbArticle);
        var flag = false;
        if (dbArticle.length == 0) {
          flag = true;
        } else {
          flag = false;
        }
        console.log("obj empty flag in saved articles api-route:", flag);
        res.render("savedArticles", { articleObj: dbArticle, objEmpty: flag });
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // A GET route for scraping new articles
  app.get("/api/scrapeNewArticles", function(req, res) {
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
        var header = $(element)
          .find(".article__header-title")
          .text();
        var summary = $(element)
          .find("p")
          .text();
        var linkURL = $(element)
          .find("a")
          .attr("href");
        var imageURL = $(element)
          .find("a")
          .find("img")
          .attr("src");

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          header: header,
          summary: summary,
          link: linkURL,
          image: imageURL
        });
      });

      // Log the results once you've looped through each of the elements found with cheerio
      console.log(results);
    });

    db.Article.create(result, function(err, result) {
      if (err) {
        console.log("error in create:", err);
        var len = 0;
        res.json(len);
      } else {
        console.log("Scrape article complete length:", result.length);
        res.json(result.length);
      }
    });
  }); // end axios
  // }); // end api

  //save article
  app.get("/api/saveArticle/:articleId", function(req, res) {
    db.Article.findOneAndUpdate(
      { _id: req.params.articleId },
      { savedArticle: true }
    )
      .then(function(dbArticle) {
        console.log("Save Complete");
      })
      .catch(function(err) {
        res.json(err);
      });
    res.redirect("/"); //render page
  });

  //delete article from saved
  app.get("/api/deleteFromSaved/:articleId", function(req, res) {
    db.Article.findOneAndUpdate(
      { _id: req.params.articleId },
      { savedArticle: false }
    )
      .then(function(dbArticle) {
        console.log("unsave Complete");
      })
      .catch(function(err) {
        res.json(err);
      });
    res.redirect("/api/getSavedArticles"); //render page
  });

  //get existing comments
  app.get("/api/getSavedcomments/:articleId", function(req, res) {
    db.Article.findOne({ _id: req.params.articleId })
      .populate("comment")
      .then(function(dbArticle) {
        console.log(
          "inside get saved comments - dbArticle, populate comment:",
          dbArticle
        );
        var nocomment;
        if (dbArticle.length > 0) {
          nocomment = true;
          //render modal
          res.render("partials/savecommentModal", {
            existingcommentObj: dbArticle,
            nocommentObj: nocomment
          });
        } else {
          nocomment = false;
          res.render("partials/savecommentModal", {
            existingcommentObj: dbArticle,
            nocommentObj: nocomment
          });
        }
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
    // res.redirect("/api/getSavedArticles"); //render page
  });

  //add new comment
  app.post("/api/addcomment/:id", function(req, res) {
    // Create a new comment and pass the req.body to the entry
    db.comment
      .create(req.body)
      .then(function(dbcomment) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { comment: dbcomment._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        console.log(dbArticle);
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  //delete comment
};

///==================================================================================================
// var db = require("../models");
// // Scraping tools
// var axios = require("axios");
// var cheerio = require("cheerio");

// // Post a article to the mongoose database
// app.post("/submit", function (req, res) {
//     // Save the request body as an object called article
//     var article = req.body;

//     // If we want the object to have a boolean value of false,
//     // we have to do it here, because the ajax post will convert it
//     // to a string instead of a boolean
//     article.save = false;
//     db.articles.create(article).then(data => res.json(data));
//   });

//   // Find all articles marked as save
//   app.get("/save", function (req, res) {
//     db.articles.find({ "save": true }).then(res.json)
//   });

//   //=============================???????????????????????????

//   // Find all articles marked as unread
//   app.get("/unread", function (req, res) {
//     db.articles.find({ 'read': false }).then(res.json)
//   });

//   // Mark a article as having been read
//   app.put("/markread/:id", function (req, res) {
//     // Remember: when searching by an id, the id needs to be passed in
//     // as (mongojs.ObjectId(IdYouWantToFind))
//     // PAULINA
//     updateRead(true, req.params.id).then(res.json);
//   });

//   // Mark a article as having been not read
//   app.put("/markunread/:id", function (req, res) {
//     // Remember: when searching by an id, the id needs to be passed in
//     // as (mongojs.ObjectId(IdYouWantToFind))
//     updateRead(false, req.params.id).then(res.json);
//   });

//   function updateRead(read, id) {
//     return db.articles.update({
//       id: mongojs.ObjectId(id)
//     }, {
//         $set: { read }
//       })
//   }

//   // ==========================================????

//   var db = require("../models");
// // Scraping tools
// // Axios is a promised-based http library, similar to jQuery's Ajax method. It works on the client and on the server
// var axios = require("axios");
// var cheerio = require("cheerio");

// // Routes
// module.exports = function(app) {

//   //home page
//   app.get("/", function(req, res) {
//     db.Article.find({savedArticle: false})
//     .then(function(dbArticle) {
//       console.log("inside home api-route");
//       var flag=false;
//       if(dbArticle.length == 0) {
//         flag=true;
//       } else {
//         flag=false;
//       }
//       console.log("obj empty flag in home api-route:",flag,"\n");
//       res.render("index", {articleObj: dbArticle, objEmpty: flag});
//     });
//   });

//   // get saved articles
//   app.get("/api/getSavedArticles", function(req, res) {
//     db.Article
//       .find({savedArticle: true})
//       .then(function(dbArticle) {
//         // console.log("inside saved Article api-route",dbArticle);
//         var flag=false;
//         if(dbArticle.length == 0) {
//           flag=true;
//         } else {
//           flag=false;
//         }
//         console.log("obj empty flag in saved articles api-route:",flag);
//         res.render("savedArticles", {articleObj: dbArticle, objEmpty: flag});
//       })
//       .catch(function(err) {
//         res.json(err);
//     });
//   });

//   // A GET route for scraping new articles
//   app.post("/api/scrapeNewArticles", function(req, res) {
//     var result=[];
//     // First, we grab the body of the html with request
//     axios.get("https://www.nytimes.com/").then(function(response) {
//       // Then, we load that into cheerio and save it to $ for a shorthand selector
//       var $ = cheerio.load(response.data);
//       // Now, we grab every h2, a, img within an article tag, and do the following:
//       $(".collection article").each(function(i, element) {
//         var imageURL;
//         var noImageAvail = "https://portal.meril.eu/meril/img/NoImageAvailable.png";
//         var headline = $(this).children("h2").children("a").text().trim();
//         var link = $(this).children("h2").children("a").attr("href");
//         var byline = $(this).children(".byline").text().trim();
//         var summary = $(this).children(".summary").text().trim();
//         var artImage = $(this).children(".media").children(".image").children("a").children("img").attr("src");

//         if(headline !== "" && summary !== "" && link !== "") {
//           if (typeof artImage === "undefined") {
//             // console.log("no image found.");
//             imageURL = noImageAvail;
//           } else {
//             // console.log("image found.");
//             imageURL = artImage;
//           }
//           // Add the text and href of every link, and save them as properties of the result object
//           var temp = {
//             "headline": headline,
//             "link": link,
//             "byline": byline,
//             "summary": summary,
//             "imageURL": imageURL
//           };
//           // console.log("temp:",temp);
//           result.push(temp);
//         } // end if
//       }); //end each
//       // console.log("result array:",result);
//       db.Article
//       .create(result, function(err, result) {
//         if(err) {
//           console.log("error in create:", err);
//           var len=0;
//           res.json(len);
//         } else {
//           console.log("Scrape article complete length:", result.length);
//           res.json(result.length);
//         }
//       });
//     }); // end axios
//   }); // end api

//   //save article
//   app.get("/api/saveArticle/:articleId", function(req, res) {
//     db.Article
//     .findOneAndUpdate({ _id: req.params.articleId }, {savedArticle: true})
//     .then(function(dbArticle) {
//       console.log("Save Complete");
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
//     res.redirect("/"); //render page
//   });

//   //delete article from saved
//   app.get("/api/deleteFromSaved/:articleId", function(req, res) {
//     db.Article
//     .findOneAndUpdate({ _id: req.params.articleId }, {savedArticle: false})
//     .then(function(dbArticle) {
//       console.log("unsave Complete");
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
//     res.redirect("/api/getSavedArticles"); //render page
//   });

//   //get existing notes
//   app.get("/api/getSavedNotes/:articleId", function(req, res) {
//     db.Article
//     .findOne({_id: req.params.articleId})
//     .populate("note")
//     .then(function(dbArticle) {
//       console.log("inside get saved notes - dbArticle, populate note:", dbArticle);
//       var noNote;
//       if(dbArticle.length > 0) {
//         noNote = true;
//         //render modal
//         res.render("partials/saveNoteModal", {existingNoteObj: dbArticle, noNoteObj: noNote});
//       } else {
//         noNote = false;
//         res.render("partials/saveNoteModal", {existingNoteObj: dbArticle, noNoteObj: noNote});
//       }
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
//     // res.redirect("/api/getSavedArticles"); //render page
//   });

// //add new note
// app.post("/api/addNote/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note
//     .create(req.body)
//     .then(function(dbNote) {
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       console.log(dbArticle);
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

//   //delete note

// }
