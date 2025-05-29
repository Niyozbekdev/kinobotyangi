const mongoose = require('mongoose');

// Kanal modeli sxemasi (schema)
const channelSchema = new mongoose.Schema({
    link: String, // @username yoki to'liq https://t.me/ link
    added_by: Number, // Qaysi admin qo‘shgan
    added_at: { type: Date, default: Date.now } // Qachon qo‘shilgan
});

module.exports = mongoose.model('Channel', channelSchema);