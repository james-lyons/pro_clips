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
    clip: {
        type: Object,
        require: true
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }
});

const Clip = mongoose.model('Clip', clipSchema);

module.exports = Clip;
