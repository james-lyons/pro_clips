const mongoose = require('mongoose');
const AWS = require('aws-sdk');
// const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pro-clips';

const ssm = new AWS.SSM({ region: 'us-west-1' });
const mongoDBUriOptions = { Name: '/proclips/mongodb-connection-string', WithDecryption: true }

const mongodbPromise = ssm.getParameter(mongoDBUriOptions).promise();

const MONGODB_URI = mongodbPromise.then((error, data) => {
    if (error) {
        console.log(error, errorStack);
        return null;
    }

    console.log('Hello from getMONGODB_URL', data);

    return data.Parameter.value;
});

console.log('Hello from getMongodbUri', MONGODB_URI)


// const MONGODB_URL = ssm.getParameter(mongoDBUriOptions, (error, data) => {
//     if (error) {
//         console.log(error, errorStack);
//         return null;
//     }

//     console.log('Hello from getMONGODB_URL', data);

//     return data.Parameter.value;
// });

// console.log('Hello from mongoDBURI', MONGODB_URL)

// Connecting to MongoDB database

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => console.log('mongoDB has successfully connected...'))
    .catch((err) => console.log(err));

module.exports = {
    User: require('./User'),
    Clip: require('./Clip'),
    Comment: require('./Comment'),
    Reply: require('./Reply'),
    ReportUser: require('./ReportUser'),
    ReportClip: require('./ReportClip'),
    ReportReply: require('./ReportReply'),
    ReportComment: require('./ReportComment')
};
