// ------------------------- Modules ------------------------- //

const mongoose = require('mongoose');
const db = require('../models');
const clip = require('../middleware/gridFs');
const Grid = require('gridfs-stream');

const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pro-clips';
const conn = mongoose.createConnection(MONGO_URL);

let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('clips');
});

// ----------------------- Controllers ----------------------- //

const indexClips = (req, res) => {
    gfs.files.find().toArray((err, files) => {
        console.log('files', files);
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

// const streamClip = (req, res) => {
//     // console.log(gfs);
//     console.log('HELLO FROM STREAMCLIP 0: files', gfs.files)
    
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         if (err) return res.status(400).json({
//             status: 400,
//             error: err,
//             message: 'Something went wrong, please try again.'
//         });
        
//         const readstream = gfs.createReadStream(file.filename);

//         console.log('HELLO FROM STREAMCLIP 1: FILE', file);
//         // console.log('HELLO FROM STREAMCLIP 2: READSTREAM', readstream);
//         // console.log('HELLO FROM STREAMCLIP 3: PIPE', readstream.pipe(res));
//         let data = readstream.pipe(res);
//         console.log(data);

//         return res.status(200).json({
//             status: 200,
//             message: 'Success',
//         });

//         // return res.status(200).json({
//         //     status: 200,
//         //     message: 'success',
//         //     data: readstream
//         // });

//         // Check if file
//         // if (!file || file.length === 0) {
//         //     return res.status(404).json({
//         //         err: 'No file exists'
//         //     });
//         // }
    
//         // Check if image
//         // if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//         //     // Read output to browser
//         //         const readstream = gfs.createReadStream(file.filename);
//         //         readstream.pipe(res);
//         //     } else {
//         //     res.status(404).json({
//         //         err: 'Not an image'
//         //     });
//         // };
//     });
// };

const uploadClip = (req, res) => {
    console.log('HELLO FROM CLIPS 1: REQ.BODY', req.body);
    console.log('HELLO FROM CLIPS 2: REQ.FILE', req.file, typeof req.file);

    
};

// const createClip = (req, res) => {
//     console.log('HELLO FROM CLIPS 1: REQ.BODY', req.body);
//     console.log('HELLO FROM CLIPS 2: REQ.FILE', req.file, typeof req.file);

//     db.User.findById(req.session.currentUser._id, (err, foundUser) => {
//         if (err) return res.status(500).json({
//             status: 500,
//             error: err,
//             message: 'Something went wrong, please try again.'
//         });

//         console.log('HELLO FROM CLIPS 3: FOUND USER', foundUser);

//         const newClip = {
//             poster: req.session.currentUser._id,
//             title: req.file.filename,
//             clip: req.file
//         };

//         console.log('HELLO FROM CLIPS 4: NEW CLIP', newClip)

//         db.Clip.create(newClip, (err, createdClip) => {
//             if (err) return res.status(500).json({
//                 status: 500,
//                 error: err,
//                 message: 'Something went wrong, please try again.'
//             });

//             console.log('HELLO FROM CLIPS 5: CREATED CLIP', createdClip);

//             foundUser.clips.push(createdClip._id);
//             foundUser.save();
    
//             res.status(200).json({
//                 status: 200,
//                 message: 'recieved file',
//                 data: req.body,
//                 file: req.file
//             });
//         });
//     });
// };

const editClip = (req, res) => {
    console.log('hi');
};

const deleteClip = (req, res) => {
    console.log('hi');
};

module.exports = {
    indexClips,
    showClip,
    // streamClip,
    uploadClip,
    editClip,
    deleteClip
};
