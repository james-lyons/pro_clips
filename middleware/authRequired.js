module.exports = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.status(401).json({
            status: 401,
            error: { errors: 'Unauthorized. Must be logged in.' },
            message: 'Please login and try again.'
        });
    };
    next();
};
