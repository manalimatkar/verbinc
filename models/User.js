// Require mongoose
var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');
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
    type: String,
    required: false
  }
});

UserSchema.plugin(mongoosePaginate);

// Create the User model with the UserSchema
var User = mongoose.model("User", UserSchema);

// Export User the model
module.exports = User;