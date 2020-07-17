const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/pro-clips'

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then()
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
