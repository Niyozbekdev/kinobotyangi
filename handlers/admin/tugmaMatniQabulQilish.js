/**
 * 📍 Admin inline tugma uchun matn kiritsa ishlaydi
 * ➕ Maqsad: tugma matnini AdminState ga saqlab, keyin linkni so‘rash
 */

const AdminState = require('../../models/AdminState');

const tugmaMatniniQabulQilish = async (ctx) => {
    try {
        const state = await AdminState.findOne({ admin_id: ctx.from.id });
        if (!state || state.step !== 'awaiting_button_text') return;

        state.temp_title = state.temp_title || ''; // ehtiyot uchun
        state.step = 'awaiting_button_url';
        state.prev_step = 'awaiting_button_text';
        state.updated_at = new Date();
        state.temp_button_text = ctx.message.text; // yangi maydon sifatida ishlatamiz

        await state.save();

        await ctx.reply("🌐 Endi tugma uchun URL manzilini kiriting:");

    } catch (err) {
        console.error("❌ tugmaMatniniQabulQilish xatosi:", err.message);
        await ctx.reply("Xatolik: tugma matnini qabul qilib bo‘lmadi.");
    }
};

module.exports = tugmaMatniniQabulQilish;