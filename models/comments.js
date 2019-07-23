var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var CommentModel = new Schema({
	//note type string
  	articleComment: String
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentModel);

// Export the Comment model
module.exports = Comment;