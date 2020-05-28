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
    url: {
        type: String,
        required: true
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }
});

const Clip = mongoose.model('Clip', clipSchema);

module.exports = Clip;
