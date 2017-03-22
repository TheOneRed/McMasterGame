// require these modules for our quest model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let QuestSchema = new Schema({
    potentialBadges: [{
        badgeName: string
    }],
    name: string,
    questions: [{
        question: string,
        answers: [{
            answer: string
        }],
        correctAnswer: string
    }]
}, {
    collection: "quests"
});

exports.Quest = mongoose.model('Quest', QuestSchema);