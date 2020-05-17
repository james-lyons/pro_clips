// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const fetchUsers = (req, res) => {
    console.log(req);

    db.User.find({}, (err, foundUsers) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('hello 1');

        res.status(200).json({
            status: 200,
            message: 'Success',
            data: foundUsers
        });
    });
};

const fetchUser = (req, res) => {
    console.log(req.session);
    db.User.findById(req.session.currentUser._id, (err, foundUser) => {

        console.log('error:', err);

        if (err) return res.status(500).json({
            status: 500,
            error: { err },
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

const editUser = (req,res) => {
    db.User.findByIdAndUpdate({}, (err, updatedUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
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
    fetchUsers,
    fetchUser,
    editUser,
    deleteUser
};
