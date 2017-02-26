// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create user schema
var UserSchema = new Schema({
  // firstname is a required string
  firstname: {
    type: String,
    required: true
  },
  // lastname is a required string
  lastname: {
    type: String,
    required: true
  },
  // region is optional string
  region: {
      type: String,
      required: false
  },
  // group is optional string
  group:{
    type:string,
    required: false
  }
});

// Create the User model with the UserSchema
var User = mongoose.model("User", UserSchema);

// Export User the model
module.exports = User;