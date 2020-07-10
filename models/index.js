const mongoose = require('mongoose');
const AWS = require('aws-sdk');
// const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pro-clips';

const ssm = new AWS.SSM({ region: 'us-west-1' });
const mongoDBUriOptions = { Name: '/proclips/mongodb-connection-string', WithDecryption: true }
let MONGODB_URL;

ssm.getParameter(mongoDBUriOptions, (error, data) => {
    if (error) return console.log(error, errorStack);

    return MONGODB_URL = data.Parameter.value;
});

console.log('Hello from mongoDBURI', MONGODB_URL)

// Connecting to MongoDB database

mongoose.connect(MONGODB_URL, {
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
