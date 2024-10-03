const mongoose = require('mongoose');
require('dotenv').config();

function connectDB() {
    const mongoUri = process.env.MONGO_URI;
    mongoose.connect(mongoUri);
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('Connected to DB!');
    });
}
module.exports = connectDB;
