let mongoose = require('mongoose');

let survey = require('../models/survey');
let answer = require('../models/answer');

module.exports.DisplaySurveys = (req, res)  => {
    survey.find((err, surveys) => {
        if (err) {
            return console.error(err);
        } else {
            res.render('content/surveys', { 
                title: 'Surveys',
                surveyName: req.body.surveyName,
                surveys: surveys,
                username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
        }
    });
}

module.exports.DisplaySurvey = (req, res)  => {
    let id = req.params.id;

    survey.findById(id, (err, outSurvey) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            let sess = req.session;
            sess.survey = outSurvey
            res.render('content/dosurvey', {
                title: 'Survey ' + outSurvey.name,
                survey: outSurvey,
                username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
        }
    });
}

module.exports.ProcessSurvey = (req, res)  => {
    let sess = req.session;
    let id = req.params.id;

    answer.findById(id, (err, outAnswer) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else if (outAnswer == null) {
            let newAnswer = new answer({
                "_id": id,
                "answered": 1,
                "questions": [] 
            });

            for (let i = 0; i < sess.survey.questions.length; i++){
                newAnswer.questions.push({
                    "category": sess.survey.questions[i].category,
                    "answers": []
                })

                if (sess.survey.questions[i].category == "mc"){
                    newAnswer.questions[i].answers = [0, 0, 0, 0];
                    newAnswer.questions[i].answers[req.body['q' + i]]++
                } else if (sess.survey.questions[i].category == "tf"){
                    newAnswer.questions[i].answers = [0, 0];
                    newAnswer.questions[i].answers[req.body['q' + i]]++
                }

                console.log(newAnswer.questions[i].answers);
            }            

            answer.create(newAnswer, (err) => {
                if (err) {
                    console.error(err);
                    res.end(error);
                } else {
                    res.redirect('/')
                }
            });
        } else {
            outAnswer.answered++;
            for (let i = 0; i < sess.survey.questions.length; i++){
                let rb = req.body['q' + i];

                if (sess.survey.questions[i].category == "mc"){
                    outAnswer.questions[i].answers[rb]++
                } else if (sess.survey.questions[i].category == "tf"){
                    outAnswer.questions[i].answers[rb]++
                }
            }

            answer.update({_id: id}, outAnswer, (err) => {
                if (err) {
                    console.error(err);
                    res.end(error);
                } else {
                   res.redirect('/');
                }
            });
        }
    });
}

module.exports.DisplayAnswer = (req, res)  => {
    let id = req.params.id;

    answer.findById(id, (err, outAnswer) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else if (outAnswer == null) {
            res.redirect('/surveys');
        } else {
            survey.findById(id, (err, outSurvey) => {
                if (err) {
                    console.error(err);
                    res.end(error);
                } else {
                    res.render('content/answerDisplay', {
                        title: 'Answer-' + outSurvey.name,
                        answer: outAnswer,
                        survey: outSurvey,
                        username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
                }
            });
        }
    });
}

module.exports.DisplayCreateQuiz = (req, res)  => {
    let sess = req.session;
    sess.survey = new survey({
        "user_id":  req.user._id,
        "user_name":  req.user.username,
        "name": '',
        "questions": [] 
    });

    res.render('content/createquiz', { 
        title: 'Create Survey',
        survey: sess.survey,
        username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
}

module.exports.ProcessCreateQuiz = (req, res)  => {
    let sess = req.session;

    if (sess.survey == null){
        res.redirect('/createquiz');
    } else {
        sess.survey.name = req.body['surveyName'];
        
        //Updating Survey in Session
        for (let i = 0; i < sess.survey.questions.length; i++){
            sess.survey.questions[i].question = req.body['q' + i];

            if ( sess.survey.questions[i].category == 'mc'){
                sess.survey.questions[i].options[0] = req.body['q' + i + 'o1']
                sess.survey.questions[i].options[1] = req.body['q' + i + 'o2']
                sess.survey.questions[i].options[2] = req.body['q' + i + 'o3']
                sess.survey.questions[i].options[3] = req.body['q' + i + 'o4']
            }
        }

        if (req.body.submitbutton == "Create"){
            if (sess.survey.questions.length > 0){
                survey.create(sess.survey, (err) => {
                    if (err) {
                        console.error(err);
                        res.end(error);
                    } else {
                        sess.survey = null;
                        res.redirect('/');
                    }
                });
            } else {

            }
        } else {
            //Adding Questions to Survey
            if (req.body.submitbutton == "Multiple Choice"){
                sess.survey.questions.push({
                    "category":  'mc',
                    "question": '',
                    "options": ['', '', '', '']
                });
            } else if (req.body.submitbutton == "True False"){
                sess.survey.questions.push({
                    "category":  'tf',
                    "question": '',
                    "options": ['True', 'False']
                });
            }

            //Remove Questions from the Survey
            if (req.body.submitbutton == "Remove Last"){
                sess.survey.questions.pop();
            }

            res.render('content/createquiz', { 
                title: 'Create Survey',
                survey: sess.survey,
                username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
        }
    }    
}