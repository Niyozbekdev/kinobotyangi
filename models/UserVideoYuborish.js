// models/UserVideoYuborish.js
const mongoose = require('mongoose');

/**
 * 📍 User video yuborish holati
 * ➕ Maqsad: User video yuborishni belgilab yubordi qayergaligini
 */
const UserVideoYuborish = new mongoose.Schema({
    user_id: { type: Number, required: true },
    step: { type: String, default: null },
    upsert: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoYuborishUser', UserVideoYuborish);