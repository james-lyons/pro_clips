const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportReplySchema = new Schema({
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
    reply_id: {
        type: Schema.Types.ObjectId,
        ref: 'Reply',
        required: true
    },
    report_reason: {
        type: String,
        required: true
    },
    report_text: {
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

const ReportReply = mongoose.model('ReportReply', reportReplySchema);

module.exports = ReportReply;
