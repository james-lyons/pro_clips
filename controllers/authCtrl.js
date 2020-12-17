// ------------------------- Modules ------------------------- //

const db = require('../models');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const validateUser = require('../validation/userRegisteration');
const { sendEmailVerification } = require('../middleware/sendEmail');

// ----------------------- Controllers ----------------------- //

const confirmEmail = async (req, res) => {
    try {
        const { userId } = JWT.verify(req.params.confirmToken, process.env.EMAIL_SECRET);

        await db.User.findByIdAndUpdate(userId, { isConfirmed: true }, (error, updatedUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error
            });

            return res.status(201).json({
                status: 201,
                message: 'Success'
            });
        });

    } catch (error) {
        return res.send(error);
    };
    return;
};

const resendConfirmation = (req, res) => {
    db.User.findOne({ email: req.params.email }, (error, foundUser) => {
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

        sendEmailVerification(foundUser).catch(console.error);

        return res.status(201).json({
            status: 201,
        });
    });
};

const register = (req, res) => {

    console.log("HELLO FROM REGISTER 1: ", req.body);

    const { errors, notValid } = validateUser(req.body);

    if (notValid) {
        return res.status(400).json({
            status: 400,
            errors,
            message: 'Please enter all fields'
        });
    };

    db.User.findOne({ email: req.body.email }, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        console.log("HELLO FROM REGISTER 2: ", error);

        if (foundUser) return res.status(400).json({
            status: 400,
            error: { message: 'Username or Email already registered' },
            message: 'Please try again.'
        });

        console.log("HELLO FROM REGISTER 3: ", foundUser);

        db.User.findOne({ username: req.body.username }, (error, foundUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            if (foundUser) return res.status(400).json({
                status: 400,
                error: { message: 'Email or Username already registered.' },
                message: 'Please try again.'
            });

            bcrypt.genSalt(10,(error, salt) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
    
                bcrypt.hash(req.body.password, salt, (error, hash) => {
                    if (error) return res.status(500).json({
                        status: 500,
                        error,
                        message: 'Something went wrong, please try again.'
                    });
    
                    const newUser = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        password2: hash
                    };

                    console.log("HELLO FROM REGISTER 4: ", newUser);
    
                    db.User.create(newUser, (error, createdUser) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            error,
                            message: 'Something went wrong, please try again.'
                        });

                        console.log("HELLO FROM REGISTER 5: ", createdUser);

                        sendEmailVerification(createdUser).catch(console.error);

                        
    
                        return res.status(201).json({
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
    console.log('HELLO FROM LOGIN 1', req.body);
    
    if (!req.body.email || !req.body.password) {
        return res.status(200).json({
            status: 400,
            error: { message: 'Please enter your email and password' },
            message: 'Please try again.'
        });
    };

    db.User.findOne({ email: req.body.email }, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        console.log('HELLO FROM LOGIN 2:', foundUser);

        if (!foundUser) return res.status(400).json({
            status: 400,
            error: { message: 'Email or Password is incorrect' },
            message: 'Please try again.'
        });

        if (!foundUser.isConfirmed) return res.status(400).json({
            status: 400,
            error: { message: "If you have registered an account and haven't yet verified your email address, please check your inbox and click the link provided." },
            message: 'Please try again.'
        });

        bcrypt.compare(req.body.password, foundUser.password, (error, isMatch) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            if (isMatch) {
                req.session.currentUser = {
                    _id: foundUser._id,
                    username: foundUser.username,
                    profile_image: foundUser.profile_image
                };

                console.log('HELLO FROM LOGIN 3: ', req.session);

                return res.status(200).json({
                    status: 200,
                    message: 'Successfully logged in.',
                    data: foundUser
                });

            } else {

                return res.status(400).json({
                    status: 400,
                    error: { message: 'Email or Password is incorrect'},
                    message: 'Please try again.'
                });
            };
        });
    });
};

const logout = (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Successfully logged out.'
        });
    });
};

module.exports = {
    login,
    logout,
    register,
    confirmEmail,
    resendConfirmation
};
