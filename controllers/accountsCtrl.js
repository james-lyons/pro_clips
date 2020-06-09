// ------------------------- Modules ------------------------- //

const bcrypt = require('bcryptjs');
const db = require('../models');

// ----------------------- Controllers ----------------------- //

const fetchUsers = (req, res) => {

    db.User.find({}, (err, foundUsers) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        res.status(200).json({
            status: 200,
            message: 'Success',
            data: foundUsers
        });
    });
};

const fetchCurrentUser = (req, res) => {

    db.User.findById(req.session.currentUser._id, (err, foundUser) => {

        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully found user.',
            data: foundUser
        });
    });
};

const fetchUser = (req, res) => {

    db.User.findOne({ userName: req.params.userName }, (err, foundUser) => {

        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        if (!foundUser) return res.status(400).json({
            status: 400,
            error: [{ error: 'No user by that name.' }],
            message: 'Please try again.'
        });

        if (req.session.currentUser) {
            db.User.findById(req.session.currentUser._id, (err, foundCurrentUser) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });

                if (foundCurrentUser.following.includes(foundUser._id.toString())) {

                    const userData = {
                        bio: foundUser.bio,
                        userName: foundUser.userName,
                        profile_image: foundUser.profile_image,
                        clips: foundUser.clips,
                        following: foundUser.following,
                        followers: foundUser.followers,
                        isFollowed: true
                    };
                        
                    return res.status(200).json({
                        status: 200,
                        message: 'Successfully found user.',
                        data: userData
                    });

                } else {
                    const userData = {
                        bio: foundUser.bio,
                        userName: foundUser.userName,
                        profile_image: foundUser.profile_image,
                        clips: foundUser.clips,
                        following: foundUser.following,
                        followers: foundUser.followers,
                        isFollowed: false
                    };
        
                    return res.status(200).json({
                        status: 200,
                        message: 'Successfully found user.',
                        data: userData
                    }); 
                }; 
            });
            
        } else {
            const userData = {
                bio: foundUser.bio,
                userName: foundUser.userName,
                profile_image: foundUser.profile_image,
                clips: foundUser.clips,
                following: foundUser.following,
                followers: foundUser.followers,
                isFollowed: false
            };
        
            return res.status(200).json({
                status: 200,
                message: 'Successfully found user.',
                data: userData
            });
        };
    });
};

const editUserProfile = (req,res) => {

    db.User.findOne({ userName: req.body.userName }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        if (foundUser) return res.status(400).json({
            status: 400,
            errors: [{ message: 'Username already registered' }],
            message: 'Please try again.'
        });

        db.User.findById(req.session.currentUser, (err, foundUser) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            db.User.findByIdAndUpdate(req.session.currentUser._id, req.body, async (err, updatedUser) => {
        
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });
        
                let updatedUserData = updatedUser;
    
                if (req.body.bio && req.body.userName) {
                    updatedUserData.bio = req.body.bio;
                    updatedUserData.userName = req.body.userName;
                } else if (req.body.bio) {
                    updatedUserData.bio = req.body.bio;
                } else if (req.body.userName) {
                    updatedUserData.userName = req.body.userName;
                } else if (req.body.profileImage) {
                    updatedUserData.profile_image = req.body.profileImage;
                };
    
                req.session.currentUser.userName = req.body.userName;
    
                if (req.body.userName) {
    
                    await db.Comment.find({ author_name: foundUser.userName }, (err, foundComments) => {
                        if (err) return res.status(500).json({
                            status: 500,
                            error: err,
                            message: 'Something went wrong, please try again.'
                        });
        
                        foundComments.forEach(foundComment => {
                            foundComment.author_name = req.body.userName;
                            foundComment.replies.forEach(reply => {
                                if (reply.author_name === foundUser.userName) {
                                    reply.author_name = req.body.userName
                                };
                            });
                            foundComment.save();
                        });
                    });
    
                    await db.Reply.find({ author_name: foundUser.userName }, (err, foundReplies) => {
                        if (err) return res.status(500).json({
                            status: 500,
                            erro: err,
                            message: 'Something went wrong, please try again.'
                        });
    
    
                        foundReplies.forEach(foundReply => {
                            foundReply.author_name = req.body.userName;
                            foundReply.save();
                        });
                    });
                };
        
                res.status(202).json({
                    status: 202,
                    message: 'Successfully edited user profile',
                    data: updatedUserData
                });
            });
        }); 
    });
};

const editUserPassword = (req, res) => { 

    let { oldPassword, password, password2 } = req.body;
    let errors = [];
    
    if (!password) {
        errors.push({ message: 'Please enter your password' });
    };

    if (!password2) {
        errors.push({ message: 'Please enter your password' });
    };

    if (password !== password2) {
        errors.push({ message: 'Passwords must match' });
    };

    if (Boolean(errors.length)) {
        return res.status(400).json({
            status: 400,
            errors: errors,
            message: 'Please check all fields.'
        });
    };

    db.User.findById(req.session.currentUser._id, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        bcrypt.compare(oldPassword, foundUser.password, (err, isMatch) => {
            if (err) return res.status(500).json({
                status: 500,
                message: 'Something went wrong, please try again.'
            });

            if (isMatch) {

                bcrypt.genSalt(10, (err, salt) => {
                    if (err) return res.status(500).json({
                        status: 500,
                        errors: err,
                        message: 'Something went wrong, please try again.'
                    });

                    bcrypt.hash(req.body.password, salt, (err, newHash) => {
                        if (err) return res.status(500).json({
                            status: 500,
                            errors: err,
                            message: 'Something went wrong, please try again.'
                        });

                        foundUser.password = newHash;
                        foundUser.save((err) => {
                            if (err) return res.status(500).json({
                                status: 500,
                                errors: err,
                                message: 'Something went wrong, please try again.'
                            });

                            res.status(200).json({
                                status: 200,
                                message: 'Successfully updated password.'
                            });
                        });
                    });
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    errors: [{ message: 'Password is incorrect. '}],
                    message: 'Please try again.'
                });
            };
        });
    });
};

const editUserEmail = (req, res) => {

    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        if (foundUser) return res.status(400).json({
            status: 400,
            errors: [{ message: 'Email already registered' }],
            message: 'Please try again.'
        });

        db.User.findByIdAndUpdate(req.session.currentUser._id, req.body, (err, updatedUser) => {
    
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
        
            res.status(202).json({
                status: 202,
                message: 'Successfully edited user profile',
                data: updatedUser
            });
        });
    });
};

const deleteUser = (req, res) => {

    db.User.findByIdAndDelete(req.session.currentUser._id, (err, deletedUser) => {
        if (err) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.'
        });

        res.status(200).json({
            status: 200,
            message: 'Account successfully deleted'
        });
    });
};

module.exports = {
    fetchUsers,
    fetchCurrentUser,
    fetchUser,
    editUserProfile,
    editUserEmail,
    editUserPassword,
    deleteUser
};
