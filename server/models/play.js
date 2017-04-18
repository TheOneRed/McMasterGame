/*
 *     Purpose: Play model for db
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Require these modules for our quest model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let PlaySchema = new Schema({
    username: String,
    questName: String,
    result: String,
    assignedBadge: String,
    assignedStakeholder: String
},
    {
        collection: "plays"
    });

// Make it available for import
exports.Play = mongoose.model('Play', PlaySchema);