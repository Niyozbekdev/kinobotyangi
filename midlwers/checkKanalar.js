const Channel = require('../models/Channel');

// Majburiy obuna tekshiruvchi middleware
const checkKanalar = async (ctx, next) => {
    try {
        const userId = ctx.from.id;
        const channels = await Channel.find(); // Barcha kanallarni olish

        let unsubscribed = [];

        for (const channel of channels) {
            let chatId;

            if (channel.link.startsWith('@')) {
                chatId = channel.link;
            } else if (channel.link.includes('t.me/')) {
                const parts = channel.link.split('/');
                const username = parts[parts.length - 1];
                chatId = '@' + username;
            } else {
                continue; // Noto‘g‘ri formatda bo‘lsa o‘tkazib yuboriladi
            }

            try {
                const res = await ctx.telegram.getChatMember(chatId, userId);
                if (!res || ['left', 'kicked'].includes(res.status)) {
                    unsubscribed.push(channel.link);
                }
            } catch (err) {
                unsubscribed.push(channel.link);
            }
        }

        // Agar foydalanuvchi obuna bo‘lmagan bo‘lsa
        if (unsubscribed.length > 0) {
            const list = unsubscribed.map(link => `🔗 ${link}`).join('\n');

            return ctx.reply(`❗️Botdan foydalanish uchun quyidagi kanallarga obuna bo‘ling:\n\n${list}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '✅ Tekshirish', callback_data: 'check_subscription' }]
                    ]
                }
            });
        }

        // ✅ Obuna bo‘lgan foydalanuvchiga xabar yuborish
        await ctx.reply('✅ Siz barcha kanallarga obuna bo‘lgansiz!\n🎬 Endi kinoni qidirsangiz bo‘ladi.');

        // Keyingi bosqichga o‘tish
        await next();

    } catch (err) {
        console.error("❌ Majburiy obunani tekshirayotganda xatolik:", err);
        return ctx.reply("❗️Obuna holatini tekshirishda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.");
    }
};

module.exports = checkKanalar;