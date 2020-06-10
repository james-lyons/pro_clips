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

const createReply = (req, res) => {

    const currentUser = req.session.currentUser;
    const reply = {
        author_name: currentUser.userName,
        reply_text: req.body.replyText,
        author_id: currentUser._id,
        comment_id: req.params.id
    };

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

            
            foundUser.replies.push(createdReply._id);
            foundUser.save();
        });

        await db.Comment.findById(reply.comment_id, (err, foundComment) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
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
    db.Reply.findByIdAndDelete(req.params.id, async (err, deletedReply ) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again'
        });
        
        await db.User.findById(req.session.currentUser._id, (err, foundUser) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
    
            let newRepliesArr = foundUser.replies.filter(reply => reply.toString() !== req.params.id);
    
            foundUser.replies = newRepliesArr;
            foundUser.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });
            });
        });
    
        await db.Comment.findById(deletedReply.comment_id, (err, foundComment) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
    
            let newRepliesArr = foundComment.replies.filter(reply => reply._id.toString() !== req.params.id);
    
            foundComment.replies = newRepliesArr;
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
    });
};

const likeReply = (req, res) => {
    const userId = req.session.currentUser._id;
    const replyId = req.params.id;

    db.User.findById(userId, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        let foundReplyLikes = foundUser.liked_replies.filter(reply => replyId == reply._id.toString());

        if (foundReplyLikes.length > 0) {
            return { message: 'Already liked' }
        };

        foundUser.liked_replies.push(replyId);
        foundUser.save((err) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Reply.findById(replyId, (err, foundReply) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
    
            foundReply.likes.push(userId);

            foundReply.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
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

const unlikeReply = (req, res) => {
    const userId = req.session.currentUser._id;
    const replyId = req.params.id;

    console.log('Hello from unlikeReply 1a: userId', userId);
    console.log('Hello from unlikeReply 1b: replyId', replyId);

    db.User.findById(userId, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('Hello from unlikeReply 2: replyId', foundUser);

        let newReplyLikes = foundUser.liked_replies.filter(reply => reply.toString() !== replyId);
        foundUser.liked_replies = newReplyLikes;

        console.log('Hello from unlikeReply 3: foundUserReplies', foundUser.liked_replies);

        foundUser.save((err) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Reply.findById(replyId, (err, foundReply) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('Hello from unlikeReply 4: foundReply', foundReply);
    
            let newLikesArr = foundReply.likes.filter(like => like.toString() !== userId);
            foundReply.likes = newLikesArr;

            console.log('Hello from unlikeReply 5: foundReply.likes', foundReply.likes);
    
            foundReply.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
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
    indexReplies,
    createReply,
    deleteReply,
    likeReply,
    unlikeReply
};
