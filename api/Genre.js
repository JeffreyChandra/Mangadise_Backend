const express = require('express');
const Genre = require('../models/Genre');
const db = require('../config/db');
const { route } = require('./Chapter');
const router = express.Router();


router.post('/addGenre', async (req, res) => {
    const { komik_id, genre } = req.body;

    if (!komik_id || !genre) {
        return res.status(400).json({ status: 'FAILED', message: 'Fields cant be empty' });
    }
    const newGenre = new Genre({
        komik_id,
        genre,
    });
    await newGenre.save()
        .then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Genre added',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Failed to add genre',
            });
        });

})

router.get('/searchGenre/:genre', (req, res) => {
    const { genre } = req.params;
    Genre.find({ genre })
        .then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Genre found',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Genre not found',
            });
        });
})





module.exports = router;