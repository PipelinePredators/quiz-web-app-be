require('dotenv').config()
var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const crypto = require('crypto');


/* Create a database connection */
const db = mysql.createConnection({
  user: process.env.SQLUSER,
  host: process.env.SQLHOST,
  password: process.env.SQLPASSWORD,
  database: process.env.SQLDATABASE
})

/* GET users listing. */
router.post('/api/create_student', function (req, res) {
  const salt = crypto.randomBytes(16).toString(`hex`)
  const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`).toString(`hex`)
  const studentDetails = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthdate: req.body.birthdate,
    email: req.body.email,
    password: hash
  }

  db.query("CALL create_student(?,?,?,?,?)",
    [studentDetails.firstname, studentDetails.lastname, studentDetails.birthdate, studentDetails.email, studentDetails.password],
    (err, result) => {
      if (err) {
        console.log('Error', err)
        res.send(err)
      } else {
        console.log('This is the result', result)
        res.status(200).send('Data successfully added')
      }
    })
});


module.exports = router;
