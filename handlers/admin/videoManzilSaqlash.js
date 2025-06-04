// handlers/admin/videoManzilniSaqlash.js
const VideoQabulState = require('../../models/VideoQabulState');
const { ADMIN_ID } = require('../../config/admin');

/**
 * 📍 Admin manzil yuboradi
 * ➕ Maqsad: Kanal yoki guruhni saqlab, tayyor holatga o‘tkazish
 */


const videoManzilSaqlanadi = async (ctx) => {
    try {
        const admin_id = ctx.from.id;
        if (admin_id !== ADMIN_ID) return;
        let text = ctx.message?.text?.trim();

        if (!text) {
            return await ctx.reply("❗️Manzil yuborilmadi.");
        }

        // 1. Agar link bo‘lsa uni tozalaymiz va @username formatga o'tkazamiz
        if (text.startsWith('https://t.me/') || text.startsWith('t.me/')) {
            const username = text.split('/').pop().replace('@', '');
            text = '@' + username;
        }

        // 2. Format aniqlash
        const isUsername = /^@[a-zA-Z0-9_]{5,}$/.test(text);
        const isChatId = /^-100\d{9,}$/.test(text);

        if (!isUsername && !isChatId) {
            return await ctx.reply(`❗️Iltimos shu formatda yuboring kanal yoki guruh malumotini.\n\n ▶️ @kanalname \n ▶️-100 dan keyin kanal Idsi\n ▶️ https://t.me/kanal link \n Yuboring shunda qabul qilaman.`);
        }

        // 3. getChat bilan tekshirish (har doim stringda yuboramiz)
        try {
            const chat = await ctx.telegram.getChat(text);
            const chatId = String(chat.id);
            const chatTitle = chat.title || 'Noma’lum';

            const member = await ctx.telegram.getChatMember(chatId, ctx.botInfo.id);
            const isAdmin = ['administrator', 'creator'].includes(member.status);

            if (!isAdmin) {
                return await ctx.reply("❗️Bot kanal/guruhda admin emas. Iltimos, uni admin qiling.");
            }

            await VideoQabulState.deleteMany({});

            const newRecord = new VideoQabulState({
                admin_id,
                step: 'tayyor',
                qabul_manzil: chatId,
                link: text,
                created_at: new Date()
            });

            await newRecord.save();

            return await ctx.reply(`✅ Saqlandi:\n\n📌 <b>${chatTitle}</b>\n🆔 <code>${chatId}</code>\n🔗 ${text}`, {
                parse_mode: 'HTML'
            });
        } catch (err) {
            console.error("❌ getChat xatosi:", err.message);
            return await ctx.reply("❗️Kanal yoki guruh topilmadi. Bot adminligini va manzilni tekshiring.");
        }

    } catch (err) {
        console.error("❌ videoManzilSaqlash umumiy xato:", err.message);
        return await ctx.reply("❗️Xatolik: video manzilni saqlab bo‘lmadi.");
    }
};

module.exports = videoManzilSaqlanadi;