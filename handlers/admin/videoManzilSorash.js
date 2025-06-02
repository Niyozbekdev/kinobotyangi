// handlers/admin/videoManzilSo‘rash.js
const VideoQabulState = require('../../models/VideoQabulState');
const { ADMIN_ID } = require('../../config/admin');

/**
 * 📍 Admin panel: Video qabul qilishni boshlash
 * ➕ Maqsad: Qayerga yuborilsin deb so‘rash
 */
const videoManzilSoraladi = async (ctx) => {
    try {
        const userId = ctx.from.id;
        if (userId !== ADMIN_ID) return;

        // Stepni 'manzil_kiritish' ga o‘rnatamiz
        await VideoQabulState.findOneAndUpdate(
            { admin_id: userId },
            { step: 'manzil_kiritish', updated_at: new Date() },
            { upsert: true }
        );

        await ctx.reply("📥 Qayerga video yuborilsin? (kanal yoki guruh username / ID ni kiriting)");
    } catch (err) {
        console.error("❌ videoManzilSoraladi xatosi:", err.message);
        await ctx.reply("Xatolik: video manzilini so‘rashda xatolik yuz berdi.");
    }
};

module.exports = videoManzilSoraladi;