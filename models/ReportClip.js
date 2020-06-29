const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportClipSchema = new Schema({
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clip: {
        type: Schema.Types.ObjectId,
        ref: 'Clip',
        required: true
    },
    report_reason: {
        type: String,
        required: true
    },
    report_description: {
        type: String
    },
    time_stamp: {
        type: Date,
        default: Date.now
    }
});

const ReportClip = mongoose.model('ReportClip', reportClipSchema);

module.exports = ReportClip;