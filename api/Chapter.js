const express = require('express');
const db = require('../config/db');
const router = express.Router();
const Chapter = require('../models/Chapter');
const { Storage } = require('@google-cloud/storage');

router.post("/addChapter", async (req, res) => {

    const { komik_id, chapter_num, link, price, published_at } = req.body;
    
    if (komik_id === "" || chapter_num === null || link === "" || price === null || published_at === "") {
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


const storage = new Storage({
    projectId: 'mangadise-project',
    keyFilename: './mangadise-project-770206903552.json',
  });
  
  const bucket = storage.bucket('komik-storage');
  
  router.get('/chapter-images', async (req, res) => {
    const { komik_id, chapter } = req.query;
    const prefix = `${komik_id}/chapter/${chapter}/`;
  
    try {
      const [files] = await bucket.getFiles({ prefix });
      const urls = files.map(file => `https://storage.googleapis.com/komik-storage/${file.name}`);
      res.json({ status: "SUCCESS", images: urls });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "FAILED", message: "Error fetching images", error });
    }
  });

module.exports = router;
