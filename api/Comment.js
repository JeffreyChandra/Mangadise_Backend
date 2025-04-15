const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User');
const db = require('../config/db');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/addComment', async (req, res) => {
    const { user_id, komik_id, comment } = req.body;

    if (!user_id || !komik_id || !comment) {
        return res.status(400).json({ status: 'FAILED', message: 'Fields cant be empty' });
    }

    db.Types.ObjectId.isValid(user_id) && db.Types.ObjectId.isValid(komik_id)
        ? null
        : res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });
 
    const newComment = new Comment({
        user_id,
        komik_id,
        comment,
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


    try {
        const comments = await Comment.find({ komik_id }).populate('user_id', 'name');

        const userIds = comments.map(comment => comment.user_id?._id).filter(id => id);
        
        const users = await User.find({ 
            _id: { $in: userIds }
        }).select('name');

        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user.name;
        });

        const formattedComments = comments.map(item => ({
            komik_id: item.komik_id,
            user_id: item.user_id?._id || null,
            name: item.user_id?._id ? userMap[item.user_id._id] : null,
            comment: item.comment,
            createdAt: item.create_at,
        }));

        res.json({
            status: 'SUCCESS',
            message: 'Comments found',
            data: formattedComments,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'FAILED',
            message: 'Server error while fetching comments',
            error: err.message,
        });
    }
});
module.exports = router;