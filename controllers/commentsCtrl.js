// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexComments = (req, res) => {
    db.Comment.find({ clip_id: req.params.clipId }, (error, foundComments) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
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
    const { clipId, commentText } = req.body;
    const comment = {
        clip_id: clipId,
        comment_text: commentText,
        author_id: currentUser._id,
        author_name: currentUser.username,
        author_profile_image: currentUser.profile_image,
    };

    db.Comment.create(comment, async (error, createdComment) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        await db.User.findById(currentUser._id, (error, foundUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            foundUser.comments.push(createdComment._id);
            foundUser.save();
        });


        await db.Clip.findById(comment.clip_id, (error, foundClip) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            foundClip.comments.push(createdComment._id);
            foundClip.save();
        });


        return res.status(200).json({
            status: 200,
            message: 'Success!'
        });
    });
};

const deleteComment = (req, res) => {

    db.Comment.findByIdAndDelete(req.params.id, async (error, deletedComment) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again'
        });

        await db.Reply.deleteMany({ comment_id: req.params.id }, (error, deletedReplies) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        });

        await db.User.findById(req.session.currentUser._id, (error, foundUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            let newCommentsArr = foundUser.comments.filter(comment => comment.toString() !== req.params.id);
            foundUser.comments = newCommentsArr;
        
            foundUser.save();
        });

        await db.Clip.findById(deletedComment.clip_id, (error, foundClip) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        
            let newCommentsArr = foundClip.comments.filter(comment => comment.toString() !== req.params.id);
        
            foundClip.comments = newCommentsArr;
        
            foundClip.save();

            return res.status(202).json({
                status: 200,
                message: 'Success',
                data: foundClip
            });
        });
    });
};

const likeComment = (req, res) => {
    const userId = req.session.currentUser._id;
    const commentId = req.params.id;

    db.User.findById(userId, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        let foundCommentArray = foundUser.liked_comments.filter(comment => commentId == comment._id.toString());

        if (foundCommentArray.length > 0) {
            return { message: 'Already liked' };
        };

        foundUser.liked_comments.push(commentId);
        foundUser.save((error) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Comment.findById(commentId, (error, foundComment) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            foundComment.likes.push(userId);

            foundComment.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
            });
        });
    });

    return res.status(200).json({
        status: 200,
        message: 'Success'
    });
};

const unlikeComment = (req, res) => {
    const userId = req.session.currentUser._id;
    const commentId = req.params.id;

    db.User.findById(userId, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        let newCommentLikes = foundUser.liked_comments.filter(comment => comment.toString() !== commentId);
        foundUser.liked_comments = newCommentLikes;

        foundUser.save((error) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Comment.findById(commentId, (error, foundComment) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            let newLikesArr = foundComment.likes.filter(like => like.toString() !== userId);
            foundComment.likes = newLikesArr;
    
            foundComment.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
            });
        });
    });

    return res.status(200).json({
        status: 200,
        message: 'Success'
    });
};

module.exports = {
    indexComments,
    createComment,
    deleteComment,
    likeComment,
    unlikeComment
};
