// handlers/admin/videoManzilniSaqlash.js
const VideoQabulState = require('../../models/VideoQabulState');
const { ADMIN_ID } = require('../../config/admin');

/**
 * 📍 Admin manzil yuboradi
 * ➕ Maqsad: Kanal yoki guruhni saqlab, tayyor holatga o‘tkazish
 */
const videoManzilSaqlanadi = async (ctx) => {
    try {
        const userId = ctx.from.id;
        if (userId !== ADMIN_ID) return;
        const state = await VideoQabulState.findOne({ admin_id: userId });

        // Faqat manzil kiritish bosqichida ishlaydi
        if (!state || state.step !== 'manzil_kiritish') return;

        const matn = ctx.message.text;
        if (!matn) return ctx.reply("❗️ Manzil bo‘sh bo‘lmasligi kerak.");

        // Saqlaymiz va tayyor holatga o‘tkazamiz
        state.qabul_manzil = matn;
        state.step = 'tayyor';
        state.updated_at = new Date();
        await state.save();

        await ctx.reply("✅ Video manzili saqlandi! Endi foydalanuvchilardan video yuborish mumkin.");
    } catch (err) {
        console.error("❌ videoManzilSaqlanadi xatosi:", err.message);
        await ctx.reply("Xatolik: manzilni saqlab bo‘lmadi.");
    }
};

module.exports = videoManzilSaqlanadi;