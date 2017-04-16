/*
 *     Purpose: Quest model for db
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Require these modules for our stakeholder model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let StakeholderSchema = new Schema({
    name: {
        type: String,
        required: "Stakeholder's name is required"
    },
    badges_ids: [String],

}, {
        collection: "stakeholders"
    });

// Make it available for import
exports.Stakeholder = mongoose.model('Stakeholder', StakeholderSchema);