// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexReplies = (req, res) => {
    db.Comment.findById(req.params.id, (error, foundComment) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: foundComment.replies
        });
    });
};

const createReply = (req, res) => {

    const currentUser = req.session.currentUser;
    const reply = {
        author_name: currentUser.username,
        reply_text: req.body.replyText,
        author_id: currentUser._id,
        comment_id: req.params.id
    };

    db.Reply.create(reply, async (error, createdReply) => {
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

            foundUser.replies.push(createdReply._id);
            foundUser.save();
        });

        await db.Comment.findById(reply.comment_id, (error, foundComment) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            foundComment.replies.push(createdReply);
            foundComment.save();

        });

        return res.status(200).json({
            status: 200,
            message: 'Success!'
        });
    });
};

const deleteReply = (req, res) => {
    db.Reply.findByIdAndDelete(req.params.id, async (error, deletedReply ) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again'
        });
        
        await db.User.findById(req.session.currentUser._id, (error, foundUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            let newRepliesArr = foundUser.replies.filter(reply => reply.toString() !== req.params.id);
    
            foundUser.replies = newRepliesArr;
            foundUser.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
            });
        });
    
        await db.Comment.findById(deletedReply.comment_id, (error, foundComment) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            let newRepliesArr = foundComment.replies.filter(reply => reply._id.toString() !== req.params.id);
    
            foundComment.replies = newRepliesArr;
            foundComment.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
            });
        });
    
        return res.status(202).json({
            status: 200,
            message: 'Success'
        });
    });
};

const likeReply = (req, res) => {
    const userId = req.session.currentUser._id;
    const replyId = req.params.id;

    db.User.findById(userId, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        let foundReplyLikes = foundUser.liked_replies.filter(reply => replyId == reply._id.toString());

        if (foundReplyLikes.length > 0) {
            return { message: 'Already liked' }
        };

        foundUser.liked_replies.push(replyId);
        foundUser.save((error) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Reply.findById(replyId, (error, foundReply) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            foundReply.likes.push(userId);

            foundReply.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
            });
            
            db.Comment.findById(foundReply.comment_id, (error, foundComment) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });

                foundComment.replies.forEach(reply => {
                    if (reply._id.toString() === replyId) {
                        reply.likes.push(userId);
                    };
                });

                foundComment.save();
                
                db.Comment.find({ clip_id: foundComment.clip_id }, (error, foundComments) => {
                    if (error) return res.status(500).json({
                        status: 500,
                        message: 'Something went wrong, please try again.',
                        error: err
                    });

                    return res.status(200).json({
                        status: 200,
                        message: 'Success',
                        data: foundComments
                    });
                });
            });
        });
    });
};

const unlikeReply = (req, res) => {
    const userId = req.session.currentUser._id;
    const replyId = req.params.id;

    db.User.findById(userId, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        let newReplyLikes = foundUser.liked_replies.filter(reply => reply.toString() !== replyId);
        foundUser.liked_replies = newReplyLikes;

        foundUser.save((error) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Reply.findById(replyId, (error, foundReply) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            let newLikesArr = foundReply.likes.filter(like => like.toString() !== userId);
            foundReply.likes = newLikesArr;
    
            foundReply.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
            });
            
            db.Comment.findById(foundReply.comment_id, (error, foundComment) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });

                foundComment.replies.forEach(reply => {

                    if (reply._id.toString() === replyId) {
                        let replyLikes = reply.likes.filter(like => like.toString() !== userId);
                        reply.likes = replyLikes;
                    };
                });

                foundComment.save();

                db.Comment.find({ clip_id: foundComment.clip_id }, (error, foundComments) => {
                    if (error) return res.status(500).json({
                        status: 500,
                        message: 'Something went wrong, please try again.',
                        error: err
                    });

                    return res.status(200).json({
                        status: 200,
                        message: 'Success',
                        data: foundComments
                    });
                });
            });
        });
    });
};

module.exports = {
    indexReplies,
    createReply,
    deleteReply,
    likeReply,
    unlikeReply
};
