// ------------------------- Modules ------------------------- //

const db = require('../models');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { sendPasswordChangeEmail } = require('../middleware/sendEmail');

// ----------------------- Controllers ----------------------- //

const searchUsers = (req, res) => {
    db.User.find({ username: { $regex: req.params.search, '$options' : 'i' }}, (error, foundUsers) => {
        if (error) return res.status(500).json({
            status: 500,
            error
        });

        let searchResults = [];
        foundUsers.forEach(foundUser => searchResults.push({ title: foundUser.username, image: foundUser.profile_image }));

        return res.status(200).json({
            status: 200,
            data: searchResults
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
    
    db.User.findOne({ username: req.params.username }, (error, foundUser) => {

        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        if (!foundUser) return res.status(404).json({
            status: 404,
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
                        _id: foundUser._id,
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
                        _id: foundUser._id,
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
                _id: foundUser._id,
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

                if (req.body.profile_image) {    

                    await db.Comment.updateMany({ author_id: foundUser._id }, { author_profile_image: req.body.profile_image }, (error, updatedComments) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                        });
                    });

                    await db.Reply.updateMany({ author_id: foundUser._id}, { author_profile_image: req.body.profile_image }, (error, updatedReplies) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                        });
                    });
                };
    
                if (req.body.username) {

                    await db.Clip.updateMany({ poster: foundUser._id }, { poster_name: req.body.username }, (error, updatedClips) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                        });
                    });

                    await db.Comment.updateMany({ author_id: foundUser._id }, { author_name: req.body.username }, (error, updatedComments) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                        });
                    });

                    await db.Reply.updateMany({ author_id: foundUser._id }, { author_name: req.body.username }, (error, updatedReplies) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                        });
                    });
        
                res.status(202).json({
                    status: 202,
                    message: 'Successfully edited user profile',
                    data: updatedUserData
                });
            };
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

const recoverPassword = (req, res) => {
    db.User.findOne({ email: req.body.email }, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error
        });

        if (!foundUser) {
            return res.status(404).json({
                status: 404,
                error: { message: 'Account not found, please try to register again.' }
            });
        };

        sendPasswordChangeEmail(foundUser).catch(console.error);

        return res.status(201).json({
            status: 201,
        });
    });
};

const resetPassword = (req, res) => {
    const { userId, resetToken } = req.params;

    db.User.findById(userId, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error
        });

        const tokenSecret = foundUser.password + '-' + foundUser.createdAt;

        try {
            const jwttoken = JWT.verify(resetToken, tokenSecret);
    
            if (jwttoken.userId = userId) {
    
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
    
                            return res.status(200).json({
                                status: 200,
                                message: 'Successfully updated password.'
                            });
                        });
                    });
                });
    
            } else {
                return res.status(401).json({
                    status: 401,
                    error: { message: 'Unauthorized' }
                });
            };
        } catch (error) {
            return res.status(401).json({
                status: 401,
                error: { message: 'Unauthorized. If you requested a password reset, your link may have expired or may have been used already' }
            });
        };
    });

    return;
};

module.exports = {
    fetchUser,
    searchUsers,
    fetchCurrentUser,
    editUserProfile,
    deleteUser,
    editUserEmail,
    editUserPassword,
    recoverPassword,
    resetPassword,
};
