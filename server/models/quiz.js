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

module.exports = mongoose.model('Quiz', QuizSchema);
