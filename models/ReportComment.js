const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportCommentSchema = new Schema({
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
    comment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
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

const ReportComment = mongoose.model('ReportComment', reportCommentSchema);

module.exports = ReportComment;
