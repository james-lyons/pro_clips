// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //
// idk what's gonna go here jajaja

const indexFriends = (req, res) => {
    console.log('hello');
};

const followUser = (req, res) => {

    db.User.findOne({ userName: req.params.userName }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        db.User.findById(req.session.currentUser._id, (err, foundCurrentUser) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

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

    db.User.findOne({ userName: req.params.userName }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        db.User.findById(req.session.currentUser._id, (err, foundCurrentUser) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
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
    db.User.findOne({ userName: req.params.userName }, async (error, foundUser) => {
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
                        userName: foundFollower.userName,
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
    db.User.findOne({ userName: req.params.userName }, async (error, foundUser) => {
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
                        userName: foundFollowedUser.userName,
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

const fetch = (req, res) => {
    console.log('Hello from fetchFollowingList 1: req.params.userName', req.params.userName)

    db.User.findOne({ userName: req.params.userName }, async (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        let followingList = [];
        console.log('Hello from fetchFollowingList 2a: foundUser', foundUser);
        console.log('Hello from fetchFollowingList 2b: foundUser.following', foundUser.following);

        if (foundUser.following) {
            await foundUser.following.forEach(follow => {
                db.User.findOne({ _id: follow }, (error, foundFollowedUser) => {
                    if (error) return res.status(500).json({
                        status: 500,
                        error,
                        message: 'Something went wrong, please try again.'
                    });

                    let followedUser = {
                        userName: foundFollowedUser.userName,
                        profile_image: foundFollowedUser.profile_image
                    };

                    console.log('Hello from fetchFollowingList 3: followedUser', followedUser);
    
                    followingList.push(followedUser);
                });
            });
            console.log('Hello from fetchFollowingList 4: followingList', followingList);

            return res.status(200).json({
                status: 200,
                data: followingList,
                message: 'Success'
            });
        } else {
            return res.status(200).json({
                status: 200,
                data: "This user doesn't follow anyone yet",
                message: 'Success'
            });    
        };
        
        // db.User.find({ _id: foundUser.following }, (error, foundUsers) => {
        //     if (error) return res.status(500).json({
        //         status: 500,
        //         error,
        //         message: 'Something went wrong, please try again.'
        //     });

        //     console.log('Hello from fetchFollowingList 2: foundUsers', foundUsers)

        //     return res.status(200).json({
        //         status: 200,
        //         data: foundUsers,
        //         message: 'Success'
        //     });
        // });
    });
};

module.exports = {
    indexFriends,
    followUser,
    unfollowUser,
    fetchFollowers,
    fetchFollowingList
};
