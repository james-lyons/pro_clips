const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    author_name: {
        type: String,
        required: true
    },
    replyText: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
