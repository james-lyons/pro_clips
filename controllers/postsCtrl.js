// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexPosts = (req, res) => {
    db.Post.find({})
};

const showPost = (req, res) => {
    console.log('hi')
};

const createPost = (req, res) => {
    console.log('hi');
};

const editPost = (req, res) => {
    console.log('hi');
};

const deletePost = (req, res) => {
    console.log('hi');
};

module.exports = {
    indexPosts,
    showPost,
    createPost,
    editPost,
    deletePost
};
