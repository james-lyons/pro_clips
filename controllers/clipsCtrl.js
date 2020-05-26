// ------------------------- Modules ------------------------- //

const db = require('../models');
const clip = require('../middleware/gridFs');

// ----------------------- Controllers ----------------------- //

const indexClips = (req, res) => {
    db.Clip.find({})
};

const showClip = (req, res) => {
    res.json({ file: req.file });
};

const createClip = (req, res) => {
    console.log('HELLO FROM CLIPS 1: REQ.BODY', req.body);
    console.log('HELLO FROM CLIPS 2: REQ.FILE', req.file, typeof req.file);

    db.User.findById(req.session.currentUser._id, (err, foundUser) => {
        if (err) return res.status(500).json({
            status: 500,
            error: err,
            message: 'Something went wrong, please try again.'
        });

        console.log('HELLO FROM CLIPS 3: FOUND USER', foundUser);

        const newClip = {
            poster: req.session.currentUser._id,
            title: req.file.filename,
            clip: req.file
        };

        console.log('HELLO FROM CLIPS 4: NEW CLIP', newClip)

        db.Clip.create(newClip, (err, createdClip) => {
            if (err) return res.status(500).json({
                status: 500,
                error: err,
                message: 'Something went wrong, please try again.'
            });

            console.log('HELLO FROM CLIPS 5: CREATED CLIP', createdClip);

            foundUser.clips.push(createdClip._id);
            foundUser.save();
    
            res.status(200).json({
                status: 200,
                message: 'recieved file',
                data: req.body,
                file: req.file
            });
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
    showClip,
    createClip,
    editClip,
    deleteClip
};
