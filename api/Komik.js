
const express = require('express');
const router = express.Router();
const Komik = require('./models/Komik');


router.post ("/addKomik", (req, res) => {

    const { title, author, cover, synopsis, rate } = req.body;
    const newKomik = new Komik ({
        title,
        author,
        cover,
        synopsis,
        rate,
        create_at: Date.now(),
    })

})

router.get ("/searchKomik", (req,res) => {
    Komik.find({}).then(result => {
        res.json({
            status: 'SUCCESS',
            message: 'Komik found',
            data: result,
        })
    }).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'Komik not found',
        })
    })
})

router.get ("/searchKomik/:id", (req,res) => {

    const id = req.params.id;
    Komik.findById(id).then(result => {
        res.json({
            status: 'SUCCESS',
            message: 'Komik found',
            data: result,
        })
    }).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'Komik not found',
        })
    })

})