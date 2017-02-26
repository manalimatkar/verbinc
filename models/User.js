// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var UserSchema = new Schema({
  // title is a required string
  firstname: {
    type: String,
    required: true
  },
  // link is a required string
  lastname: {
    type: String,
    required: true
  },
  // img is required string
  region: {
      type: String,
      required: false
  },
  group:{
    type:string,
    required: false
  }
});

// Create the Article model with the ArticleSchema
var User = mongoose.model("User", UserSchema);

// Export the model
module.exports = User;