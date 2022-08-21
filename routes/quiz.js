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


//TODO: Fetch subjects
router.get('/api/fetch_subjects', (req, res) => {
    db.query("CALL fetch_subjects()",
        (err, result) => {
            if (err) {
                res.json({ error: err })
                return
            } else {
                const data = result[0].map((quiz) => {
                    const { id, name,description } = quiz;
                    return { id, name,description }
                })
                res.json({ data: data });
                return
            }
        })
})

//TODO: Create quiz
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

//TODO: Update quiz

//TODO: Delete quiz

//TODO: Fetch quiz


module.exports = router;