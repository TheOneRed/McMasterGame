// require these modules for our quest model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let PlaySchema = new Schema({
    username: String,
    questName: String,
    result: String,
    assignedBadge: String,
    assignedStakeholder: String
}, {
    collection: "plays"
});

exports.Play = mongoose.model('Play', PlaySchema);