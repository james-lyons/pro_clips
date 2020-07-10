const mongoose = require('mongoose');
const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ region: 'us-west-1' });
const options = { Name: '/proclips/mongodb-connection-string', WithDecryption: true };

let MONGODB_URI;
let MONGODB_STRING;

const getMongodbUri = async () => {
    await ssm.getParameter(options, (error, data) => {
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
    await ssm.getParameter(options, (error, data) => {
        if (error) {
            console.log(error, errorStack);
            return;
        };

        console.log('Hello!!! DATA:', data);

        return data.Parameter.value;
    });
    return data.Parameter.value;
};

const MONGODB_URL = getMongodbUrl();

const getMongodbString = async () => {
    try {
        let connectionString = await ssm.getParameter(options, (error, data) => {
            if (error) {
                console.log(error, errorStack);
                return;
            };

            console.log('Hello from getMongodbString: data', data);
            return;
        });

        console.log('Hello from connectionString', connectionString);
        return connectionString.Parameter.value;

    } catch (error) {
        console.log(error);
    };
};

const MONGODB_CONNECTION_STRING = getMongodbString();

ssm.getParameter(options, (error, data) => {
    if (error) {
        console.log(error, errorStack);
        return;
    };

    console.log('Hello!!! Data', data);
    return MONGODB_STRING = data.Parameter.value;
});

console.log('Hello MONGODB_URI!!!', MONGODB_URI);
console.log('Hello MONGODB_URL!!!', MONGODB_URL);
console.log('Hello MONGODB_STRING!!!', MONGODB_STRING);
console.log('Hello MONGODB_CONNECTION_STRING!!!', MONGODB_CONNECTION_STRING);


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
