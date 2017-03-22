// require these modules for our quest model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let BadgeSchema = new Schema({
    name: string
}, {
    collection: "badges"
});

exports.Badge = mongoose.model('Badge', BadgeSchema);