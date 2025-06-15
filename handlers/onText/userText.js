// commands/kinoTopish.js
const Kino = require('../../models/Kino'); // Kino modelini import qilish
const checkKanalar = require('../actions/checkKanalar');
const User = require('../../models/User');

const userText = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const user = await User.findOne({ user_id: userId });


        if (!user || !user.phone_number) {
            return ctx.reply(`❗️ Botdan toliq foydalanish uchun raqamingizni yuboring.`, {
                reply_markup: {
                    keyboard: [
                        [{ text: "📲 Raqamni yuborish", request_contact: true }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }

        const tekshirKanal = await checkKanalar(ctx);
        if (!tekshirKanal) return;

        // === Asosiy tekshiruv: kinoTopish tugmasi bosilganmi yoki yo‘q ===
        if (!user.step) {
            return ctx.reply("❗️Iltimos, avval *Kino topish* tugmasini bosing yoki /kino komandasini yozing.", {
                parse_mode: 'Markdown'
            });
        }

        if (user && user.step === "waiting_for_codd") {

            // Faqat matnli xabarlar bilan ishlash
            if (!ctx.message || typeof ctx.message.text !== "string") {
                return ctx.reply("xatos"); // Foydalanuvchi tugma bosgan yoki boshqa narsa yuborgan
            }
            //Bu filim kodini oladi foydalanuvchidan
            const kod = ctx.message.text.trim();

            //Bu kodni formatlaydi kod soraganda user tugma bosa xabar jo'natmaydi
            const isValidCode = /^[A-Za-z0-9]{1,}$/.test(kod);
            if (!isValidCode) {
                return ctx.reply(`❎ Kodni yuboring`); // noto‘g‘ri matn, ehtimol tugma bosilgan
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
            kino.views += 1;
            await kino.save();

            const randomBetween = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            const downloads = randomBetween(500, 5000)
            const viewsa = downloads + randomBetween(1000, 9999);
            try {
                await ctx.replyWithVideo(kino.file_id, { // bu yerga haqiqiy file_id kiriting
                    caption: `👤Siz uchun tayyor.\n\n👁Ko'rishlar:${viewsa}\n⬇️Yuklashlar: ${downloads}\n🤖 Bizning bot: @Kino24bor_bot`,
                    parse_mode: 'HTML', // oddiy format (MarkdownV2 emas!)
                    supports_streaming: true,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '📤 Ulashish', switch_inline_query: `Kod: ${kino.code}` }],
                            [{ text: '❌ O‘chirish', callback_data: 'delete_msg' }]
                        ]
                    }
                });

                //Bu foydalanuvchi videoni olgandan so'ng userStateni tozalaydi
                // await User.updateOne({ user_id: userId });
                user.step = null;
                await user.save();

            } catch (err) {
                console.error('Video yuborishda xato', + err);
                ctx.reply('Video yuborishda muoma yuz berdi')
            }
        }

    } catch (err) {
        console.error("Usertextda", err)
    }
};


module.exports = userText;