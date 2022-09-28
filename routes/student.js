require('dotenv').config()
var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
var hash = require('pbkdf2-password')()


/* Create a database connection */
const db = mysql.createConnection({
    user: process.env.SQLUSER,
    host: process.env.SQLHOST,
    password: process.env.SQLPASSWORD,
    database: process.env.SQLDATABASE
})


/**
 * It takes in a student's details, and then calls a stored procedure to create a new student in the
 * database.
 * @param studentDetails - {
 * @param res - the response object
 */
const createStudentQuery = (studentDetails, res) => {

    db.query("CALL create_student(?,?,?,?,?,?)",
        [
            studentDetails.firstname,
            studentDetails.lastname,
            studentDetails.email,
            studentDetails.phonenumber,
            studentDetails.password,
            studentDetails.salt
        ],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') { res.json({ "status": "failed", "message": "Email or phone number already exist" }); return }
            } else {
                res.status(200).json({ "status": "success", "message": "Registration Successful" });
                return
            }
        })
}


/**
 * If the user exists, then hash the password and compare it to the hashed password in the database. If
 * they match, then return the user object, otherwise return null.
 * @param email - email of the user
 * @param pass - the password entered by the user
 * @param fn - callback function
 */
const authenticate = (email, pass, fn) => {

    db.query("CALL login_student(?)",
        [email],
        (err, result) => {
            if (err) throw err;
            if (!result[0][0]) return fn(null, null);
            let student = result[0][0];
            hash({ password: pass, salt: student.salt }, function (err, pass, salt, hash) {
                if (err) return fn(err);
                if (hash === student.password) return fn(null, student);
                fn(null, null);
            })
        }
    )
}


/* Create a student */
/* Creating a student. */
router.post('/api/create_student', function (req, res) {

    hash({ password: req.body.password }, function (err, pass, salt, hash) {
        if (err) throw err;
        const studentDetails = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            password: hash,
            salt: salt
        }
        createStudentQuery(studentDetails, res);
    })
});


/* Deleting a student from the database. */
router.delete('/api/delete_student', function (req, res) {
    const studentId = req.body.studentId;
    db.query("CALL delete_student(?)",
        [studentId],
        (err, result) => {
            if (err) {
                res.json("Update failed")
                return
            } else {
                res.status(200).json('Student deleted successfully')
                return
            }
        }
    )
})

/* Updating the birthdate of a student. */
router.patch('/api/update_birthdate', function (req, res) {
    const studentId = req.body.studentId;
    const birthdate = req.body.birthdate;
    db.query("CALL update_birthdate(?,?)",
        [studentId, birthdate],
        (err, result) => {
            if (err) {
                res.json("Update failed")
                return
            } else {
                res.status(200).json('Birthdate updated successfully')
                return
            }
        }
    )
})


/* This is a function that updates the email of a student. */
router.patch('/api/update_email', function (req, res) {
    const studentId = req.body.studentId;
    const email = req.body.email;
    db.query("CALL update_email(?,?)",
        [studentId, email],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.json("User already exists")
                    return
                }
            } else {
                const content = {
                    data: result
                }
                res.status(200).json(content)
                return
            }
        }
    )
})

/* A function that updates the password of a student. */
router.patch('/api/update_password', function (req, res) {
    const currentPassword = req.body.password;
    db.query("CALL updatepassword(?,?)",
        [studentId, currentPassword],
        (err, result) => {
            if (err) {
                res.json("Update failed")
                return
            } else {
                res.status(200).json('Birthdate updated successfully')
                return
            }
        }
    )
})

/* A function that takes in the email and password of a student, and then calls the authenticate
function. */
router.get('/api/login_student', function (req, res) {
    const email = req.query.email;
    const password = req.query.password;
    authenticate(email, password, function (err, student) {
        if (err) { res.json(err); return };
        if (student !== null) {
            const { token } = student;
            res.json({ "token": token });
        }
        res.json({ "token": '' })
        return

    })
})


module.exports = router;
