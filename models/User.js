const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    username: String,
    first_name: String,
    status: { type: String, default: 'active' },
    phone_number: { type: String, default: null },
    referrer_id: Number,
    is_admin: { type: Boolean, default: false },
    user_number: { type: Number, default: null },
    joined_date: { type: String },
    step: { type: String, required: null },
    step: String,
    prev_step: String,
    is_blocked: { type: Boolean, default: false },
    join: { type: Date, default: Date.now },
    last_active_at: { type: String }
});

module.exports = mongoose.model('User', userSchema);