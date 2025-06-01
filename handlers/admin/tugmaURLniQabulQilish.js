/**
 * 📍 Admin tugma URL kiritganda ishlaydi
 * ➕ Maqsad: matn + URL asosida xabar preview qilib yuborish
 */

const AdminState = require('../../models/AdminState');

const tugmaURLniQabulQilish = async (ctx) => {
    try {
        const state = await AdminState.findOne({ admin_id: ctx.from.id });
        if (!state || state.step !== 'awaiting_button_url') return;

        const url = ctx.message.text;
        const botInfoText = '🎬 Ko‘proq kinolar uchun → @SizningBotUsername';
        const text = (state.temp_title || '').trim() || botInfoText;
        const file_id = state.temp_file_id;
        const button_text = state.temp_button_text;

        state.step = 'confirm_broadcast';
        state.prev_step = 'awaiting_button_url';
        state.temp_button_url = url;
        state.updated_at = new Date();
        await state.save();

        const markup = {
            reply_markup: {
                inline_keyboard: [[{ text: button_text, url }]]
            },
            caption: text,
            parse_mode: 'HTML'
        };

        if (file_id && ctx.message.photo) {
            await ctx.telegram.sendPhoto(ctx.from.id, file_id, markup);
        } else if (file_id && ctx.message.video) {
            await ctx.telegram.sendVideo(ctx.from.id, file_id, markup);
        } else {
            await ctx.telegram.sendMessage(ctx.from.id, text, {
                parse_mode: 'HTML',
                reply_markup: markup.reply_markup
            });
        }

        await ctx.reply('✅ Yuborilsinmi?', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📤 Ha, yubor!', callback_data: 'br_send' }],
                    [{ text: '❌ Bekor qilish', callback_data: 'br_cancel' }]
                ]
            }
        });

    } catch (err) {
        console.error("❌ tugmaURLniQabulQilish xatosi:", err.message);
        await ctx.reply("Xatolik: tugma uchun linkni saqlab bo‘lmadi.");
    }
};

module.exports = tugmaURLniQabulQilish;