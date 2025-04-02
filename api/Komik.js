const express = require('express');
const db = require('../config/db');
const router = express.Router();
const Komik = require('../models/Comic'); 
const Comic = require('../models/Comic');


router.post("/addKomik", async (req, res) => {
    try {
        console.log(Comic)
        const { title, author, coverUrl, synopsis, rate } = req.body;

        if (title === "" || author === "" || coverUrl === "" || synopsis === "" || rate === "") {
            return res.status(400).json({ status: "FAILED", message: "Fields cant be empty" });
        }

        const existingKomik = await Komik.findOne({ title });
        if (existingKomik) {
            return res.status(400).json({ status: "FAILED", message: "Komik already exists" });
        }

        if (!coverUrl) {
            return res.status(400).json({ status: "FAILED", message: "Cover URL is required" });
        }

        const newKomik = new Comic({
            title,
            author,
            cover: coverUrl, 
            synopsis,
            rate,
        });

        await newKomik.save();
        res.json({ status: "SUCCESS", message: `Komik added ${Comic}`, data: newKomik });

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

router.get("/searchKomik/:_id", (req, res) => {
    const { _id } = req.params;

    db.Types.ObjectId.isValid(_id) // Check if the ID is valid
        ? null // If valid, do nothing
        : res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' }); // If invalid, return error

    Comic.find({_id})
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

router.delete("/deleteKomik/:title", async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title); // Fix encoding issue
        
        const deletedKomik = await Komik.findOneAndDelete({ title });

        if (!deletedKomik) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Komik not found',
            });
        }

        res.json({
            status: 'SUCCESS',
            message: 'Komik deleted successfully',
            result: deletedKomik,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred while deleting the komik',
            error: error.message,
        });
    }
});


router.put("/updateKomik/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const { title, author, coverUrl, synopsis, rate } = req.body;

        if (!title || !author || !coverUrl || !synopsis || !rate) {
            return res.status(400).json({ status: "FAILED", message: "Fields cant be empty" });
        }

        const updatedKomik = await Komik.findByIdAndUpdate(
            _id,
            { title, author, cover: coverUrl, synopsis, rate },
            { new: true }
        );

        if (!updatedKomik) {
            return res.status(404).json({ status: "FAILED", message: "Komik not found" });
        }

        res.json({ status: "SUCCESS", message: "Komik updated successfully", data: updatedKomik });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: "Server error" });
    }
})

module.exports = router;
