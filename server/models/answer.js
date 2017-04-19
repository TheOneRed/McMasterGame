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

module.exports = mongoose.model('Answer', AnswerSchema);
