const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/kino_bot', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB ulandi');
    } catch (err) {
        console.error('❌ MongoDB ulanishda xatolik:', err);
    }
}

module.exports = connectDB;