// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //
// idk what's gonna go here jajaja

const indexFriends = (req, res) => {
    console.log('hello');
};

const followUser = (req, res) => {
    console.log('HELLO 1');
    console.log(req.params);


    db.User.findOne({ userName: req.params.userName }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('HELLO 2');
        db.User.findById(req.session.currentUser._id, (err, foundCurrentUser) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('foundUser', foundUser);
            console.log('foundCurrentUser', foundCurrentUser);

            foundUser.followers.push(foundCurrentUser._id);
            foundCurrentUser.following.push(foundUser._id);

            foundUser.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });
            });

            foundCurrentUser.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });

                console.log('FOLLOW USER 6', foundUser.followers);


                return res.status(200).json({
                    status: 200,
                    message: 'Success!',
                    data: foundUser
                });
            });
        });
   });
};

const unfollowUser = (req, res) => {
    console.log('HELLO 1');
    console.log(req.params);


    db.User.findOne({ userName: req.params.userName }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('HELLO 2');
        db.User.findById(req.session.currentUser._id, (err, foundCurrentUser) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('HELLO 3')
            // user._id === objectId, have to use .toString() to compare with

            const foundUserId = foundUser._id.toString();
            const foundCurrentUserId = foundCurrentUser._id.toString()

            const newFollowerList = foundUser.followers.filter(follower =>
                follower.toString() !== foundCurrentUserId);
            const newFollowingList = foundCurrentUser.following.filter(followed =>
                followed.toString() !== foundUserId);

            foundUser.followers = newFollowerList;
            foundCurrentUser.following = newFollowingList;

            console.log('HELLO 4')

            foundUser.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });
            });

            foundCurrentUser.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });

                console.log('UNFOLLOW USER 5', foundUser.followers);

                return res.status(200).json({
                    status: 200,
                    message: 'Success!',
                    data: foundUser
                });
            });
        });
   });
};

module.exports = {
    indexFriends,
    followUser,
    unfollowUser
};
