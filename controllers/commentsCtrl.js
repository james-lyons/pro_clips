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

const indexResponses = (req, res) => {
    db.Response.find({})
};

const showResponse = (req, res) => {
    console.log('hi')
};

const createResponse = (req, res) => {
    console.log('hi');
};

const editResponse = (req, res) => {
    console.log('hi');
};

const deleteResponse = (req, res) => {
    console.log('hi');
};

module.exports = {
    indexComments,
    showComment,
    createComment,
    editComment,
    deleteComment,
    indexResponses,
    showResponse,
    createResponse,
    editResponse,
    deleteResponse
};
