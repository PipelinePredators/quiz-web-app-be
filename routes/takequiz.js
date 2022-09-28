require('dotenv').config()
var express = require('express');
var router = express.Router();
const mysql = require('mysql2');


/* Create a database connection */
const db = mysql.createConnection({
    user: process.env.SQLUSER,
    host: process.env.SQLHOST,
    password: process.env.SQLPASSWORD,
    database: process.env.SQLDATABASE
})


/* A function that is called when the user visits the route `/api/fetch_subjects` */
router.get('/api/fetch_subjects', (req, res) => {
    db.query("CALL fetch_subjects()",
        (err, result) => {
            if (err) {
                res.json({ error: err })
                return
            } else {
                const data = result[0].map((quiz) => {
                    const { id, name, description } = quiz;
                    return { id, name, description }
                })
                res.json({ data: data });
                return
            }
        })
})


/* This is a post request that is called when the user clicks the submit button on the form. It takes
the data from the form and sends it to the database. */
router.post('/api/create_quiz', (req, res) => {
    const quizDetails = {
        subjectId: req.body.subjectId,
        question: req.body.question,
        firstOption: req.body.firstOption,
        secondOption: req.body.secondOption,
        thirdOption: req.body.thirdOption,
        fourthOption: req.body.fourthOption,
        questionAnswer: req.body.questionAnswer
    }

    db.query("CALL add_quiz(?,?,?,?,?,?,?)",
        [
            quizDetails.subjectId,
            quizDetails.question,
            quizDetails.firstOption,
            quizDetails.secondOption,
            quizDetails.thirdOption,
            quizDetails.fourthOption,
            quizDetails.questionAnswer
        ],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.json({ status: 'failed', message: 'Question already exist' })
                    return
                } else {
                    res.json({ error: err })
                    return
                }
            } else {
                res.json({ status: 'Success', message: 'Question Added' })
                return
            }
        }

    )
})

/* A get request that is called when the user clicks the take quiz button. It takes the subject id and
the question number from the user and sends it to the database. */
router.get('/api/fetch_quiz', (req, res) => {
    const userPreferences = {
        subjectId: req.query.subjectId,
        questionNumber: req.query.questionNumber
    }

    db.query("CALL fetch_take_quiz(?,?)",
        [userPreferences.subjectId, userPreferences.questionNumber],
        (err, result) => {
            if (err) {
                res.json({ error: err })
                return;
            } else {
                const data = result[0].map((quiz) => {
                    const {
                        id, question, subject_id,
                        option_a, option_b, option_c,
                        option_d, answer } = quiz;
                    const options = [option_a, option_b, option_c, option_d];
                    return {
                        id, question, subject_id,
                        options, answer
                    }
                })

                res.json(data)
                return;
            }
        }
    )
})


//Save Quiz Results
router.post('/api/save_results', (req, res) => {
    const date = new Date();
    const quizDate = date.toJSON().slice(0,10);
    const results = {
        studentToken: req.body.studentToken,
        currentScore: req.body.currentScore,
        quizTotal: req.body.quizTotal,
        takeQuizDate: quizDate,
        subjectId: req.body.subjectId
    }

    db.query("CALL save_quiz_results(?,?,?,?,?)",
        [results.studentToken, results.currentScore, results.quizTotal,results.takeQuizDate,results.subjectId],
        (err, result) => {
            if (err) {
                res.json(err)
                return
            }
            res.json({ status: 'success', message: 'Results saved' })
            return;
        }
    )
})


//TODO: Update quiz

//TODO: Delete quiz



module.exports = router;