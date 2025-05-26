const mongoose = require('mongoose');

const kinoSchema = new mongoose.Schema({
    title: String,
    code: { type: String, required: true, unique: true },
    file_id: String,
    video_number: { type: Number, default: null },
    views: { type: Number, default: 0 },
    uploaded_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Kino', kinoSchema);