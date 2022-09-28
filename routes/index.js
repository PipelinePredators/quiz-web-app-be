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
  res.render('index', { title: 'Pipeline Predators' });
});

/* GET home page. */
router.get('/api/all_students', function (req, res) {

  //Get data from database
  db.query(
    'SELECT * FROM student',
    (err, result) => {
      if (err) throw err
      const data = result.map((elements) => {
        const { id, firstname, lastname, birthdate, email } = elements
        return { id, firstname, lastname, birthdate, email };
      })
      res.status(200).json(data)
    }
  )
});
module.exports = router;