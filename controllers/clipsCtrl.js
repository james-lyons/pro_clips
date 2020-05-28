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
    db.User.findById(req.session.currentUser._id, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        db.Clip.find({ poster: req.session.currentUser }, (err, foundClips) => {
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
            url: newUrl
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
    console.log('hi');
};

const deleteClip = (req, res) => {
    console.log('hi');
};

module.exports = {
    indexClips,
    indexUserClips,
    showClip,
    uploadClip,
    editClip,
    deleteClip
};
