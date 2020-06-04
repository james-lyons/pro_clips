const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reply = require('./Reply');

const commentSchema = new Schema({
    author_name: {
        type: String,
        required: true
    },
    commentText: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clip: {
        type: Schema.Types.ObjectId,
        ref: 'Clip',
        required: true
    },
    replies: [ Reply.schema ],
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
