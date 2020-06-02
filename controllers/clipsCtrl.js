// ------------------------- Modules ------------------------- //

const db = require('../models');
const aws = require('aws-sdk');

// ----------------------- Controllers ----------------------- //

const indexClips = (req, res) => {
    gfs.files.find().toArray((err, files) => {
        console.log('files', files);
    });
};

const indexUserClips = (req, res) => {
    console.log('HELLO FROM INDEXUSERCLIPS 1: params -', req.params);
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

            console.log('HELLO FROM INDEXUSERCLIPS 2: foundClips -', foundClips);
    
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

    console.log('HELL FROM INDEXBROWSECLIPS 0: clips')

    await db.Clip.find({"game": "Apex Legends"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        ApexLegends = foundClips;
        console.log('HELL FROM INDEXBROWSECLIPS 1: Apex', ApexLegends)

    }).limit(3);

    await db.Clip.find({"game": "C.O.D. Warzone"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        CODWarzone = foundClips;
        console.log('HELL FROM INDEXBROWSECLIPS 3: CODWarzone', CODWarzone)

    }).limit(3);

    await db.Clip.find({"game": "League of Legends"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        LeagueOfLegends = foundClips;
        console.log('HELL FROM INDEXBROWSECLIPS 4: LeagueOfLegends', LeagueOfLegends)

    }).limit(3);

    await db.Clip.find({"game": "Valorant"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        Valorant = foundClips;
        console.log('HELL FROM INDEXBROWSECLIPS 5: clips', Valorant)

    }).limit(3);

    await db.Clip.find({"game": "Fortnite"}, (err, foundClips) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        Fortnite = foundClips;
        console.log('HELL FROM INDEXBROWSECLIPS 6: clips', Fortnite)

    }).limit(3);

    let browsedClips = {
        ApexLegends,
        CODWarzone,
        LeagueOfLegends,
        Valorant,
        Fortnite,
    };

    // console.log('HELL FROM INDEXBROWSECLIPS 7: browsedClips', browsedClips)

    return res.status(200).json({
        status: 200,
        message: 'Success',
        data: browsedClips
    });
};

const showClip = (req, res) => {
    // res.json({ file: req.file });
    console.log('HELLO FROM SHOWCLIP 1:', req.params.id)

    db.Clip.findById(req.params.id, (err, foundClip) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('HELLO FROM SHOWCLIP 2:', foundClip);

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: foundClip
        });
    });
};

const uploadClip = (req, res) => {

    db.User.findById(req.session.currentUser, (err, foundUser) => {

        console.log('HELLO FROM CLIPS 1a: req.session.username -', req.session.currentUser.userName);
        console.log('HELLO FROM CLIPS 1b: req.body.title -', req.body.title);
        console.log('HELLO FROM CLIPS 1c: date.now -', Date.now());
        console.log('HELLO FROM CLIPS 2: req.file -', req.file.fieldname);

        let file = req.file;
        let username = req.session.currentUser.userName;
        let title = req.body.title;
        let currentDate = Date.now();
        let newKey = username + '.' + currentDate;
        let newUrl = "https://s3-us-west-1.amazonaws.com/pro.clips/" + newKey;
        
        console.log('HELLO FROM CLIPS 3a: newkey -', newKey);
        console.log('HELLO FROM CLIPS 3b: newUrl -', newUrl);

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

        console.log('HELLO FROM CLIPS 4: s3bucket -', s3bucket.config.credentials);
        console.log('HELLO FROM CLIPS 5: params -', params);

        s3bucket.upload(params, (err, data) => {
            if (err) return res.status(500).json({ 
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('HELLO FROM CLIPS 6: data -', data);
        });

        let newClip = {
            poster: foundUser._id,
            title: title,
            key: newKey,
            url: newUrl,
            game: req.body.game
        };

        console.log('HELLO FROM CLIPS 7: newClip -', newClip);

        db.Clip.create(newClip, (err, createdClip) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            foundUser.clips.push(createdClip._id);
            foundUser.save();
            console.log('HELLO FROM CLIPS 8: createdClip -', createdClip);
        })

        return res.status(200).json({
            status: 200,
            message: 'Successfully added clip to user.',
        });
    });
};

const editClip = (req, res) => {
    console.log('HELLO FROM EDIT CLIP 1a', req.body);
    console.log('HELLO FROM EDIT CLIP 1b', req.params);

    db.Clip.findByIdAndUpdate(req.params.id, req.body, (error, foundClip) => {
        if (error) return res.status(500).json({
            status: 500,
            message: 'Something went wrong, please try again.',
            error
        });

        console.log('HELLO FROM EDIT CLIP 2', foundClip);
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
    console.log('HELLO FROM DELETE CLIP 1');

    db.Clip.findByIdAndDelete(req.params.id, (err, deletedClip) => {

        console.log('HELLO FROM DELETE CLIP 2: deleteclip - ', deletedClip);

        db.User.findById(req.session.currentUser._id, (err, foundUser) => {
            const newClipList = foundUser.clips.filter(clip => clip.toString() !== req.params.id);
            foundUser.clips = newClipList;
            foundUser.save((err) => {
                if (err) return res.status(500).json({
                    status: 500,
                    error: err,
                    message: 'Something went wrong, please try again.'
                });
            });
        });

        let s3bucket = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });

        console.log('HELLO FROM DELETE CLIP 3: s3bucket - ', s3bucket);
      
        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: deletedClip.key
        };
        
        console.log('HELLO FROM DELETE CLIP 4: params - ', params);
    
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

module.exports = {
    indexClips,
    indexUserClips,
    indexBrowseClips,
    showClip,
    uploadClip,
    editClip,
    deleteClip
};
