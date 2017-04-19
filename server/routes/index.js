/*
 *     Purpose: Main routers for the website
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// Required imports
let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');
let userController = require('../controllers/user');
let quizController = require('../controllers/quiz');

/* GET home page. */
router.get('/', userController.RequireAuth, (req, res, next) => {
    indexController.DisplayHome(req, res);
});

/* GET leader page. */
router.get('/leader', userController.RequireAuth, (req, res, next) => {
    indexController.DisplayLeader(req, res);
});

/* GET badge page. */
router.get('/badge', userController.RequireAuth, (req, res, next) => {
    indexController.DisplayBadge(req, res);
});

/* GET profile page. */
router.get('/profile', userController.RequireAuth, (req, res, next) => {
    indexController.DisplayProfile(req, res);
});

/* GET create page. */
router.get('/create', userController.RequireAuth, (req, res, next) => {
    indexController.DisplayCreate(req, res);
});

/* POST newstakeholder page. */
router.post('/newstakeholder', userController.RequireAuth, (req, res, next) => {
    indexController.CreateStakeHolder(req, res);
});

/* POST newquest page. */
router.post('/newquest', userController.RequireAuth, (req, res, next) => {
    indexController.CreateQuest(req, res);
});

/* GET Edit page. */
router.get('/edit', userController.RequireAuth, (req, res, next) => {
    indexController.DisplayEdit(req, res);
});

/* GET Delete Stakeholder page. */
router.get('/deletestakeholder/:id', userController.RequireAuth, (req, res, next) => {
    indexController.DeleteStakeHolder(req, res);
});

/* GET Remove Quest page. */
router.get('/removequest/:id', userController.RequireAuth, (req, res, next) => {
    indexController.RemoveQuest(req, res);
});

/* GET Delete Quest page. */
router.get('/deletequest/:id', userController.RequireAuth, (req, res, next) => {
    indexController.DeleteQuest(req, res);
});

//
//
router.get('/surveys', (req, res, next) => {
    quizController.DisplaySurveys(req, res);
  }
);

router.get('/do/:id', (req, res, next) => {
    quizController.DisplaySurvey(req, res);
  }
);

router.post('/do/:id', (req, res, next) => {
    quizController.ProcessSurvey(req, res);
  }
);

router.get('/answer/:id', (req, res, next) => {
    quizController.DisplayAnswer(req, res);
  }
);

router.get('/createquiz', userController.RequireAuth,  (req, res, next) => {
    quizController.DisplayCreateQuiz(req, res);
  }
);

router.post('/createquiz', userController.RequireAuth, (req, res, next) => {
    quizController.ProcessCreateQuiz(req, res);
  }
);
//
//

module.exports = router;