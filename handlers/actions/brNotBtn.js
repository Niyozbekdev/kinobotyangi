/**
 * 📍 Callback: br_nobtn
 * ➕ Maqsad: Admin tugmani "❌ Yo‘q" deb tanlasa, previewni tugmasiz ko‘rsatish.
 */

const AdminState = require('../../models/AdminState');

const brNoBtn = async (ctx) => {
    try {
        const state = await AdminState.findOne({ admin_id: ctx.from.id });
        if (!state) return;

        state.step = 'confirm_broadcast';
        state.prev_step = 'tugma_sorash';
        state.updated_at = new Date();
        await state.save();

        const { temp_title, temp_file_id } = state;
        const opts = { caption: temp_title, parse_mode: 'HTML' };

        if (temp_file_id?.startsWith('AgAC')) {
            await ctx.telegram.sendPhoto(ctx.from.id, temp_file_id, opts);
        } else if (temp_file_id) {
            await ctx.telegram.sendVideo(ctx.from.id, temp_file_id, opts);
        } else {
            await ctx.telegram.sendMessage(ctx.from.id, temp_title, { parse_mode: 'HTML' });
        }

        await ctx.telegram.sendMessage(ctx.from.id, '✅ Yuborilsinmi?', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📤 Ha, yubor!', callback_data: 'br_send' }],
                    [{ text: '❌ Bekor qilish', callback_data: 'br_cancel' }]
                ]
            }
        });

        await ctx.answerCbQuery();

    } catch (err) {
        console.error('❌ brNoBtn xatosi:', err.message);
        await ctx.reply("Xatolik: tugmasiz preview yuborilmadi.");
    }
};

module.exports = brNoBtn;