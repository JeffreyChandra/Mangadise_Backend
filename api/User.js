
const express = require('express');
const router = express.Router();

const User = require('../models/User');

const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: 'FAILED',
            message: 'Empty input fields!'
        })
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid name'
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid email'
        })
    } else if (!new Date(dateOfBirth).getTime()) {
        res.json({
            status: 'FAILED',
            message: 'Invalid date of birth'
        })
    } else if (password.length < 8) {
        res.json({
            status: 'FAILED',
            message: 'Password is too short'
        })
    } else {
        User.find({email}).then(result => {
            if (result.length) {
                res.json({
                    status: 'FAILED',
                    message: 'Email already exists'
                });
            } else {
                const SaltRounds = 10;
                bcrypt.hash(password, SaltRounds).then(hasedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hasedPassword,
                        dateOfBirth
                    });
                    newUser.save().then(result => {
                        res.json({
                            status: 'SUCCESS',
                            message: 'User created successfully',
                            data: result
                        })
                    }).catch(err=> {
                        console.log(err);
                        res.json({
                            status: 'FAILED',
                            message: 'An error occured while saveing user account'
                        })
                    })

                }).catch(err => {
                    console.log(err);
                    res.json({
                        status: 'FAILED',
                        message: 'An error occured while hashing password'
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: " An error occured"
            })
        })
    }
});

router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: 'FAILED',
            message: 'Empty input fields!'
        })
    } else {
        User.find({email}).then(data => {
            if (data.length) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        res.json({
                            status: 'SUCCESS',
                            message: 'Login successful',
                            data: data
                        })
                    } else {
                        res.json({
                            status: 'FAILED',
                            message: 'Invalid password'
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    res.json({
                        status: 'FAILED',
                        message: 'An error occured while comparing password'
                    })
                })
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'Email does not exist'
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: 'FAILED',
                message: 'An error occured while checking for email'
            })
        })
    }
});

module.exports = router;