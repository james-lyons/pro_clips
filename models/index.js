const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pro-clips';

// Connecting to MongoDB database

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('mongoDB has successfully connected...'))
    .catch((err) => console.log(err));

module.exports = {
    MONGO_URL,
    User: require('./User'),
    Post: require('./Post'),
    Comment: require('./Comment'),
    Followers: require('./Followers')
};
