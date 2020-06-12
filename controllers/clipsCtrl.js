// ------------------------- Modules ------------------------- //

const db = require('../models');
const aws = require('aws-sdk');

// ----------------------- Controllers ----------------------- //

const indexUserClips = (req, res) => {
    db.User.findOne({ userName: req.params.username }, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });
        
        db.Clip.find({ poster: foundUser._id }, (err, foundClips) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
    
            return res.status(200).json({
                status: 200,
                message: 'Success.',
                data: foundClips
            });
        });
    });
};

const indexBrowseClips = async (req, res) => {
    let ApexLegends;
    let CODWarzone;
    let LeagueOfLegends;
    let Valorant;
    let Fortnite;

    await db.Clip.find({"game": "Apex Legends"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        ApexLegends = foundClips;

    }).limit(3);

    await db.Clip.find({"game": "C.O.D. Warzone"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        CODWarzone = foundClips;

    }).limit(3);

    await db.Clip.find({"game": "League of Legends"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        LeagueOfLegends = foundClips;

    }).limit(3);

    await db.Clip.find({"game": "Valorant"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        Valorant = foundClips;

    }).limit(3);

    await db.Clip.find({"game": "Fortnite"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        Fortnite = foundClips;

    }).limit(3);

    let browsedClips = {
        ApexLegends,
        CODWarzone,
        LeagueOfLegends,
        Valorant,
        Fortnite,
    };

    return res.status(200).json({
        status: 200,
        message: 'Success',
        data: browsedClips
    });
};

const showClip = (req, res) => {

    db.Clip.findById(req.params.id, (err, foundClip) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: foundClip
        });
    });
};

const uploadClip = (req, res) => {

    db.User.findById(req.session.currentUser, (err, foundUser) => {

        let file = req.file;
        let username = req.session.currentUser.userName;
        let title = req.body.title;
        let currentDate = Date.now();
        let newKey = username + '.' + currentDate;
        let newUrl = "https://s3-us-west-1.amazonaws.com/pro.clips/" + newKey;

        let s3bucket = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });

        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: newKey,
            Body: file.buffer,
            ACL: "public-read"
        };

        s3bucket.upload(params, (err, data) => {
            if (err) return res.status(500).json({ 
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
        });

        let newClip = {
            poster: foundUser._id,
            title: title,
            key: newKey,
            url: newUrl,
            game: req.body.game
        };

        db.Clip.create(newClip, (err, createdClip) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            foundUser.clips.push(createdClip._id);
            foundUser.save();
        });

        return res.status(200).json({
            status: 200,
            message: 'Successfully added clip to user.',
        });
    });
};

const editClip = (req, res) => {

    db.Clip.findByIdAndUpdate(req.params.id, req.body, (error, foundClip) => {
        if (error) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.',
            error
        });

        const updatedClip = foundClip;
        updatedClip.title = req.body.title;

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: updatedClip
        });
    });
};

const deleteClip = (req, res) => {

    db.Clip.findByIdAndDelete(req.params.id, (err, deletedClip) => {

        db.User.findById(req.session.currentUser._id, (err, foundUser) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            const newClipList = foundUser.clips.filter(clip => clip.toString() !== req.params.id);
            foundUser.clips = newClipList;
            
            foundUser.save();
        });

        let s3bucket = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });
      
        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: deletedClip.key
        };
            
        s3bucket.deleteObject(params, (err, data) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            return res.status(200).json({
                status: 200,
                message: 'Success'
            });
        });
    });
};

const likeClip = (req, res) => {
    const userId = req.session.currentUser._id;
    const clipId = req.params.id;

    console.log('Hello from likeClip 1a: userId', userId);
    console.log('Hello from likeClip 1b: clipId', clipId);

    db.User.findById(userId, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        let foundClipArray = foundUser.liked_clips.filter(clip => clipId == clip._id.toString());

        if (foundClipArray.length > 0) {
            return { message: 'Already liked' }
        };

        foundUser.liked_clips.push(clipId);
        foundUser.save((err) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Clip.findById(clipId, (err, foundClip) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('hello from likeclip: foundClip', foundClip)
    
            foundClip.likes.push(userId);

            foundClip.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });
            });

            return res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundClip
            });
        });
    });
};

const unlikeClip = (req, res) => {
    const userId = req.session.currentUser._id;
    const clipId = req.params.id;

    console.log('Hello from unlikeClip 1a: userId', userId);
    console.log('Hello from unlikeClip 1b: clipId', clipId);

    db.User.findById(userId, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('Hello from unlikeClip 2: clipId', foundUser);

        let newClipLikes = foundUser.liked_clips.filter(like => like.toString() !== clipId);
        foundUser.liked_clips = newClipLikes;

        console.log('Hello from unlikeClip 3: foundUserClips', foundUser.liked_clips);

        foundUser.save((err) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Clip.findById(clipId, (err, foundClip) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('Hello from unlikeClip 4: foundClip', foundClip);
    
            let newLikesArr = foundClip.likes.filter(like => like.toString() !== userId);
            foundClip.likes = newLikesArr;

            console.log('Hello from unlikeClip 5: foundClip.likes', foundClip.likes);
    
            foundClip.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });
            });

            return res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundClip
            });
        });
    });
};

module.exports = {
    indexUserClips,
    indexBrowseClips,
    showClip,
    uploadClip,
    editClip,
    deleteClip,
    likeClip,
    unlikeClip
};
