/*
 *     Purpose: Quiz model for db
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// require these modules for our user model
let mongoose = require("mongoose");

let QuizSchema = mongoose.Schema({
  user_id: String,
  user_name: String,
  name: String,
  stakeholder: String,
  badge: String,
  questions: [{
    category: String,
    question: String,
    options: [String],
    answer: Number
  }]
},
  {
    collection: "quiz"
  });

// Make it available for import
module.exports = mongoose.model('Quiz', QuizSchema);
