let express = require('express');
let router = express.Router();

let passport = require('passport');
let UserModel = require('../models/users');
let User = UserModel.User;

// define the Stakeholder model
let StakeholderModel = require('../models/stakeholder');
let Stakeholder = StakeholderModel.Stakeholder; // alias for Stakeholder

// define the quest model
let QuestModel = require('../models/quest');
let Quest = QuestModel.Quest; // alias for quest

//check if authenticated
function requireAuth(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('user/login');
  }
  next();
}

/* GET home page. */
router.get('/',requireAuth,  (req, res, next) => {
  res.render('content/index', { 
    title: 'Home',
    username: req.user ? req.user.username : '' });
});

/* GET leader page. */
router.get('/leader',requireAuth,  (req, res, next) => {
  Stakeholder.find((err, stakeholders) => {
  if (err) {
    return console.error(err);
  } else {
    res.render('content/leaderboard', {
        title: 'Leaderboard',
        stakeholders: stakeholders,
        username: req.user ? req.user.username : '' });
  }});
});

/* GET badge page. */
router.get('/badge',requireAuth,  (req, res, next) => {
  res.render('content/badge', { 
    title: 'Badge',
    username: req.user ? req.user.username : '' });
});

/* GET profile page. */
router.get('/profile',requireAuth,  (req, res, next) => {
  res.render('content/profile', { 
    title: 'Profile',
    username: req.user ? req.user.username : '' });
});

/* GET create page. */
router.get('/create',requireAuth,  (req, res, next) => {
  Stakeholder.find((err, stakeholders) => {
  if (err) {
    return console.error(err);
  } else {
    res.render('content/Create', {
        title: 'Create',
        stakeholders: stakeholders,
        username: req.user ? req.user.username : '' });
  }});
});

/* POST newstakeholder page. */
router.post('/newstakeholder',requireAuth,  (req, res, next) => {
  let newStakeholder = new Stakeholder({
    "name": req.body.stakeholderName
  });

  Stakeholder.create(newStakeholder, (err) => {
    if (err) {
      console.error(err);
      res.end(error);
    } else {
        res.redirect('/create')
    }
  });
});

/* POST newquest page. */
router.post('/newquest',requireAuth,  (req, res, next) => {
  if (req.body.stakeholders == "NULL"){
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
        stakeholder.badges.push(newQuest._id);

        for(let i= 0; i < stakeholder.badges.length; i++){
          console.log("-" + stakeholder.badges[i].badge_id);
        }

        Stakeholder.update({_id: stakeholders_id}, stakeholder, (err) => {
          if (err) {
            console.error(err);
            res.end(error);
          }
        });
      }
    });

    res.redirect('/create')
  }
});

module.exports = router;