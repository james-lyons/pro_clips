const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');

const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pro-clips';
const conn = mongoose.createConnection(MONGO_URL);

// Connecting MongoDB to GridFS
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('clips');
});

const storage = new GridFsStorage({
    url: MONGO_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                };
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'clips'
                };
                resolve(fileInfo);
            });
        });
    }
});
const clip = multer({ storage });

module.exports = clip;
