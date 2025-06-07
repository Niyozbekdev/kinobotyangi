const mongoose = require('mongoose');

// Kanal modeli sxemasi (schema)
const channelSchema = new mongoose.Schema({
    number: { type: Number, default: null }, //Tartib raqam
    link: String, // @username yoki to'liq https://t.me/ link
    invite_link: String,
    chat_id: String,
    title: String,//Faqat private kanalar uchun
    added_by: Number, // Qaysi admin qo‘shgan
    added_at: { type: Date, default: Date.now } // Qachon qo‘shilgan
});

module.exports = mongoose.model('Channel', channelSchema);