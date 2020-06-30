// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const reportClip = (req, res) => {

    const { clip_id, offender, reporter, report_reason, report_description } = req.body;

    const report = {
        clip_id,
        offender,
        reporter,
        report_reason,
        report_description
    };

    db.ReportClip.create(report , (error, createdReport) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            messag: 'Something went wrong. Please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success'
        });
    });
};

const reportUser = (req, res) => {

    const { offender, reporter, report_reason, report_description } = req.body;

    const report = {
        offender,
        reporter,
        report_reason,
        report_description
    };

    db.ReportUser.create(report , (error, createdReport) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            messag: 'Something went wrong. Please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success'
        });
    });
};

const reportReply = (req, res) => {

    const {
        offender,
        reporter,
        reply_id,
        report_text,
        report_reason,
        report_description
    } = req.body;

    const report = {
        offender,
        reporter,
        reply_id,
        report_text,
        report_reason,
        report_description
    };

    db.ReportReply.create(report , (error, createdReport) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            messag: 'Something went wrong. Please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success'
        });
    });
};

const reportComment = (req, res) => {

    const {
        offender,
        reporter,
        comment_id,
        report_text,
        report_reason,
        report_description
    } = req.body;

    const report = {
        offender,
        reporter,
        comment_id,
        report_text,
        report_reason,
        report_description
    };

    db.ReportComment.create(report , (error, createdReport) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            messag: 'Something went wrong. Please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success'
        });
    });
};

module.exports = {
    reportClip,
    reportUser,
    reportReply,
    reportComment
};
