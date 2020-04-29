// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexComments = (req, res) => {
    db.Comment.find({})
};

const showComment = (req, res) => {
    console.log('hi')
};

const createComment = (req, res) => {
    console.log('hi');
};

const editComment = (req, res) => {
    console.log('hi');
};

const deleteComment = (req, res) => {
    console.log('hi');
};

module.exports = {
    indexComments,
    showComment,
    createComment,
    editComment,
    deleteComment
};
