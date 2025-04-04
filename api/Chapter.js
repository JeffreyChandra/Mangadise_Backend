const express = require('express');
const db = require('../config/db');
const router = express.Router();
const Chapter = require('../models/Chapter');

router.post("/addChapter", async (req, res) => {

    const { komik_id, chapter_num, link, price, published_at } = req.body;
    
    if (komik_id === "" || chapter_num === "" || link === "" || price === "" || published_at === "") {
        return res.status(400).json({ status: "FAILED", message: "Fields cant be empty" });
    }


        const newChapter = new Chapter({
            komik_id,
            chapter_num,
            link,
            price,
            published_at,
        });

        await newChapter.save();
        res.json({ status: "SUCCESS", message: `Chapter added`, data: newChapter })


});

router.get("/searchChapter", (req, res) => {
    Chapter.find({})
        .then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Chapter found',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Chapter not found',
            });
        });
})

module.exports = router;
