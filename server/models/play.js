// require these modules for our quest model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let PlaySchema = new Schema({
    username: string,
    questName: string,
    result: string,
    assignedBadge: string,
    assignedStakeholder: string
}, {
    collection: "plays"
});

exports.Play = mongoose.model('Play', PlaySchema);