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
    const { replyText } = req.body;
    const reply = {
        reply_text: replyText,
        comment_id: req.params.id,
        author_id: currentUser._id,
        author_name: currentUser.username,
        author_profile_image: currentUser.profile_image
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

            foundComment.replies.push(createdReply._id);
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
    
            let newRepliesArr = foundComment.replies.filter(reply => reply.toString() !== req.params.id);
    
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

            return res.status(200).json({
                status: 200,
                message: 'Success'
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

            return res.status(200).json({
                status: 200,
                message: 'Success'
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
