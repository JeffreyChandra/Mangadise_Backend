const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User');
const db = require('../config/db');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/addComment', async (req, res) => {
    const { user_id, komik_id, comment, username } = req.body;

    if (!user_id || !komik_id || !comment || !username) {
        return res.status(400).json({ status: 'FAILED', message: 'Fields cant be empty' });
    }

    db.Types.ObjectId.isValid(user_id) && db.Types.ObjectId.isValid(komik_id)
        ? null
        : res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });

    const newComment = new Comment({
        user_id,
        komik_id,
        comment,
        username,
    });

    await newComment.save()
        .then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Comment added',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Failed to add comment',
            });
        });
});


router.get('/searchComment/:komik_id', (req, res) => {
    const { komik_id } = req.params;

    db.Types.ObjectId.isValid(komik_id)
        ? null
        : res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });

    Comment.find({ komik_id })
        .then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Comment found',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Comment not found',
            });
        });
})

router.put('/editComment/:_id', (req, res) => {
    const { _id } = req.params;

    db.Types.ObjectId.isValid(_id)
        ? null
        : res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });

    Comment.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
        .then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Comment updated',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Failed to update comment',
            });
        });
})


router.get('/komikComment/:komik_id', async (req, res) => {
    const { komik_id } = req.params;

    if (!komik_id) {
        return res.status(400).json({ status: 'FAILED', message: 'Fields cant be empty' });
    }

    db.Types.ObjectId.isValid(komik_id)
        ? null
        : res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });

    Comment.find({ komik_id }).then(async (result) => {

        res.json({
            status: 'SUCCESS',
            message: 'Comment found',
            data: result,
        });

    })

});
module.exports = router;