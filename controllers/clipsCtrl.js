// ------------------------- Modules ------------------------- //

const db = require('../models');
const aws = require('aws-sdk');

// ----------------------- Controllers ----------------------- //

const indexUserClips = (req, res) => {
    db.User.findOne({ username: req.params.username }, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });
        
        db.Clip.find({ poster: foundUser._id }, (error, foundClips) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
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

const indexGameClips = (req, res) => {

    db.Clip.find({ game: req.params.game }, (error, foundClips) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        return res.status(200).json({
            status: 200,
            message: 'Success.',
            data: foundClips
        });
    });
};

const indexBrowseClips = async (req, res) => {
    let ApexLegends;
    let CODWarzone;
    let LeagueOfLegends;
    let Valorant;
    let Fortnite;

    await db.Clip.find({ "game": "Apex Legends" }, (error, foundClips) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        ApexLegends = foundClips;

    }).limit(4);

    await db.Clip.find({ "game": "Call of Duty: Warzone" }, (error, foundClips) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        CODWarzone = foundClips;

    }).limit(4);

    await db.Clip.find({ "game": "League of Legends" }, (error, foundClips) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        LeagueOfLegends = foundClips;

    }).limit(4);

    await db.Clip.find({ "game": "Valorant" }, (error, foundClips) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        Valorant = foundClips;

    }).limit(4);

    await db.Clip.find({ "game": "Fortnite" }, (error, foundClips) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        Fortnite = foundClips;

    }).limit(4);

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

    db.Clip.findById(req.params.id, (error, foundClip) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
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
    
    db.User.findById(req.session.currentUser, (error, foundUser) => {
        if (error) return res.status(404).json({
            status: 404,
            message: 'Something went wrong, please try again.'
        });

        const { file } = req;
        const { game, title } = req.body;

        let username = req.session.currentUser.username;
        let currentDate = Date.now();
        let newKey = username + '.' + currentDate;
        let newUrl = "https://s3-us-west-1.amazonaws.com/pro.clips/" + newKey;

        let s3bucket = new aws.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: newKey,
            Body: file.buffer,
            ACL: "public-read"
        };

        let newClip = {
            game: game,
            key: newKey,
            url: newUrl,
            title: title,
            poster: foundUser._id,
            poster_name: username,
        };

        s3bucket.upload(params, (error, data) => {
            if (error) return res.status(500).json({ 
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Clip.create(newClip, (error, createdClip) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });

            foundUser.clips.push(createdClip._id);
            foundUser.save();

            return res.status(200).json({
                status: 200,
                message: 'Successfully added clip to user.',
            });
        });
    });
};

const editClip = (req, res) => {

    db.Clip.findByIdAndUpdate(req.params.id, req.body, (error, foundClip) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.',
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

    db.Clip.findByIdAndDelete(req.params.id, (error, deletedClip) => {

        db.User.findById(req.session.currentUser._id, (error, foundUser) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
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
            
        s3bucket.deleteObject(params, (error, data) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
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

    db.User.findById(userId, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        let foundClipArray = foundUser.liked_clips.filter(clip => clipId == clip._id.toString());

        if (foundClipArray.length > 0) {
            return { message: 'Already liked' }
        };

        foundUser.liked_clips.push(clipId);
        foundUser.save((error) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Clip.findById(clipId, (error, foundClip) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            foundClip.likes.push(userId);

            foundClip.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
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

    db.User.findById(userId, (error, foundUser) => {
        if (error) return res.status(500).json({
            status: 500,
            error,
            message: 'Something went wrong, please try again.'
        });

        let newClipLikes = foundUser.liked_clips.filter(like => like.toString() !== clipId);
        foundUser.liked_clips = newClipLikes;

        foundUser.save((error) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
        });

        db.Clip.findById(clipId, (error, foundClip) => {
            if (error) return res.status(500).json({
                status: 500,
                error,
                message: 'Something went wrong, please try again.'
            });
    
            let newLikesArr = foundClip.likes.filter(like => like.toString() !== userId);
            foundClip.likes = newLikesArr;
    
            foundClip.save((error) => {
                if (error) return res.status(500).json({
                    status: 500,
                    error,
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
    showClip,
    indexUserClips,
    indexGameClips,
    indexBrowseClips,
    editClip,
    uploadClip,
    deleteClip,
    likeClip,
    unlikeClip
};
