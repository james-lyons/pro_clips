// ------------------------- Modules ------------------------- //

const bcrypt = require('bcryptjs');
const db = require('../models');

// ----------------------- Controllers ----------------------- //

const fetchUsers = (req, res) => {

    db.User.find({}, (error, foundUsers) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
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

    db.User.findById(req.session.currentUser._id, (error, foundUser) => {

        if (error) return res.status(500).json({
            status: 500,
            error,
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
    console.log(req.params.username)

    db.User.findOne({ username: req.params.username }, (error, foundUser) => {

        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        if (!foundUser) return res.status(400).json({
            status: 400,
            error: { message: 'No user by that name.' },
            message: 'Please try again.'
        });

        if (req.session.currentUser) {
            db.User.findById(req.session.currentUser._id, (error, foundCurrentUser) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });

                if (foundCurrentUser.following.includes(foundUser._id.toString())) {

                    const userData = {
                        bio: foundUser.bio,
                        username: foundUser.username,
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
                        username: foundUser.username,
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
                username: foundUser.username,
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

    db.User.findOne({ username: req.body.username }, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        if (foundUser) return res.status(400).json({
            status: 400,
            error: { message: 'Username already registered' },
            message: 'Please try again.'
        });

        db.User.findById(req.session.currentUser, (error, foundUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            db.User.findByIdAndUpdate(req.session.currentUser._id, req.body, async (error, updatedUser) => {
        
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
        
                let updatedUserData = updatedUser;
    
                if (req.body.bio && req.body.username) {
                    updatedUserData.bio = req.body.bio;
                    updatedUserData.username = req.body.username;

                } else if (req.body.bio) {
                    updatedUserData.bio = req.body.bio;

                } else if (req.body.username) {
                    updatedUserData.username = req.body.username;

                } else if (req.body.profileImage) {
                    updatedUserData.profile_image = req.body.profileImage;
                    
                };
    
                req.session.currentUser.username = req.body.username;
    
                if (req.body.username) {

                    await db.Clip.find({ poster: foundUser._id }, (error, foundClips) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                            message: 'Something went wrong, please try again.'
                        });

                        foundClips.forEach(clip => {
                            clip.poster_name = req.body.username;
                            clip.save();
                        });
                    });
    
                    await db.Comment.find({ author_name: foundUser.username }, (error, foundComments) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                            message: 'Something went wrong, please try again.'
                        });
        
                        foundComments.forEach(foundComment => {
                            foundComment.author_name = req.body.username;
                            foundComment.replies.forEach(reply => {
                                if (reply.author_name === foundUser.username) {
                                    reply.author_name = req.body.username
                                };
                            });
                            foundComment.save();
                        });
                    });
    
                    await db.Reply.find({ author_name: foundUser.username }, (error, foundReplies) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                            message: 'Something went wrong, please try again.'
                        });
    
    
                        foundReplies.forEach(foundReply => {
                            foundReply.author_name = req.body.username;
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
            errors,
            message: 'Please check all fields.'
        });
    };

    db.User.findById(req.session.currentUser._id, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        bcrypt.compare(oldPassword, foundUser.password, (error, isMatch) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            if (isMatch) {

                bcrypt.genSalt(10, (error, salt) => {
                    if (error) return res.status(500).json({
                        status: 500,
                        error,
                        message: 'Something went wrong, please try again.'
                    });

                    bcrypt.hash(req.body.password, salt, (error, newHash) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                            message: 'Something went wrong, please try again.'
                        });

                        foundUser.password = newHash;
                        foundUser.save((error) => {
                            if (error) return res.status(500).json({
                                status: 500,
                                error,
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
                    error: { message: 'Password is incorrect. '},
                    message: 'Please try again.'
                });
            };
        });
    });
};

const editUserEmail = (req, res) => {

    db.User.findOne({ email: req.body.email }, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        if (foundUser) return res.status(400).json({
            status: 400,
            error: { message: 'Email already registered' },
            message: 'Please try again.'
        });

        db.User.findByIdAndUpdate(req.session.currentUser._id, req.body, (error, updatedUser) => {
    
            if (error) return res.status(500).json({
                status: 500,
                error,
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

    db.User.findByIdAndDelete(req.session.currentUser._id, (error, deletedUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
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
