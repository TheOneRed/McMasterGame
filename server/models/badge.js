/*
 *     Purpose: Badge model for db
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Require these modules for our quest model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let BadgeSchema = new Schema({
    name: String,
    picName: String
},
    {
        collection: "badges"
    });

// Make it available for import
exports.Badge = mongoose.model('Badge', BadgeSchema);