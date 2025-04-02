const express = require('express');
const router = express.Router();
const Komik = require('../models/komik'); 
router.post("/addKomik", async (req, res) => {
    try {
        const { title, author, coverUrl, synopsis, rate } = req.body;

        if (!coverUrl) {
            return res.status(400).json({ status: "FAILED", message: "Cover URL is required" });
        }

        const newKomik = new Komik({
            title,
            author,
            cover: coverUrl, 
            synopsis,
            rate,
        });

        await newKomik.save();
        res.json({ status: "SUCCESS", message: "Komik added", data: newKomik });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "FAILED", message: "Server error" });
    }
});

router.get("/searchKomik", (req, res) => {
    Komik.find({})
        .then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Komik found',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Komik not found',
            });
        });
});

router.get("/searchKomik/:title", (req, res) => {
    const { title } = req.params;

    Komik.findOne({title})
        .then(result => {
            if (!result) {
                return res.json({
                    status: 'FAILED',
                    message: 'Komik not found',
                });
            }
            res.json({
                status: 'SUCCESS',
                message: 'Komik found',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Invalid ID format or Komik not found',
            });
        });
});

module.exports = router;
