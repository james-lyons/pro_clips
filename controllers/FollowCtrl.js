// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const followUser = (req, res) => {

    db.User.findOne({ username: req.params.username }, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        db.User.findById(req.session.currentUser._id, (error, foundCurrentUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            foundUser.followers.push(foundCurrentUser._id);
            foundCurrentUser.following.push(foundUser._id);

            foundUser.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
            });

            foundCurrentUser.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });

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

    db.User.findOne({ username: req.params.username }, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        db.User.findById(req.session.currentUser._id, (error, foundCurrentUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            // user._id === objectId, have to use .toString() to compare with

            const foundUserId = foundUser._id.toString();
            const foundCurrentUserId = foundCurrentUser._id.toString()

            const newFollowerList = foundUser.followers.filter(follower =>
                follower.toString() !== foundCurrentUserId);
            const newFollowingList = foundCurrentUser.following.filter(followed =>
                followed.toString() !== foundUserId);

            foundUser.followers = newFollowerList;
            foundCurrentUser.following = newFollowingList;

            foundUser.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });
            });

            foundCurrentUser.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
                    message: 'Something went wrong, please try again.'
                });

                return res.status(200).json({
                    status: 200,
                    message: 'Success!',
                    data: foundUser
                });
            });
        });
   });
};

const fetchFollowers = (req, res) => {
    db.User.findOne({ username: req.params.username }, async (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        if (foundUser.followers) {
            let followers = [];

            foundUser.followers.forEach(follower => {
                db.User.findOne({ _id: follower }, (error, foundFollower) => {
                    if (error) return res.status(500).json({
                        status: 500,
                        error,
                        message: 'Something went wrong, please try again.'
                    });

                    let follower = {
                        username: foundFollower.username,
                        profile_image: foundFollower.profile_image
                    };

                    followers.push(follower);

                    if (followers.length === foundUser.followers.length) {
                        return res.status(200).json({
                            status: 200,
                            data: followers,
                            message: 'Success'
                        });
                    };
                });
            });
        } else {
            return res.status(200).json({
                status: 200,
                data: "This user doesn't have any followers yet",
                message: 'Success'
            });    
        };
    });
};

const fetchFollowingList = (req, res) => {
    db.User.findOne({ username: req.params.username }, async (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        if (foundUser.following) {
            let followingList = [];

            foundUser.following.forEach(followedUser => {
                db.User.findOne({ _id: followedUser }, (error, foundFollowedUser) => {
                    if (error) return res.status(500).json({
                        status: 500,
                        error,
                        message: 'Something went wrong, please try again.'
                    });

                    let followedUser = {
                        username: foundFollowedUser.username,
                        profile_image: foundFollowedUser.profile_image
                    };

                    followingList.push(followedUser);

                    if (followingList.length === foundUser.following.length) {
                        return res.status(200).json({
                            status: 200,
                            data: followingList,
                            message: 'Success'
                        });
                    };
                });
            });
        } else {
            return res.status(200).json({
                status: 200,
                data: "This user isn't following anyone yet",
                message: 'Success'
            });    
        };
    });
};

module.exports = {
    followUser,
    unfollowUser,
    fetchFollowers,
    fetchFollowingList
};
