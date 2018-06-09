// Create the required custom methods at the bottom of this file

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new Schema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
   //Article class="item has-image"
  title: {
    //h2 class="title"
    type: String,
    trim: true,
    
  },
 summary: {
    //a text
    type: String,
    trim: true,
    
  },
  
  link: {
    //a href
    type: String,
    trim: true,
    
  },

  image: {
    //img class="respArchListImg"
    type: String,
    trim: true,
     
  },
  note: {
      type: Schema.Types.ObjectId,
      ref: "Note"
  }

});


// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;