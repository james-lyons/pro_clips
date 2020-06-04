const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clipSchema = new Schema({
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments',
        required: true
    }],
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

const Clip = mongoose.model('Clip', clipSchema);

module.exports = Clip;
