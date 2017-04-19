let mongoose = require('mongoose');

let quiz = require('../models/quiz');
let answer = require('../models/answer');

module.exports.DisplayQuizs = (req, res)  => {
    quiz.find((err, quizs) => {
        if (err) {
            return console.error(err);
        } else {
            res.render('content/quizs', { 
                title: 'Quizs',
                quizName: req.body.quizName,
                quizs: quizs,
                username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
        }
    });
}

module.exports.DisplayQuiz = (req, res)  => {
    let id = req.params.id;

    quiz.findById(id, (err, outQuiz) => {
        if (err) {
            console.error(err);
            res.end(error);
        } else {
            let sess = req.session;
            sess.quiz = outQuiz
            res.render('content/doquiz', {
                title: 'Quiz ' + outQuiz.name,
                quiz: outQuiz,
                username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
        }
    });
}

module.exports.ProcessQuiz = (req, res)  => {
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

            for (let i = 0; i < sess.quiz.questions.length; i++){
                newAnswer.questions.push({
                    "category": sess.quiz.questions[i].category,
                    "answers": []
                })

                if (sess.quiz.questions[i].category == "mc"){
                    newAnswer.questions[i].answers = [0, 0, 0, 0];
                    newAnswer.questions[i].answers[req.body['q' + i]]++
                } else if (sess.quiz.questions[i].category == "tf"){
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
            for (let i = 0; i < sess.quiz.questions.length; i++){
                let rb = req.body['q' + i];

                if (sess.quiz.questions[i].category == "mc"){
                    outAnswer.questions[i].answers[rb]++
                } else if (sess.quiz.questions[i].category == "tf"){
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
            res.redirect('/quizs');
        } else {
            quiz.findById(id, (err, outQuiz) => {
                if (err) {
                    console.error(err);
                    res.end(error);
                } else {
                    res.render('content/answerDisplay', {
                        title: 'Answer-' + outQuiz.name,
                        answer: outAnswer,
                        quiz: outQuiz,
                        username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
                }
            });
        }
    });
}

module.exports.DisplayCreateQuiz = (req, res)  => {
    let sess = req.session;
    sess.quiz = new quiz({
        "user_id":  req.user._id,
        "user_name":  req.user.username,
        "name": '',
        "questions": [] 
    });

    res.render('content/createquiz', { 
        title: 'Create Quiz',
        quiz: sess.quiz,
        username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
}

module.exports.ProcessCreateQuiz = (req, res)  => {
    let sess = req.session;

    if (sess.quiz == null){
        res.redirect('/createquiz');
    } else {
        sess.quiz.name = req.body['quizName'];
        
        //Updating Quiz in Session
        for (let i = 0; i < sess.quiz.questions.length; i++){
            sess.quiz.questions[i].question = req.body['q' + i];

            if ( sess.quiz.questions[i].category == 'mc'){
                sess.quiz.questions[i].options[0] = req.body['q' + i + 'o1']
                sess.quiz.questions[i].options[1] = req.body['q' + i + 'o2']
                sess.quiz.questions[i].options[2] = req.body['q' + i + 'o3']
                sess.quiz.questions[i].options[3] = req.body['q' + i + 'o4']
            }
        }

        if (req.body.submitbutton == "Create"){
            if (sess.quiz.questions.length > 0){
                quiz.create(sess.quiz, (err) => {
                    if (err) {
                        console.error(err);
                        res.end(error);
                    } else {
                        sess.quiz = null;
                        res.redirect('/');
                    }
                });
            } else {

            }
        } else {
            //Adding Questions to Quiz
            if (req.body.submitbutton == "Multiple Choice"){
                sess.quiz.questions.push({
                    "category":  'mc',
                    "question": '',
                    "options": ['', '', '', '']
                });
            } else if (req.body.submitbutton == "True False"){
                sess.quiz.questions.push({
                    "category":  'tf',
                    "question": '',
                    "options": ['True', 'False']
                });
            }

            //Remove Questions from the Quiz
            if (req.body.submitbutton == "Remove Last"){
                sess.quiz.questions.pop();
            }

            res.render('content/createquiz', { 
                title: 'Create Quiz',
                quiz: sess.quiz,
                username: req.user ? req.user.username : '',                     
                user_type: req.user ? req.user.user_type : ''});
        }
    }    
}