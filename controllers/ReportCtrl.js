// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const reportClip = () => {
    console.log('Hello from ReportClip 1: req.body', req.body);

    const { clip, offender, reporter, report_reason, report_description } = req.body;

    const report = {
        clip,
        offender,
        reporter,
        report_reason,
        report_description
    };

    console.log('Hello from ReportClip 2: report', report);

    db.ReportClip.create(report , (error, createdReport) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            messag: 'Something went wrong. Please try again.'
        });

        console.log('Hello from ReportClip 3: createdReport', createdReport);

        return res.status(200).json({
            status: 200,
            message: 'Success'
        });
    });
};

const reportUser = () => {
    console.log('Hello from ReportUser 1: req.body', req.body);

    const { offender, reporter, report_reason, report_description } = req.body;

    const report = {
        offender,
        reporter,
        report_reason,
        report_description
    };

    console.log('Hello from ReportUser 2: report', report);

    db.ReportUser.create(report , (error, createdReport) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            messag: 'Something went wrong. Please try again.'
        });

        console.log('Hello from ReportUser 3: createdReport', createdReport);

        return res.status(200).json({
            status: 200,
            message: 'Success'
        });
    });
};

const reportReply = () => {
    console.log('Hello from ReportReply 1: req.body', req.body);

    const {
        offender,
        reporter,
        reply,
        report_text,
        report_reason,
        report_description
    } = req.body;

    const report = {
        offender,
        reporter,
        reply,
        report_text,
        report_reason,
        report_description
    };

    console.log('Hello from ReportReply 2: report', report);

    db.ReportReply.create(report , (error, createdReport) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            messag: 'Something went wrong. Please try again.'
        });

        console.log('Hello from ReportReply 3: createdReport', createdReport);

        return res.status(200).json({
            status: 200,
            message: 'Success'
        });
    });
};

const reportComment = () => {
    console.log('Hello from ReportComment 1: req.body', req.body);

    const {
        offender,
        reporter,
        comment,
        report_text,
        report_reason,
        report_description
    } = req.body;

    const report = {
        offender,
        reporter,
        comment,
        report_text,
        report_reason,
        report_description
    };

    console.log('Hello from ReportComment 2: report', report);

    db.ReportComment.create(report , (error, createdReport) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            messag: 'Something went wrong. Please try again.'
        });

        console.log('Hello from ReportComment 3: createdReport', createdReport);

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
