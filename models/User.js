const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
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
    clips: [{
        type: Schema.Types.ObjectId,
        ref: 'Clip',
        required: false
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],
    following: [],
    followers: [],
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
