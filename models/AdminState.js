const mongoose = require('mongoose');

const AdminStateSchema = new mongoose.Schema({
    admin_id: { type: Number, required: true, unique: true },
    step: { type: String, required: true },
    prev_step: String,
    updated_at: { type: Date, default: Date.now },
    temp_file_id: { type: String, default: null },
    temp_title: { type: String, default: null },
    upsert: { type: Boolean, default: false },
});

module.exports = mongoose.model('AdminState', AdminStateSchema);