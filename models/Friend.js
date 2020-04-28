const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: Schema.Types.ObjectId,\
        ref: 'User '
    },
    status: {
        type: Number,
        enums: [
            0, 1, 2, 3
        ]
    }
});

const Friend = mongoose.model('Friends', friendSchema);

module.exports = Friend