const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportUserSchema = new Schema({
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

const ReportUser = mongoose.model('ReportUser', reportUserSchema);

module.exports = ReportUser;
