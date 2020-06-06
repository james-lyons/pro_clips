const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    author_name: {
        type: String,
        required: true
    },
    reply_text: {
        type: String,
        required: true
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    likes:[{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    time_stamp: {
        type: Date,
        default: Date.now
    }
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
