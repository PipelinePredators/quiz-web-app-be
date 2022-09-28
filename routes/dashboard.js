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


/* A function that is called when the route is called. */
router.get('/api/fetch_quiz_results', (req, res) => {
  const studentToken = req.query.studentToken;
  const subjectId = req.query.subjectId;
  db.query("CALL fetch_take_quiz_results(?,?)",
    [studentToken, subjectId],
    (err, result) => {
      if (err) {
        res.json(err);
        return
      }
      const quizResults = result[0].map((data) => {
        const { currentscore, quiztotal, quizdate } = data;
        return { currentscore, quiztotal, quizdate };
      })
      res.json(quizResults);
      return;
    }
  )
});

/* A function that is called when the route is called. */
router.get('/api/fetch_quiz_count', (req, res) => {
  const studentToken = req.query.studentToken;
  const subjectId = req.query.subjectId;
  db.query("CALL fetch_take_quiz_count(?,?)",
    [studentToken, subjectId],
    (err, result) => {
      if (err) {
        res.json(err);
        return;
      }
      const quizStatistics = result[0].map((data) => {
        const { subjectCount, quizmonth,quizYear } = data;
        return { subjectCount, quizmonth,quizYear };
      })

      res.json(quizStatistics);
      return;
    }
  )
})

/* A function that is called when the route is called. */
router.get('/api/fetch_quiz_percentage', (req, res) => {
  const studentToken = req.query.studentToken;
  const subjectId = req.query.subjectId;
  db.query("CALL fetch_take_quiz_percentage(?,?)",
    [studentToken, subjectId],
    (err, result) => {
      if (err) {
        res.json(err);
        return;
      }
      const quizPercentage = result[0].map((data) => {
        const { totalScore, totalOvers, Percentage, quizDay, quizMonthNumber, quizmonth, quizYear, quizdate } = data;
        return { totalScore, totalOvers, Percentage, quizDay, quizMonthNumber, quizmonth, quizYear, quizdate };
      })

      res.json(quizPercentage);
      return;
    }
  )
})


module.exports = router;
