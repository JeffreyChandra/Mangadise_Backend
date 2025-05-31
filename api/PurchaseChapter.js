const express = require('express');
const Router = express.Router();
const PurchaseChapter = require('../models/PurchaseChapter');
const db = require('../config/db');


Router.post('/addPurchase', async (req, res) => {

    const { user_id, chapter_id } = req.body;

    if (!user_id || !chapter_id) {
        return res.status(400).json({ status: 'FAILED', message: 'Fields cant be empty' });
    }
    if (!db.Types.ObjectId.isValid(user_id) || !db.Types.ObjectId.isValid(chapter_id)) {
        return res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });
    }
    const newPurchase = new PurchaseChapter({
        user_id,
        chapter_id,
    });
    await newPurchase.save()
        .then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Purchase added',
                data: result,
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Failed to add purchase',
            });
        });

})


Router.get('/searchPurchase/:user_id/:chapter_id', (req, res) => {

    const { user_id, chapter_id } = req.params;

    if (!db.Types.ObjectId.isValid(user_id) || !db.Types.ObjectId.isValid(chapter_id)) {
        return res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });
    }

    PurchaseChapter.findOne({ user_id, chapter_id })
        .then(result => {
            if (result) {
                res.json({
                    status: 'SUCCESS',
                    message: 'Purchase found',
                    data: result,
                    purchaseChapter: true,
                });
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'Purchase not found',
                    purchaseChapter: false,
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: 'FAILED',
                message: 'Error occurred while searching for purchase',
            });
        });


})


module.exports = Router;