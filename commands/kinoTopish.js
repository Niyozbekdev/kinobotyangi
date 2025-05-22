// commands/kinoTopish.js
const { Markup } = require('telegraf');
const Kino = require('../models/Kino'); // Kino modelini import qilish
const { inlineKeyboard } = require('telegraf/markup');
const { callbackQuery } = require('telegraf/filters');

const kinoTopish = async (ctx) => {
    ctx.session = ctx.session || {};
    console.log(`Bu session ${ctx.session.step}`)

    if (ctx.session.step === 'kodni_kiritish') {
        const kod = ctx.message.text.trim();

        const kino = await Kino.findOne({ code: kod, is_deleted: false });

        if (!kino) {
            return ctx.reply('❌ Bunday kodli kino topilmadi.');
        }
        //Bu kino nomini qanday belgilardan iborat bulsa ham yuborishni taminlaydi
        const escapeMarkdownV2 = (text) => {
            return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
        };
        // ishlatish:
        const safeTitle = escapeMarkdownV2(kino.title);

        try {
            await ctx.replyWithVideo(kino.file_id, { // bu yerga haqiqiy file_id kiriting
                caption: `🎬 Video: ${safeTitle}\n 📡 Bizning bot: @Kino24bor_bot`,
                parse_mode: 'HTML', // oddiy format (MarkdownV2 emas!)
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📤 Ulashish', switch_inline_query: `Kod: ${kino.code}` }],
                        [{ text: '❌ O‘chirish', callback_data: 'delete_msg' }]
                    ]
                }
            });

        } catch (err) {
            console.error('Video yuborishda xato', + err);
            ctx.reply('Video yuborishda muoma yuz berdi')
        }
        //Stepni tozalash
        ctx.session.step = null;
        return;
    }

    ctx.reply('Iltimos, menyudan tanlang.');
};


module.exports = kinoTopish;