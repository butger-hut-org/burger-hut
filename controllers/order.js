const {StatusCodes} = require('http-status-codes');

const orderCreate = async (req, res) => {return res.status(StatusCodes.CREATED).json({});}
const orderDelete = async (req, res) => {return res.status(StatusCodes.CREATED).json({});}
const orderList = async (req, res) => {return res.status(StatusCodes.CREATED).json({});}

module.exports = {
    orderCreate,
    orderDelete,
    orderList
};