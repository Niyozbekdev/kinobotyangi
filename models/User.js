const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    username: String,
    first_name: String,
    status: { type: String, default: 'active' },
    phone_number: String,
    referrer_id: Number,
    is_admin: { type: Boolean, default: false },
    step: { type: String, required: true },
    prev_step: String,
    is_blocked: { type: Boolean, default: false },
    join: { type: Date, default: Date.now },
    last_active_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);