// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const showUser = (req, res) => {
    db.User.findById(req.session.currentUser._id, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.'
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully found user.',
            data: foundUser
        });
    });
};

const deleteUser = (req, res) => {
    db.User.findOneAndDelete({ name: req.params.name }, (err, deletedUser) => {
        if (err) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.'
        });
    });
};

module.exports = {
    showUser,
    deleteUser
};
