// require these modules for our user model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new Schema({
  username: {
    type: String,
    default: '',
    trim: true,
    required: 'username is required'
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: 'email is required'
  }
},
{
  collection: "users"
});

let options = ({missingPasswordError: "Wrong Password"});

UserSchema.plugin(passportLocalMongoose, options);

exports.User = mongoose.model('User', UserSchema);
