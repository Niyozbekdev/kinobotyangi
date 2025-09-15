// 📁 models/VipAdminState.js
const mongoose = require('mongoose');
const VipImageSchema = require('./imageSchema'); // 🔹 alohida fayldan import qilamiz

const VipAdminStateSchema = new mongoose.Schema(
    {
        admin_id: { type: Number, required: true, unique: true }, // Adminning Telegram ID
        step: { type: String, required: true }, // Faqat vip_post bo‘ladi

        // --- VIP post uchun maxsus maydonlar ---
        vip_post: { type: [VipImageSchema], default: [] },   // Rasmlar ro‘yxati
        last_preview_msg_ids: { type: [Number], default: [] }, // Preview xabar IDlari
        // TTL uchun maydon
        expireAt: {
            type: Date,
            default: () => new Date(Date.now() + 120 * 1000), // hujjat 1 daqiqadan keyin o‘chadi
            index: { expires: 0 } // TTL index
        },

        updated_at: { type: Date, default: Date.now } // Oxirgi yangilanish vaqti
    },
    {
        timestamps: true,// createdAt va updatedAt qo‘shiladi
        minimize: false   // Bo‘sh obyektlarni ham saqlaydi
    }
);

// 🔹 Modelni eksport qilish
module.exports = mongoose.model('VipAdminState', VipAdminStateSchema);
