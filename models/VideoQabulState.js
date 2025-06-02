// models/VideoQabulState.js
const mongoose = require('mongoose');

/**
 * 📍 Video Qabul qilish holati
 * ➕ Maqsad: Admin qayerga video yuborishni belgilaydi
 */
const videoQabulSchema = new mongoose.Schema({
    admin_id: { type: Number, required: true },          // Admin Telegram ID
    step: { type: String, default: null },
    upsert: { type: Boolean, default: false },              // Bosqich: manzil_kiritish, tayyor, ...
    qabul_manzil: { type: String, default: null },       // Kanal yoki guruh ID (username yoki -100...)
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoQabulState', videoQabulSchema);