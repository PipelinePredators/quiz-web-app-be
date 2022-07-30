const express = require('express');
const mysql = require('mysql2');
const router = express.Router();


/* Create a database connection */
const db = mysql.createConnection({
  user: 'admin',
  host: 'quizzlerwebappdb.cbriwp0julvl.us-east-1.rds.amazonaws.com',
  password: 'avitorpa$$word1995',
  database: 'quizwebappdb'
})

/* GET home page. */
router.get('/', function (req, res) {
  
  //Get data from database
  db.query(
    'SELECT * FROM student',
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log('This is the result',result)
        res.status(200).send(result)
      }
    }
  )
});

module.exports = router;
