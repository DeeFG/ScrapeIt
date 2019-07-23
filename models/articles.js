var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleModel = new Schema({
  // `title` is required and of type String
  header: {
    type: String,
    required: true,
    unique: true
  },
  // `link` is required and of type String
  summary: {
    type: String,
    // required: true
  },
  link: {
    type: String,
    required: true
  },
  
  imageURL: {
    type: String
    // required: true
  },
  savedArticle: {
    type: Boolean,
    default: false
  },
  // `comment` is an object that stores a comment id
  // The ref property links the ObjectId to the comment model
  // This allows us to populate the Article with an associated comment
  comment: {
    type: Schema.Types.ObjectId,
    ref: "comment"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleModel);

// Export the Article model
module.exports = Article;