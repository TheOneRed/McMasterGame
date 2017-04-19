/*
 *     Purpose: Main controllers for the website
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Define the Stakeholder model
let StakeholderModel = require('../models/stakeholder');
let Stakeholder = StakeholderModel.Stakeholder; // alias for Stakeholder

// Define the quest model
let QuestModel = require('../models/quest');
let Quest = QuestModel.Quest; // alias for quest

// Define the play model
let PlayModel = require('../models/play');
let Play = PlayModel.Play; // alias for quest

/* home page controller */
module.exports.DisplayHome = (req, res) => {
    res.render('content/index', {
        title: 'Home',
        username: req.user ? req.user.username : '',
        user_type: req.user ? req.user.user_type : ''
    });
}

/* leader page controller */
module.exports.DisplayLeader = (req, res) => {
    Play.find((err, outPlay) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            res.render('content/leaderboard', {
                title: 'Leaderboard',
                leaders: outPlay,
                username: req.user ? req.user.username : '',
                user_type: req.user ? req.user.user_type : ''
            });
        }
    });
}

/* badge page controller */
module.exports.DisplayBadge = (req, res) => {
    res.render('content/badge', {
        title: 'Badge',
        username: req.user ? req.user.username : '',
        user_type: req.user ? req.user.user_type : ''
    });
}

/* profile page controller */
module.exports.DisplayProfile = (req, res) => {
    res.render('content/profile', {
        title: 'Profile',
        username: req.user ? req.user.username : '',
        user_type: req.user ? req.user.user_type : ''
    });
}

/* create page controller */
module.exports.DisplayCreate = (req, res) => {
    Stakeholder.find((err, stakeholders) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            res.render('content/create', {
                title: 'Create',
                stakeholders: stakeholders,
                username: req.user ? req.user.username : '',
                user_type: req.user ? req.user.user_type : ''
            });
        }
    });
}

/* newstakeholder page controller */
module.exports.CreateStakeHolder = (req, res) => {
    let newStakeholder = new Stakeholder({
        "name": req.body.stakeholderName,
        "badges_id": []
    });

    Stakeholder.create(newStakeholder, (err) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            res.redirect('/create')
        }
    });
}

/* newquest page controller */
module.exports.CreateQuest = (req, res) => {
    if (req.body.stakeholders == "NULL") {
        res.redirect('/create')
    } else {
        let newQuest = new Quest({
            "name": req.body.questName
        });

        Quest.create(newQuest, (err) => {
            if (err) {
                console.error(err);
                res.end(error);
            }
        });

        let stakeholders_id = req.body.stakeholders;
        Stakeholder.findById(stakeholders_id, (err, stakeholder) => {
            if (err) {
                console.error(err);
                res.end(error);
            } else {
                stakeholder.badges_ids.push(newQuest._id);

                for (let i = 0; i < stakeholder.badges_ids.length; i++) {
                    console.log("-" + stakeholder.badges_ids[i]);
                }

                Stakeholder.update({ _id: stakeholders_id }, stakeholder, (err) => {
                    if (err) {
                        console.error(err);
                        res.end(error);
                    }
                });
            }
        });
        res.redirect('/create');
    }
}

/* edit page controller */
module.exports.DisplayEdit = (req, res) => {
    Stakeholder.find((err, fondStakeholders) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            Quest.find((err, fondQuest) => {
                if (err) {
                    console.error(err);
                    res.end(error);
                } else {
                    res.render('content/edit', {
                        title: 'Edit',
                        stakeholders: fondStakeholders,
                        quest: fondQuest,
                        username: req.user ? req.user.username : '',
                        user_type: req.user ? req.user.user_type : ''
                    });
                }
            });
        }
    });
}

/* delete Stakeholder page controller */
module.exports.DeleteStakeHolder = (req, res) => {
    let id = req.params.id;
    Stakeholder.remove({ _id: id }, (err) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            res.redirect('/edit')
        }
    });
}

/* Remove Quest page controller */
module.exports.RemoveQuest = (req, res) => {
    let id = req.params.id;
    let ids = id.split("!");

    Stakeholder.findById(ids[0], (err, fondStakeholder) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            let index = fondStakeholder.badges_ids.indexOf(ids[1]);

            if (index > -1) {
                fondStakeholder.badges_ids.splice(index, 1);
            }

            Stakeholder.update({ _id: fondStakeholder._id }, fondStakeholder, (err) => {
                if (err) {
                    console.error(err);
                    res.end(error);
                }
            });
        }
    });

    res.redirect('/edit');
}

/* Delete Quest page controller */
module.exports.DeleteQuest = (req, res) => {
    let id = req.params.id;
    Quest.remove({ _id: id }, (err) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            res.redirect('/edit')
        }
    });
}