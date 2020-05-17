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
            errors,
            message: 'Please enter all fields'
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
            errors: [{ message: 'Username or Email already registered' }],
            message: 'Please try again.'
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
                            message: 'Thanks for signing up!',
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
            errors: [{ message: 'Please enter your email and password'}],
            message: 'Please try again.'
        });
    };

    console.log('hello 1')

    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.'
        });

        console.log('hello 2')

        if (!foundUser) return res.status(400).json({
            status: 400,
            errors: [{ message: 'Email or Password is incorrect'}],
            message: 'Please try again.'
        });

        console.log('hello 3')

        bcrypt.compare( req.body.password, foundUser.password, (err, isMatch) => {
            if (err) return res.status(500).json({
                status: 500,
                message: 'Something went wrong, please try again.'
            });

            console.log('hello 4')

            if (isMatch) {
                req.session.currentUser = { _id: foundUser._id, userName: foundUser.userName };
                console.log('hello 5');
                console.log(req.session.currentUser);

                console.log(req.session)

                return res.status(200).json({
                    status: 200,
                    message: 'Successfully logged in.',
                    data: foundUser
                });

            } else {
                console.log('hello 6')
                console.log(err, isMatch)

                return res.status(400).json({
                    status: 400,
                    errors: [{ message: 'Email or Password is incorrect'}],
                    message: 'Please try again.'
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

        return res.status(200).json({
            status: 200,
            message: 'Successfully logged out.'
        });
    });
};

module.exports = {
    register,
    login,
    logout
};
