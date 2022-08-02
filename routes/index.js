require('dotenv').config()
const express = require('express');
const app = express()
const mysql = require('mysql2');
const crypto = require('crypto');
const router = express.Router();

app.use(express.json)


/* Create a database connection */
const db = mysql.createConnection({
  user: process.env.SQLUSER,
  host: process.env.SQLHOST,
  password: process.env.SQLPASSWORD,
  database: process.env.SQLDATABASE
})

/* GET home page. */
router.get('/api/all_students', function (req, res) {

  //Get data from database
  db.query(
    'SELECT * FROM student',
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log('This is the result', result)
        res.status(200).send(result)
      }
    }
  )
});

router.get('/api/student/:id', function (req, res) {
  const id = req.params.id
  db.query(
    `SELECT * FROM student WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.log('Error', err)
        res.status(404).send('Data not found')
      } else {
        console.log('This is the result', result)
        res.status(200).send(result)
      }
    }
  )
})

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

  db.query("INSERT INTO quizwebappdb.student (firstname,lastname,birthdate,email,password) VALUES (?,?,?,?,?)",
  [studentDetails.firstname,studentDetails.lastname,studentDetails.birthdate,studentDetails.email,studentDetails.password], 
  (err, result) => {
    if (err) {
      console.log('Error', err)
      res.send(err)
    } else {
      console.log('This is the result', result)
      res.status(200).send('Data successfully added')
    }
  })
})

module.exports = router;
