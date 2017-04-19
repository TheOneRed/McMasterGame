/*
 *     Purpose: Answer model for db
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// require these modules for our user model
let mongoose = require("mongoose");

let AnswerSchema = mongoose.Schema({
  answered: Number,
  stakeholder: String,
  badge: String,
  takenBy: String,
  questions: [{
    category: String,
    answers: [String]
  }]
},
  {
    collection: "answer"
  });

// Make it available for import
module.exports = mongoose.model('Answer', AnswerSchema);
