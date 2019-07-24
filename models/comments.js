const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

const CommentModel = new Schema({
	//note type string
  	articleComment: {
		type: String,
		required: true
	  },
});

// This creates our model from the above schema, using mongoose's model method
const Comment = mongoose.model("Comment", CommentModel);

// Export the Comment model
module.exports = Comment;