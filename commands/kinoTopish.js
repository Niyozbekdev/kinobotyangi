// commands/kinoTopish.js
const { Markup } = require('telegraf');
const Kino = require('../models/Kino'); // Kino modelini import qilish
const { inlineKeyboard } = require('telegraf/markup');
const { callbackQuery } = require('telegraf/filters');
const User = require('../models/User');

const kinoTopish = async (ctx) => {

    const userId = ctx.from.id;
    const user = await User.findOne({ user_id: userId })

    if (user && user.step === "waiting_for_codd") {

        // Faqat matnli xabarlar bilan ishlash
        if (!ctx.message || typeof ctx.message.text !== "string") {
            return; // Foydalanuvchi tugma bosgan yoki boshqa narsa yuborgan
        }
        //Bu filim kodini oladi foydalanuvchidan
        const kod = ctx.message.text.trim();

        //Bu kodni formatlaydi kod soraganda user tugma bosa xabar jo'natmaydi
        const isValidCode = /^[A-Za-z0-9]{1,}$/.test(kod);
        if (!isValidCode) {
            return; // noto‘g‘ri matn, ehtimol tugma bosilgan
        }

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

            //Bu foydalanuvchi videoni olgandan so'ng userStateni tozalaydi
            await User.deleteOne({ user_id: userId });

        } catch (err) {
            console.error('Video yuborishda xato', + err);
            ctx.reply('Video yuborishda muoma yuz berdi')
        }
    }
};


module.exports = kinoTopish;