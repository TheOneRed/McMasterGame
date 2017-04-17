/*
 *     Purpose: Main routers for the website
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Required imports
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
  if (process.env.NODE_ENV != 'test') {
    if (!req.isAuthenticated()) {
      return res.redirect('user/login');
    }
  }
  next();
}

/* GET home page. */
router.get('/', requireAuth, (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    username: req.user ? req.user.username : ''
  });
});

/* GET leader page. */
router.get('/leader', requireAuth, (req, res, next) => {
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
          res.render('content/leaderboard', {
            title: 'Leaderboard',
            stakeholders: fondStakeholders,
            quest: fondQuest,
            username: req.user ? req.user.username : ''
          });
        }
      });
    }
  });
});

/* GET badge page. */
router.get('/badge', requireAuth, (req, res, next) => {
  res.render('content/badge', {
    title: 'Badge',
    username: req.user ? req.user.username : ''
  });
});

/* GET profile page. */
router.get('/profile', requireAuth, (req, res, next) => {
  res.render('content/profile', {
    title: 'Profile',
    username: req.user ? req.user.username : ''
  });
});

/* GET create page. */
router.get('/create', requireAuth, (req, res, next) => {
  Stakeholder.find((err, stakeholders) => {
    if (err) {
      console.error(err);
      res.end(error);
    } else {
      res.render('content/create', {
        title: 'Create',
        stakeholders: stakeholders,
        username: req.user ? req.user.username : ''
      });
    }
  });
});

/* POST newstakeholder page. */
router.post('/newstakeholder', requireAuth, (req, res, next) => {
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
});

/* POST newquest page. */
router.post('/newquest', requireAuth, (req, res, next) => {
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
});

/* GET Edit page. */
router.get('/edit', requireAuth, (req, res, next) => {
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
            username: req.user ? req.user.username : ''
          });
        }
      });
    }
  });
});

/* GET Delete Stakeholder page. */
router.get('/deletestakeholder/:id', requireAuth, (req, res, next) => {
  let id = req.params.id;
  Stakeholder.remove({ _id: id }, (err) => {
    if (err) {
      console.error(err);
      res.end(error);
    } else {
      res.redirect('/edit')
    }
  });
});

/* GET Remove Quest page. */
router.get('/removequest/:id', requireAuth, (req, res, next) => {
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
});

/* GET Delete Quest page. */
router.get('/deletequest/:id', requireAuth, (req, res, next) => {
  let id = req.params.id;
  Quest.remove({ _id: id }, (err) => {
    if (err) {
      console.error(err);
      res.end(error);
    } else {
      res.redirect('/edit')
    }
  });
});

module.exports = router;