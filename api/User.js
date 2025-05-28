
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let { name, email, password, phoneNumber } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    phoneNumber = phoneNumber.trim();

    if (name == "" || email == "" || password == "" || phoneNumber == "") {
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
    } else if (phoneNumber == "") {
        res.json({
            status: 'FAILED',
            message: 'Invalid Phone Number'
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
                        phoneNumber,
                        point : 0,
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

router.get('/getAllUsers', (req, res) => { 

    User.find({}).then(result => {
        res.json({
            status: 'SUCCESS',
            message: 'Users fetched successfully',
            data: result
        })
    }).catch(err => {
        console.log(err);
        res.json({
            status: 'FAILED',
            message: 'An error occured while fetching users'
        })
    })

});

router.get("/getUser/:_id", (req, res) => {
    const { _id } = req.params;
    if (_id == "") {
        res.json({
            status: 'FAILED',
            message: 'Empty input fields!'
        })
    } else {
        User.find({ _id }).then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'User fetched successfully',
                data: [{point: result[0].point, name: result[0].name, email: result[0].email, phoneNumber: result[0].phoneNumber}] 
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: 'FAILED',
                message: 'An error occured while fetching user'
            })
        })
    }
}   )

router.put('/updateUser/:_id', (req,res) => {
    req.params._id = req.params._id.trim();
    const { _id } = req.params;
    const {nama} = req.body

    if (_id == "") {
        res.json({
            status: 'FAILED',
            message: 'Empty input fields!'
        })
    } else {
        User.findOneAndUpdate({ _id }, { name: nama }, { new: true }).then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'User updated successfully',
                data: result
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: 'FAILED',
                message: 'An error occured while updating user'
            })
        })
    }
})

router.put('/updateUserPoint/:_id', (req, res) => {
    req.params._id = req.params._id.trim();
    const { _id } = req.params;
    const { point } = req.body;

    if (_id == "" || point == "") {
        res.json({
            status: 'FAILED',
            message: 'Empty input fields!'
        })
    } else {
        User.findOneAndUpdate({ _id }, { point }, { new: true }).then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'User point updated successfully',
                data: result
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: 'FAILED',
                message: 'An error occured while updating user point'
            })
        })
    }
})

module.exports = router;