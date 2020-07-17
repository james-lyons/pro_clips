const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true,
        default: 'https://www.sackettwaconia.com/wp-content/uploads/default-profile.png'
    },
    bio: {
        type: String,
        default: 'Bio',
        required: false
    },
    password: {
        type: String,
        required: true
    },
    clips: [{
        type: Schema.Types.ObjectId
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply',
        required: false
    }],
    liked_comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }],
    liked_replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply',
        required: true
    }],
    liked_clips: [{
        type: Schema.Types.ObjectId,
        ref: 'Clip',
        required: true
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isConfirmed: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
