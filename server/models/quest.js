// require these modules for our quest model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let QuestSchema = new Schema({
    potentialBadges: [{
        badgeName: String
    }],
    name: String,
    questions: [{
        question: String,
        answers: [{
            answer: String
        }],
        correctAnswer: String
    }]
}, {
    collection: "quests"
});

exports.Quest = mongoose.model('Quest', QuestSchema);