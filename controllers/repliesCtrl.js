// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexReplies = (req, res) => {
    db.Comment.findById(req.params.id, (err, foundComment) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: foundComment.replies
        });
    });
};

const showReply = (req, res) => {
    console.log('hi')
};

const createReply = (req, res) => {

    const currentUser = req.session.currentUser;
    const reply = {
        author_name: currentUser.userName,
        reply_text: req.body.replyText,
        author_id: currentUser._id,
        comment_id: req.body.commentId
    };

    console.log('HELLO FROM CREATEREPLY 1: currentUser - ', currentUser);
    console.log('HELLO FROM CREATEREPLY 2: reply - ', reply);

    db.Reply.create(reply, async (err, createdReply) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        await db.User.findById(currentUser._id, (err, foundUser) => {
            if (err) return res.status(500).json({
                status: 500,
                erorr: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('HELLO FROM CREATEREPLY 3: foundUser - ', foundUser);

            foundUser.replies.push(createdReply._id);
            foundUser.save();
        });

        await db.Comment.findById(reply.comment_id, (err, foundComment) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('HELLO FROM CREATEREPLY 4: foundComment - ', foundComment);

            foundComment.replies.push(createdReply);
            foundComment.save();
        });

        console.log('HELLO FROM CREATEREPLY 5: createdReply - ', createdReply);

        return res.status(200).json({
            status: 200,
            message: 'Success!'
        });
    });
};

const editReply = (req, res) => {
    db.Comment.findByIdAndUpdate(req.params.id, req.body, (err, editedReply) => {
        if (err) return exports.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        res.status(202).json({
            status: 202,
            message: 'Success'
        });
    });
};

const deleteReply = async (req, res) => {
    await db.Reply.findByIdAndDelete(req.params.id, (err, deletedReply ) => {
        if (err) return res;status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again'
        });
    });

    await db.User.findById(req.session.currentUser._id, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        let newRepliesArr = foundUser.replies.filter(reply => reply.toString() !== req.params.id);

        foundUser = { ...foundUser, replies: newRepliesArr };
        foundUser.save((err) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
        });
    });

    await db.Comments.findById(req.body.commentId, (err, foundComment) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        let newCommentsArr = foundComment.comments.filter(comment => comment._id.toString() !== req.params.id);

        foundComment = { ...foundComment, replies: newRepliesArr };
        foundComment.save((err) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
        });
    });

    return res.status(202).json({
        status: 200,
        message: 'Success'
    });
};

module.exports = {
    indexReplies,
    showReply,
    createReply,
    editReply,
    deleteReply
};
