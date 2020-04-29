mongoose = require('mongoose');
const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pro-clips';

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('mongoDB connect...'))
    .catch((err) => console.log(err));

module.exports = {
    User: require('./User'),
    Post: require('./Post'),
    Comment: require('./Comment')
};