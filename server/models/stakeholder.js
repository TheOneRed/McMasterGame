// require these modules for our stakeholder model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let StakeholderSchema = new Schema({
    name: {
        type: String,
        required: "Stakeholder's name is required"
    },
    badges: [{
        badge_id: Number
    }],
    
}, {
    collection: "stakeholders"
});

exports.Stakeholder = mongoose.model('Stakeholder', StakeholderSchema);