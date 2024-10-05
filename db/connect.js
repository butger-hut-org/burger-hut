const mongoose = require('mongoose');
require('dotenv').config();
const logger = require("../middleware/logger");

function connectDB() {
    const mongoUri = process.env.MONGO_URI;
    mongoose.connect(mongoUri);
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        logger.info('Connected to DB!');
    });
}
module.exports = connectDB;
