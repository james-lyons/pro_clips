// ------------------------- Modules ------------------------- //

const bcrypt = require('bcryptjs');
const db = require('../models');
const validateUser = require('../validation/userRegisteration');

// ----------------------- Controllers ----------------------- //

const register = (req, res) => {
    const { errors, notValid } = validateUser(req.body);

    console.log('hello 1', req.body)

    if (notValid) {
        return res.status(400).json({
            status: 400,
            errors
        });
    };

    console.log('hello 2')


    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.'
        });

        console.log('hello 3')


        if (foundUser) return res.status(400).json({
            status: 400,
            message: 'Email or Username already registered.'
        });

        console.log('hello 4')


        db.User.findOne({ userName: req.body.userName }, (err, foundUser) => {
            if (err) return res.status(500).json({
                status: 500,
                message: 'Something went wrong, please try again.'
            });

            console.log('hello 5')

    
            if (foundUser) return res.status(400).json({
                status: 400,
                message: 'Email or Username already registered.'
            });

            console.log('hello 6')

            bcrypt.genSalt(10,(err, salt) => {
                if (err) return res.status(500).json({
                    status: 500,
                    message: 'Something went wrong, please try again.'
                });

                console.log('hello 7')

    
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) return res.status(500).json({
                        status: 500,
                        message: 'Something went wrong, please try again.'
                    });

                    console.log('hello 8')
    
                    const newUser = {
                        userName: req.body.userName,
                        email: req.body.email,
                        password: hash,
                        password2: hash
                    };

                    console.log('hello 9', newUser)
    
                    db.User.create(newUser, (err, savedUser) => {
                        if (err) return res.status(500).json({
                            status: 500,
                            message: 'Something went wrong, please try again.'
                        });

                        console.log('hello 10')
    
                        res.status(201).json({
                            status: 201,
                            message: 'Successfully created new user.',
                            data: newUser
                        });
                    });
                });
            });
        });
    });
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(200).json({
            status: 400,
            message: 'Please enter your email and password.'
        });
    };

    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.'
        });

        if (!foundUser) return res.status(400).json({
            status: 400,
            message: 'Email of password is incorrect'
        });

        bcrypt.compare( req.body.password, foundUser.password, (err, isMatch) => {
            if (err) return res.status(500).json({
                status: 500,
                message: 'Something went wrong, please try again.'
            });

            if (isMatch) {
                req.session.currentUser = { _id: foundUser._id, userName: foundUser.userName };
                return res.status(200).json({
                    status: 200,
                    message: 'Successfully logged in.',
                    data: foundUser
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'Email or password is incorrect.'
                });
            };
        });
    });
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.'
        });
        res.sendStatus(200);
    });
};

module.exports = {
    register,
    login,
    logout
};
