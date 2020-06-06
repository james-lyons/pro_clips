const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reply = require('./Reply');

const commentSchema = new Schema({
    author_name: {
        type: String,
        required: true
    },
    comment_text: {
        type: String,
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clip_id: {
        type: Schema.Types.ObjectId,
        ref: 'Clip',
        required: true
    },
    replies: [ Reply.schema ],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    time_stamp: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
