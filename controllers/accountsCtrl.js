// ------------------------- Modules ------------------------- //

const bcrypt = require('bcryptjs');
const db = require('../models');

// ----------------------- Controllers ----------------------- //

const fetchUsers = (req, res) => {
    // console.log(req);

    db.User.find({}, (err, foundUsers) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        // console.log('hello 1');

        res.status(200).json({
            status: 200,
            message: 'Success',
            data: foundUsers
        });
    });
};

const fetchCurrentUser = (req, res) => {
    console.log(req.body);
    db.User.findById(req.session.currentUser._id, (err, foundUser) => {

        console.log('error:', err);

        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('Hello 1');
        console.log('founder user:', foundUser)

        res.status(200).json({
            status: 200,
            message: 'Successfully found user.',
            data: foundUser
        });
    });
};

const fetchUser = (req, res) => {
    console.log('body', req.body);
    console.log('params', req.params)

    db.User.findOne(req.body.userName, (err, foundUser) => {

        console.log('error:', err);

        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        const userData = {
            bio: foundUser.bio,
            userName: foundUser.userName,
            profile_image: foundUser.profile_image,
            posts: foundUser.posts,
            following: foundUser.following,
            followers: foundUser.followers
        };

        console.log('Hello 1');
        console.log('founder user:', foundUser)

        res.status(200).json({
            status: 200,
            message: 'Successfully found user.',
            data: userData
        });
    });
};

const editUserProfile = (req,res) => {
    console.log(req.body);

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
        
        db.User.findByIdAndUpdate(req.session.currentUser._id, req.body, (err, updatedUser) => {
            console.log('hello 1', req.body);
    
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
    
            console.log('hello 2')
    
            res.status(202).json({
                status: 202,
                message: 'Successfully edited user profile',
                data: updatedUser
            });
        });
    });
};

const editUserPassword = (req, res) => { 
    console.log('hello 1', req.body);

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

            console.log('hello 3')

            if (isMatch) {

                bcrypt.genSalt(10, (err, salt) => {
                    if (err) return res.status(500).json({
                        status: 500,
                        errors: err,
                        message: 'Something went wrong, please try again.'
                    });

                    console.log('hello 6: new salt', salt)

                    bcrypt.hash(req.body.password, salt, (err, newHash) => {
                        if (err) return res.status(500).json({
                            status: 500,
                            errors: err,
                            message: 'Something went wrong, please try again.'
                        });

                        console.log('hello 7: New password hash', newHash);

                        foundUser.password = newHash;
                        foundUser.save((err) => {
                            if (err) return res.status(500).json({
                                status: 500,
                                errors: err,
                                message: 'Something went wrong, please try again.'
                            });

                            console.log('hello 8')

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
    console.log('hello 1', req.body);
    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('hello 2', req.session);

        if (foundUser) return res.status(400).json({
            status: 400,
            errors: [{ message: 'Email already registered' }],
            message: 'Please try again.'
        });

        db.User.findByIdAndUpdate(req.session.currentUser._id, req.body, (err, updatedUser) => {
            console.log('hello 3', req.body);
    
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
    
            console.log('hello 4')
    
            res.status(202).json({
                status: 202,
                message: 'Successfully edited user profile',
                data: updatedUser
            });
        });
    });
};

const deleteUser = (req, res) => {
    console.log('hello 1', req.session);

    db.User.findByIdAndDelete(req.session.currentUser._id, (err, deletedUser) => {
        if (err) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.'
        });

        console.log('hello 2', req.session);
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
