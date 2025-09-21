// commands/kinoTopish.js

const Kino = require('../../models/Kino');          // 🎬 Kino modelini import qilish
const checkKanalar = require('../actions/checkKanalar');
const User = require('../../models/User');          // 👥 User modeli
const vipKanal = require('../../handlers/hears/vipKanal'); // VIP kanal funksiyasi

/**
 * User text handler
 * - User bazada saqlanadi yoki yangilanadi
 * - VIP kanal istisnosi
 * - Kino kodini tekshirish va yuborish
 */
const userText = async (ctx) => {
    try {
        const userId = ctx.from.id;

        // 🔄 Userni bazaga saqlash yoki yangilash
        await User.findOneAndUpdate(
            { user_id: userId }, // qaysi userni yangilash
            {
                user_id: userId,
                username: ctx.from.username || "",
                first_name: ctx.from.first_name || "",
                last_name: ctx.from.last_name || "",
                last_active_at: new Date() // ✅ oxirgi aktiv vaqt
            },
            { upsert: true, new: true } // mavjud bo‘lmasa yaratiladi
        );

        const user = await User.findOne({ user_id: userId });
        if (!user) {
            return ctx.reply("❌ Siz bazada yo‘qsiz, xizmat ko‘rsatilmaydi");
        }

        // === VIP KANAL uchun istisno ===
        if (ctx.message && ctx.message.text === "👑 VIP KANALGA QOSHILISH 👑") {
            return vipKanal(ctx);
        }

        // 🔐 Kanallar tekshiruvi
        const tekshirKanal = await checkKanalar(ctx);
        if (!tekshirKanal) return;

        // === Asosiy tekshiruv: user step bor yoki yo‘q ===
        if (!user.step) {
            return ctx.reply(
                "❗️Iltimos, avval *Kino topish* tugmasini bosing yoki /kino komandasini yozing.",
                { parse_mode: "Markdown" }
            );
        }

        // === Agar user kino kodi yuborayotgan bo‘lsa ===
        if (user.step === "waiting_for_codd") {
            // ❗️Faqat matnli xabarlarni qabul qilish
            if (!ctx.message || typeof ctx.message.text !== "string") {
                return ctx.reply("❎ Kodni yuboring (tugma emas)");
            }

            const kod = ctx.message.text.trim();

            // 🔢 Kodni tekshirish (faqat harf/raqam)
            const isValidCode = /^[A-Za-z0-9]{1,}$/.test(kod);
            if (!isValidCode) {
                return ctx.reply("❎ Kodni to‘g‘ri yuboring!");
            }

            // 🔎 Kino bazadan topiladi
            const kino = await Kino.findOne({ code: kod, is_deleted: false });
            if (!kino) {
                return ctx.reply("❌ Bunday kodli kino topilmadi.");
            }

            // 👁 Ko‘rishlar sonini oshirish
            kino.views += 1;
            await kino.save();

            try {
                // 🎥 Kino yuborish
                await ctx.replyWithVideo(kino.file_id, {
                    caption: `
👤 Siz uchun tayyor.
👁 Ko‘rishlar: ${kino.views}
🤖 Bizning bot: @KinoManyaUz_bot
                    `,
                    parse_mode: "HTML",
                    protect_content: true,
                    supports_streaming: true,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📤 Ulashish", switch_inline_query: `Kod: ${kino.code}` }],
                            [{ text: "❌ O‘chirish", callback_data: "delete_msg" }]
                        ]
                    }
                });

                // ✅ User step reset qilinadi
                user.step = null;
                await user.save();

            } catch (err) {
                console.error("❌ Video yuborishda xato:", err);
                ctx.reply("⚠️ Video yuborishda muammo yuz berdi.");
            }
        }
    } catch (err) {
        console.error("❌ userText ichida xato:", err);
    }
};

module.exports = userText;