const express = require("express");
const mysql = require("mysql2");
const router = express.Router();


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

router.get('/subjects/:subject_id/:limit', (req, res) => {
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
                quiz_options.option_d, quiz_answers.options_answers_id
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
module.exports = router;