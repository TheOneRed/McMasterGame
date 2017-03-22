// require these modules for our stakeholder model
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let StakeholderSchema = new Schema({
    name: string,
    badges: [{
        badgeName: string
    }],
    
}, {
    collection: "stakeholders"
});

exports.Stakeholder = mongoose.model('Stakeholder', StakeholderSchema);