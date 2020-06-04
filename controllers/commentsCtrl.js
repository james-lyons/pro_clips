// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexComments = (req, res) => {
    db.Comment.find({})
};

const showComment = (req, res) => {
    console.log('hi')
};

const createComment = (req, res) => {
    const currentUser = req.session.currentUser;
    const comment = {
        author_name: currentUser.userName,
        commentText: req.body.commentText,
        author: currentUser._id,
        clip: req.body.clipId
    };

    console.log('HELLO FROM CREATECOMMEN 1: currentUser - ', currentUser);
    console.log('HELLO FROM CREATECOMMEN 2: comment - ', comment);

    db.Comment.create(comment, async (err, createdComment) => {
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

            console.log('HELLO FROM CREATECOMMEN 3: foundUser - ', foundUser);

            foundUser.comments.push(createdComment._id);
            foundUser.save();
        });

        await db.Clip.findById(comment.clip, (err, foundClip) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('HELLO FROM CREATECOMMEN 4: foundClip - ', foundClip);

            foundClip.comments.push(createdComment._id);
            foundClip.save();
        });

        console.log('HELLO FROM CREATECOMMEN 5: createdComment - ', createdComment);

        return res.status(200).json({
            status: 200,
            message: 'Success!'
        });
    });
};

const editComment = (req, res) => {
    console.log('hi');
};

const deleteComment = (req, res) => {
    console.log('hi');
};

module.exports = {
    indexComments,
    showComment,
    createComment,
    editComment,
    deleteComment
};
