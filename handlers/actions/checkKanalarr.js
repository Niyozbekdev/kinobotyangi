const Channel = require('../../models/Channel');
const { ADMIN_ID } = require('../../config/admin');

// 🔎 Foydalanuvchining barcha kerakli kanallarga obuna bo‘lganini tekshiradi
async function checkKanalar(ctx) {
    try {
        const userId = ctx.from.id;

        // 🔐 Adminlar uchun obuna tekshiruvi o'tkazilmaydi
        if (String(userId) === String(ADMIN_ID)) {
            return true;
        }

        const channels = await Channel.find();
        let unsubscribed = []; // Obuna bo‘lmagan kanallar
        let buttons = [];

        for (const ch of channels) {
            const link = ch.link.trim();
            const isTelegram = link.startsWith('@') || link.startsWith('https://t.me/') || link.startsWith('-100');

            // Tugmalar uchun havola
            let buttonUrl = link;
            if (link.startsWith('@')) {
                buttonUrl = `https://t.me/${link.slice(1)}`;
            } else if (link.startsWith('https://t.me/')) {
                buttonUrl = link;
            } else if (link.startsWith('-100')) {
                buttonUrl = `https://t.me/c/${link.replace('-100', '')}`;
            }

            buttons.push([{ text: '📢 Obuna bo‘lish', url: buttonUrl }]);

            if (isTelegram) {
                let chatId = link;

                // Agar link to‘g‘ri formatda bo‘lsa — davom etamiz
                try {
                    const res = await ctx.telegram.getChatMember(chatId, userId);

                    if (['left', 'kicked'].includes(res.status)) {
                        unsubscribed.push(link); // Obuna bo‘lmagan
                    }
                } catch (err) {
                    // ❗️ Bot kanalga admin bo‘lmasa — adminni ogohlantiramiz
                    if (err.response && err.response.error_code === 400) {
                        await ctx.telegram.sendMessage(
                            ADMIN_ID,
                            `❗️ Bot ${link} kanal/guruhiga admin bo‘lmagan yoki noto‘g‘ri ID.` +
                            `\n\nXatolik: ${err.description}`
                        );
                    }
                    unsubscribed.push(link); // Foydalanuvchini tekshirib bo‘lmadi
                }
            }
        }

        // 👮‍♂️ Agar foydalanuvchi obuna bo‘lmagan bo‘lsa — xabar yuboriladi
        if (unsubscribed.length > 0) {
            buttons.push([{ text: '✅ Tekshirish', callback_data: 'check_subscription' }]);

            await ctx.reply('❗️Botdan foydalanish uchun quyidagi kanallarga obuna bo‘ling:', {
                reply_markup: {
                    inline_keyboard: buttons
                }
            });

            return false;
        }

        // Agar callback orqali tekshirilgan bo‘lsa — eski xabarni o‘zgartiramiz
        if (ctx.callbackQuery && ctx.callbackQuery.message) {
            await ctx.editMessageText("✅ Kino qidirishingiz mumkin.");
        }

        return true;
    } catch (err) {
        console.error("❌ checkKanalar faylida xatolik:", err.message);
        await ctx.reply("❗️Tekshiruv vaqtida xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.");
        return false;
    }
}

module.exports = checkKanalar;