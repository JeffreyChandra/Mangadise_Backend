const express = require('express');
const Genre = require('../models/Genre');
const db = require('../config/db');
const { route } = require('./Chapter');
const Comic = require('../models/Comic');
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


router.get('/getGenre/:genre', async (req, res) => {
    const {genre} = req.params;

    if (!genre) {
        return res.status(400).json({ status: 'FAILED', message: 'Genre is required' });
    }
    if (genre === "") {
        return res.status(400).json({ status: 'FAILED', message: 'Genre cannot be empty' });
    }

    const result = await Genre.find({ genre });
    if (result.length === 0) {
        return res.status(404).json({ status: 'FAILED', message: 'No comics found for this genre' });
    }
    if (result === null) {
        return res.status(404).json({ status: 'FAILED', message: 'Genre not found' });
    }

    const data = await Promise.all(result.map(async (item) => {
        const komik = await Comic.findById({ _id: item.komik_id });
        return {
            komik_id: item.komik_id,
            komik: komik.title,
            cover: komik.cover,
            rate: komik.rate,
            totalChapter: komik.totalChapter,
            synopsis: komik.synopsis,

        };
    }));
    res.json({
        status: 'SUCCESS',
        message: 'Genre found',
        data: data,
    });

})

router.get('/getGenreKomik/:komik_id', async (req, res) => {
    const { komik_id } = req.params;

    if (!komik_id) {
        return res.status(400).json({ status: 'FAILED', message: 'Komik ID is required' });
    }

    const result = await Genre.find({ komik_id });
    if (result.length === 0) {
        return res.status(404).json({ status: 'FAILED', message: 'No genres found for this komik ID' });
    }

    res.json({
        status: 'SUCCESS',
        message: 'Genres found',
        data: result,
    });
}   );



module.exports = router;