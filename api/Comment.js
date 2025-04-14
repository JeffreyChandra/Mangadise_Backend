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

    // if (!mongoose.Types.ObjectId.isValid(komik_id)) {
    //     return res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });
    // }

    try {
        const comments = await Comment.find({ komik_id }).populate('user_id', 'name');

        // Get all unique user IDs from comments
        const userIds = comments.map(comment => comment.user_id?._id).filter(id => id);
        
        // Fetch all users at once
        const users = await User.find({ 
            _id: { $in: userIds }
        }).select('name');

        // Create a map of user IDs to usernames for quick lookup
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user.name;
        });

        const formattedComments = comments.map(item => ({
            user_id: item.user_id?._id || null,
            name: item.user_id?._id ? userMap[item.user_id._id] : null,
            comment: item.comment,
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