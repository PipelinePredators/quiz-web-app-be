
const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
require('dotenv').config();



/* Create a database connection */
const db = mysql.createConnection({

  user: process.env.SQLUSER,
  host: process.env.SQLHOST,
  password: process.env.SQLPASSWORD,
  database: process.env.SQLDATABASE,
});

db.connect(function(err){
    if (err) {
        console.error(err);
        return;
    }

    console.log("Succesfully connected to database");
})

router.get('/api/subjects/:subject_id/:limit', (req, res) => {
    console.log(req.param.id);
    const reqDetails ={
        subject_id : req.params.subject_id,
        limit : req.params.limit
    }
        selectQuizQuery(reqDetails, res);
    console.log(req.params.subject_id)
})


/*router.patch('/subjects/:subject_id/scores', (req, res) => {
    const score = req.body.score;
    //updateScore(score, res);
    console.log(param.locals.subject_id;
})

*/

/** A function to select quizzes. It takes in request details (question_subject_id & question limit) and select five questions at a time from the database based on subjects subject.
* @param reqDetails - {object}
* @param res - the response object
*/
const selectQuizQuery = (reqDetails,res) =>{
    const sql = `
                SELECT quizzes.question, quiz_options.option_a,
	            quiz_options.option_b, quiz_options.option_c,
                quiz_options.option_d, quiz_answers.answer
                FROM quizzes
                JOIN quiz_options ON quizzes.id = quiz_options.id
                JOIN quiz_answers ON quiz_options_id = quiz_answers.id
                WHERE subject_id = ${reqDetails.subject_id}
                LIMIT ${reqDetails.limit};`;
    db.query( sql, (err, message) =>{
            if (err) {
                res.json({ status: "failed", message: err.message})
            } else{
                res
                .status(200)
                .json({
                    status: "success",
                    message}
                )
            }
        }
    )
}

/** accepts result from quiz and update the score in the students table
 * @param score - score to update
 * @param res - the response object
 */
const updateScore = (score, res) =>{
    db.query(`UPDATE students SET score = ${score}`, (err, result) =>{
        if (err) {
            res.json({
                status: "failed", 
                message: err.message
            })
            
        } else{
            res
            .status(200)
            .json({
                status: "Success",
                message: "Failed to update score", })
        }
    })
}


//TODO: Fetch subjects
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