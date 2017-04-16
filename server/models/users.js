/*
 *     Purpose: User model for db
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Require these modules for our stakeholder model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: 'username is required'
  },
  email: {
    type: String,
    trim: true,
    required: 'email is required'
  },
  user_type: {
    type: String,
    default: "Student"
  }
},
  {
    collection: "users"
  });

let options = ({ missingPasswordError: "Wrong Password" });

// Inject auth functionality
UserSchema.plugin(passportLocalMongoose, options);

// Make it available for import
exports.User = mongoose.model('User', UserSchema);
