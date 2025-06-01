/**
 * 📍 Callback: br_addbtn
 * ➕ Maqsad: Admin tugmani "➕ Ha" deb tanlasa, tugma matnini kiritishni so‘rash.
 */

const AdminState = require('../../models/AdminState');

const brAddBtn = async (ctx) => {
    try {
        await AdminState.findOneAndUpdate(
            { admin_id: ctx.from.id },
            {
                step: 'awaiting_button_text',
                prev_step: 'tugma_sorash',
                updated_at: new Date()
            }
        );

        await ctx.editMessageText("✏️ Tugma matnini kiriting:");
    } catch (err) {
        console.error('❌ brAddBtn xatosi:', err.message);
        await ctx.reply("Xatolik: tugma matnini kiritib bo‘lmadi.");
    }
};

module.exports = brAddBtn;