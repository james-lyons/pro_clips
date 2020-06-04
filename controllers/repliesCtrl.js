// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexReplies = (req, res) => {
    db.Reply.find({})
};

const showReply = (req, res) => {
    console.log('hi')
};

const createReply = (req, res) => {
    const currentUser = req.session.currentUser;
    const reply = {
        author_name: currentUser.userName,
        replyText: req.body.replyText,
        author: currentUser._id,
        comment: req.body.commentId
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

        await db.Comment.findById(reply.comment, (err, foundComment) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('HELLO FROM CREATEREPLY 4: foundClip - ', foundComment);

            foundClip.replies.push(createdReply._id);
            foundClip.save();
        });

        console.log('HELLO FROM CREATEREPLY 5: createdReply - ', createdReply);

        return res.status(200).json({
            status: 200,
            message: 'Success!'
        });
    });
};

const editReply = (req, res) => {
    console.log('hi');
};

const deleteReply = (req, res) => {
    console.log('hi');
};

module.exports = {
    indexReplies,
    showReply,
    createReply,
    editReply,
    deleteReply
};
