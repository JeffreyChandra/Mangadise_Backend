const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseChapterSchema = new Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chapter_id: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
    },
    purchase_date: {
        type: Date,
        default: Date.now
    }

})

const PurchaseChapterModel = mongoose.model('PurchaseChapter', PurchaseChapterSchema);
module.exports = PurchaseChapterModel;