/**
 * 📍 Admin tomonidan xabar yuborilganda ishga tushadi.
 * ➕ Maqsad: Yuborilgan matn/rasm/videoni vaqtincha saqlash va tugma kerakmi deb so‘rash.
 */

const AdminState = require('../../models/AdminState');

const xabarniQabulQilish = async (ctx) => {
    try {
        const admin_id = ctx.from.id;
        const state = await AdminState.findOne({ admin_id });
        if (!state || state.step !== 'xabar_kutilmoqda') return;

        const matn = ctx.message.text || ctx.message.caption || '';

        //Admin yuborgan messsjni qandayligini bilish uchun bu
        //const faylTuri = ctx.message.photo ? 'photo' : ctx.message.video ? 'video' : 'text';
        //console.log("Admin xabar yubotgan fayl turi", faylTuri)
        const faylId = ctx.message.photo
            ? ctx.message.photo[ctx.message.photo.length - 1].file_id
            : ctx.message.video?.file_id || null;

        // Xabar ma’lumotlarini AdminState ga yozamiz
        state.step = 'tugma_sorash';
        state.temp_title = matn;
        state.temp_file_id = faylId;
        state.prev_step = 'xabar_kutilmoqda';
        state.updated_at = new Date();
        state.upsert = false;
        await state.save();

        // Inline tugma kerakmi deb so‘raymiz
        await ctx.reply('🔘Tugma qo‘shmoqchimisiz?', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Ha', callback_data: 'br_addbtn' }],
                    [{ text: '❌ Yo‘q', callback_data: 'br_nobtn' }]
                ]
            }
        });

    } catch (err) {
        console.error("❌ xabarniQabulQilish xatosi:", err.message);
        await ctx.reply("Xatolik: yuborilgan xabarni saqlab bo‘lmadi.");
    }
};

module.exports = xabarniQabulQilish;