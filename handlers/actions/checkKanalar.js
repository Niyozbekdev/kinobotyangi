const Channel = require('../../models/Channel');
const { ADMIN_ID } = require('../../config/admin');

/**
 * ✅ Foydalanuvchini barcha talab qilingan kanallarga obuna bo‘lganini tekshiradi.
 * 🔒 Agar obuna bo‘lmagan bo‘lsa, kanal(lar)ning tugmalari bilan ogohlantirish yuboriladi.
 * 📎 Private kanallar uchun ID asosida invite_link orqali tugma chiqariladi.
 */
const checkKanalar = async (ctx) => {
    try {
        const userId = ctx.from.id;

        // 🔓 Admin bo‘lsa tekshiruvdan o‘tmaydi
        if (String(userId) === String(ADMIN_ID)) return true;

        const channels = await Channel.find();
        const unsubscribed = [];
        const buttons = [];

        for (const ch of channels) {
            const { link, invite_link } = ch;
            let chatId = null;
            let buttonUrl = invite_link || null;

            // 1️⃣ Agar link @kanal
            if (link?.startsWith('@')) {
                chatId = link;
                buttonUrl = `https://t.me/${link.slice(1)}`;
            }

            // 2️⃣ Agar link https://t.me/kanal
            else if (link?.startsWith('https://t.me/')) {
                chatId = '@' + link.replace('https://t.me/', '').replace('+', '');
                buttonUrl = link;
            }

            // 3️⃣ Agar link -100... ID bo‘lsa (private kanal)
            else if (/^-100\d+$/.test(link)) {
                chatId = link;
                // buttonUrl faqat invite_link mavjud bo‘lsa ishlaydi
                buttonUrl = invite_link || null;
            }

            // 🔘 Tugmani foydalanuvchiga chiqaramiz
            // if (buttonUrl) {
            //     buttons.push([{ text: '📢 Obuna bo‘lish', url: buttonUrl }]);
            // }

            // 🔍 Agar chatId mavjud bo‘lsa, getChatMember orqali tekshir
            if (chatId) {
                try {
                    const member = await ctx.telegram.getChatMember(chatId, userId);
                    if (['left', 'kicked'].includes(member.status)) {
                        unsubscribed.push({ chatId, buttonUrl }); // ❌ obuna bo‘lmagan
                    }
                } catch (err) {
                    console.warn(`⚠️ getChatMember xatosi (${chatId}):`, err.message);
                    unsubscribed.push({ chatId, buttonUrl }); // ⚠️ xato bo‘lsa, obuna emas deb hisoblaymiz
                }
            }
        }

        // ❗️ Obuna bo‘lmaganlar mavjud bo‘lsa — foydalanuvchini to‘xtatamiz
        if (unsubscribed.length > 0) {
            for (const u of unsubscribed) {
                if (u.buttonUrl) {
                    buttons.push([{ text: '📢 Obuna bo‘lish', url: u.buttonUrl }]);
                }
            }
            buttons.push([{ text: '✅ Tekshirish', callback_data: 'check_subscription' }]);

            await ctx.reply(
                "❗️ Botdan foydalanishdan avval quyidagi kanallarga obuna bo‘ling:",
                {
                    reply_markup: {
                        inline_keyboard: buttons
                    }
                }
            );
            return false;
        }

        // ✅ Hammasi joyida — foydalanuvchi botdan foydalanishi mumkin
        if (ctx.callbackQuery?.message) {
            await ctx.editMessageText("✅ Obuna holati tasdiqlandi. Botdan foydalanishingiz mumkin.");
        }

        return true;

    } catch (err) {
        console.error("❌ checkKanalar() xato:", err.message);
        await ctx.reply("❗️Kanallarni tekshirishda xatolik yuz berdi. Keyinroq urinib ko‘ring.");
        return false;
    }
};

module.exports = checkKanalar;