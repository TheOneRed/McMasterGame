// require these modules for our quest model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let BadgeSchema = new Schema({
    name: String,
    picName: String
}, {
    collection: "badges"
});

exports.Badge = mongoose.model('Badge', BadgeSchema);