const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');

aws.config.update({
    secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
    accessKeyId: process.env.AWS_BUCKET_NAME,
    region: process.env.REGION
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now()); //use Date.now() for unique file keys
        }
    })
});

// const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pro-clips';
// const conn = mongoose.createConnection(MONGO_URL);

// Connecting MongoDB to GridFS
// let gfs;
// conn.once('open', () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('clips');
// });

// const storage = new GridFsStorage({
//     url: MONGO_URL,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if (err) {
//                     return reject(err);
//                 };
//                 const filename = buf.toString('hex') + path.extname(file.originalname);
//                 const fileInfo = {
//                     filename: filename,
//                     bucketName: 'clips'
//                 };
//                 resolve(fileInfo);
//             });
//         });
//     }
// });
// const clip = multer({ storage });

module.exports = upload;
