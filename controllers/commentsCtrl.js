// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexComments = (req, res) => {
    db.Comment.find({ clip_id: req.params.clipId }, (err, foundComments) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: foundComments
        });
    });
};

const createComment = (req, res) => {

    const currentUser = req.session.currentUser;
    const comment = {
        author_name: currentUser.userName,
        comment_text: req.body.commentText,
        author_id: currentUser._id,
        clip_id: req.body.clipId
    };

    console.log('HELLO FROM CREATECOMMENT 1: currentUser - ', currentUser);
    console.log('HELLO FROM CREATECOMMENT 2: comment - ', comment);

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

            console.log('HELLO FROM CREATECOMMENT 3: foundUser - ', foundUser);

            foundUser.comments.push(createdComment._id);
            foundUser.save();
        });

        await db.Clip.findById(comment.clip_id, (err, foundClip) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('HELLO FROM CREATECOMMENT 4: foundClip - ', foundClip);

            foundClip.comments.push(createdComment._id);
            foundClip.save();
        });

        console.log('HELLO FROM CREATECOMMENT 5: createdComment - ', createdComment);

        return res.status(200).json({
            status: 200,
            message: 'Success!'
        });
    });
};

const editComment = (req, res) => {
    db.Comment.findByIdAndUpdate(req.params.id, req.body, (err, editedComment) => {
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

const deleteComment = async (req, res) => {

    await db.Comment.findByIdAndDelete(req.params.id, (err, deletedComment) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again'
        });
        console.log('HELLO FROM DELETE COMMENT 1:', deletedComment);

        db.User.findById(req.session.currentUser._id, (err, foundUser) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
    
            let newCommentsArr = foundUser.comments.filter(comment => comment.toString() !== req.params.id);
            foundUser.comments = newCommentsArr;
    
            console.log('HELLO FROM DELETE COMMENT 2:', foundUser)
    
            foundUser.save();
        });

        db.Clip.findById(deletedComment.clip_id, (err, foundClip) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
    
            console.log('HELLO FROM DELETE COMMENT 2:', foundClip);
    
            let newCommentsArr = foundClip.comments.filter(comment => comment.toString() !== req.params.id);
    
            console.log('HELLO FROM DELETE COMMENT 3:', newCommentsArr);
    
            foundClip.comments = newCommentsArr;
    
            console.log('HELLO FROM DELETE COMMENT 4:', foundClip);
    
            foundClip.save();

            return res.status(202).json({
                status: 200,
                message: 'Success',
                data: foundClip
            });
        });
    });
};

module.exports = {
    indexComments,
    createComment,
    editComment,
    deleteComment
};
