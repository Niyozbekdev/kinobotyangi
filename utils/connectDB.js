const mongoose = require('mongoose');
require('dotenv').config();
const { DB_URI } = require('../config/admin');

async function connectDB() {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`✅ MongoDB ulandi | PID ${process.pid}`);
    } catch (err) {
        console.error('❌ MongoDB ulanishda xatolik:', err);
        process.exit(1);
    }
}

module.exports = connectDB;