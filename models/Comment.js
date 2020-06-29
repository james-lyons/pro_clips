const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reply = require('./Reply');

const commentSchema = new Schema({
    comment_text: {
        type: String,
    },
    clip_id: {
        type: Schema.Types.ObjectId,
        ref: 'Clip',
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
