const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postTitle: {
        type: String,
        required: true
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
