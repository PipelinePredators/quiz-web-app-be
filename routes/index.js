require('dotenv').config()
const express = require('express');
const mysql = require('mysql2');
const router = express.Router();


/* Create a database connection */
const db = mysql.createConnection({
  user: process.env.SQLUSER,
  host: process.env.SQLHOST,
  password: process.env.SQLPASSWORD,
  database: process.env.SQLDATABASE
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
