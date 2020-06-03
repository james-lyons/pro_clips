// ------------------------- Modules ------------------------- //

const db = require('../models');

// ----------------------- Controllers ----------------------- //

const indexReplies = (req, res) => {
    db.Reply.find({})
};

const showReply = (req, res) => {
    console.log('hi')
};

const createReply = (req, res) => {
    console.log('hi');
};

const editReply = (req, res) => {
    console.log('hi');
};

const deleteReply = (req, res) => {
    console.log('hi');
};

module.exports = {
    indexReplies,
    showReply,
    createReply,
    editReply,
    deleteReply
};
