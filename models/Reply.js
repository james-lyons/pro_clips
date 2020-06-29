const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    reply_text: {
        type: String,
        required: true
    },
    comment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    author_name: {
        type: String,
        required: true
    },
    author_profile_image: {
        type: String,
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
