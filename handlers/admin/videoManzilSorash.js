// handlers/admin/videoManzilSo‘rash.js
const VideoQabulState = require('../../models/VideoQabulState');
const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

/**
 * 📍 Admin panel: Video qabul qilishni boshlash
 * ➕ Maqsad: Qayerga yuborilsin deb so‘rash
 */
const videoManzilSoraladi = async (ctx) => {
    try {
        const userId = ctx.from.id;
        if (!ADMIN_ID.includes(ctx.from.id)) return;

        await AdminState.deleteOne({ admin_id: userId });

        // Stepni 'manzil_kiritish' ga o‘rnatamiz
        await VideoQabulState.findOneAndUpdate(
            { admin_id: userId },
            { step: 'manzil_kiritish', updated_at: new Date() },
            { upsert: true, new: true }
        );

        await ctx.reply(`❗️Qayerga videolar qabul qilinsin manzilni shu ko'rinishda yuboring.\n\n ▶️ @kanalname \n ▶️-100 dan keyin kanal Idsi\n ▶️ https://t.me/kanal link`)

    } catch (err) {
        console.error("❌ videoManzilSoraladi xatosi:", err.message);
        await ctx.reply("Xatolik: video manzilini so‘rashda xatolik yuz berdi.");
    }
};

module.exports = videoManzilSoraladi;