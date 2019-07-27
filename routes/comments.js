const express = require('express'),
      router = express.Router(),
      request = require('request'),
      cheerio = require('cheerio'),
      Article = require('../../models/article'),
      comment = require('../../models/comment');

// get all comments
router.get('/', function(req, res) {
    comment
        .find({})
        .exec(function(err, comments) {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                res.status(200).json(comments);
            }
        });
});

// add a comment to a saved article
router.post('/:id', function(req, res) {
    let newcomment = new comment(req.body);
    newcomment.save(function(err, doc) {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { 'comments': doc.id } },
                function(error, newDoc) {
                    if (error) {
                        console.log(error);
                        res.status(500);
                    } else {
                        res.redirect('/saved');
                    }
                }
            );
        }
    });
});

// delete a comment from a saved article
router.delete('/:id', function(req, res) {
    comment.findByIdAndRemove(req.params.id, function(err, comment) {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            res.redirect('/saved');
        }
    });
});

module.exports = router;