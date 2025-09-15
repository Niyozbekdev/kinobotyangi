const mongoose = require('mongoose');
const { Schema } = mongoose;
const VipImageSchema = require('./imageSchema');

const VipPostSchema = new Schema(
    {
        images: {
            type: [VipImageSchema],
            required: true,
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: 'Kamida bitta rasm bo‘lishi kerak'
            }
        },
        created_by: { type: Number, required: true }, // admin ID
        is_active: { type: Boolean, default: true },
        posted_at: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model('VipPost', VipPostSchema); // ✅ model export