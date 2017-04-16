/*
 *     Purpose: Quest model for db
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Require these modules for our quest model
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

// Make it available for import
exports.Quest = mongoose.model('Quest', QuestSchema);