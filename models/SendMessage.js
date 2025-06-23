const mongoose = require('mongoose');

const sentMessageSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    message_id: { type: Number, required: true },
    sent_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SentMessage', sentMessageSchema);