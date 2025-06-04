// 📍 Video saqlash manzilini ko‘rsatish va pastiga o‘chirish tugmasi chiqarish

const VideoQabulState = require('../../models/VideoQabulState');
const { ADMIN_ID } = require('../../config/admin');

const showVideoManzil = async (ctx) => {
    try {
        const userId = ctx.from.id;
        if (userId !== ADMIN_ID) return;
        const state = await VideoQabulState.findOne({ step: 'manzil_kiritish' });

        if (!state || !state.qabul_manzil) {
            return await ctx.reply("❗️Hozircha hech qanday manzil belgilanmagan.");
        }

        // 🖼 Manzil va tugma chiqarish
        await ctx.reply(`📍 Saqlanayotgan manzil:\n\n<code>${state.qabul_manzil}\n ${state.link}</code>`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🗑 Manzilni o‘chirish", callback_data: "ochir_video_manzil" }]
                ]
            }
        });
    } catch (err) {
        console.error("❌ showVideoManzil xatosi:", err.message);
        await ctx.reply("Xatolik: manzilni ko‘rsatib bo‘lmadi.");
    }
};

module.exports = showVideoManzil;