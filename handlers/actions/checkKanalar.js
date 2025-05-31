const Channel = require('../../models/Channel');
const { ADMIN_ID } = require('../../config/admin');

// Foydalanuvchini barcha Telegram kanallariga obuna bo‘lganini tekshiradi
async function checkKanalar(ctx) {
    try {
        const userId = ctx.from.id;
        // 🔐 Adminlar uchun tekshiruvdan chiqaramiz
        if (userId === ADMIN_ID) {
            return true; // admin bo‘lsa ruxsat beramiz
        }

        const channels = await Channel.find(); // Barcha kanallarni bazadan olish
        let unsubscribed = []; // Obuna bo‘lmagan kanallar ro‘yxati
        let buttons = []

        for (const ch of channels) {
            const link = ch.link.trim();
            const isTelegram = link.startsWith('@') || link.startsWith('https://t.me/');

            // Tugma linki
            let buttonUrl = link;
            if (link.startsWith('@')) {
                buttonUrl = `https://t.me/${link.slice(1)}`;
            }

            buttons.push([{ text: '📢 Obuna bo‘lish', url: buttonUrl }])

            if (isTelegram) {
                let chatId = link;
                if (link.startsWith('https://t.me/')) {
                    chatId = '@' + link.replace('https://t.me/', '');
                }

                try {
                    const res = await ctx.telegram.getChatMember(chatId, userId);
                    if (['left', 'kicked'].includes(res.status)) {
                        unsubscribed.push(link);
                    }
                } catch (err) {
                    unsubscribed.push(link);
                }
            }

            // Boshqa linklar tekshirilmaydi, lekin chiqariladi
        }

        // Agar obuna bo‘lmagan kanal bo‘lsa, foydalanuvchiga xabar yuboriladi
        if (unsubscribed.length > 0) {

            buttons.push([{ text: '✅ Tekshirish', callback_data: 'check_subscription' }]);

            await ctx.reply(
                '❗️ Botdan foydalanish uchun quyidagi kanallarga obuna bo‘ling:',
                {
                    reply_markup: {
                        inline_keyboard: buttons
                    }
                }
            );
            return false; // Botdan foydalanishga ruxsat berilmaydi
        }

        // Agar tekshiruv callback orqali kelgan bo‘lsa - eski xabarni o‘zgartiramiz
        if (ctx.callbackQuery && ctx.callbackQuery.message) {
            await ctx.editMessageText("✅ Kino qidirishingiz mumkin.");
        }

        return true; // Hammasi joyida bo‘lsa davom ettiriladi
    } catch (err) {
        ctx.reply("Biroz kutib turing")
        console.error("ChechKanalar faylda xato bor", err)
    }

}

module.exports = checkKanalar;