const mongoose = require('mongoose');
const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ region: 'us-west-1' });
const mongoDBUriOptions = { Name: '/proclips/mongodb-connection-string', WithDecryption: true };

let MONGODB_URI;

const getMongodbUri = async () => {
    await ssm.getParameter(mongoDBUriOptions, (error, data) => {
        if (error) {
            console.log(error, errorStack);
            return;
        };

        console.log('Hello!!! DATA:', data);

        return MONGODB_URI = data.Parameter.value;
    });
};

getMongodbUri();

const getMongodbUrl = async () => {
    await ssm.getParameter(mongoDBUriOptions, (error, data) => {
        if (error) {
            console.log(error, errorStack);
            return;
        };

        console.log('Hello!!! DATA:', data);

        return data.Parameter.value;
    });
};

const MONGODB_URL = getMongodbUrl();

console.log('Hello MONGODB_URI!!!', MONGODB_URI);
console.log('Hello MONGODB_URL!!!', MONGODB_URL);


const MONGODB_connection = MONGODB_URI || MONGODB_URL || 'mongodb://localhost:27017/pro-clips'


mongoose.connect(MONGODB_connection, {
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
