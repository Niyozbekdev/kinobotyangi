// actions/saveChannelInvite.js
const Channel = require('../../models/Channel');
const AdminState = require('../../models/AdminState');

/**
 * ✅ Admin tomonidan yuborilgan invite linkni qabul qiladi va ilgari yuborilgan -100... ID bilan saqlaydi
 */
const saveChannelInvite = async (ctx) => {
    try {
        const adminId = ctx.from.id;
        const text = ctx.message?.text?.trim();
        if (!text) return;

        const state = await AdminState.findOne({ admin_id: adminId });
        if (!state || state.step !== 'awaiting_channel_invite_link') return;

        // 📩 Invite linkni validatsiya qilamiz
        if (!text.startsWith('https://t.me/+')) {
            return ctx.reply("❗️Iltimos, faqat to‘g‘ri invite link yuboring: https://t.me/+...");
        }

        const chatId = state.temp_link;
        if (!chatId) {
            await AdminState.deleteOne({ admin_id: adminId });
            return ctx.reply("⚠️ Kanal ID yo‘qolgan. Qaytadan boshlang.");
        }

        let title = null;

        try {
            // 📡 Kanal nomini olishga harakat qilamiz
            const chat = await ctx.telegram.getChat(chatId);
            title = chat.title || null;
        } catch (err) {
            console.warn("⚠️ getChat() ishlamadi:", err.message);
            // ❗️ getChat ishlamasa — title bo‘sh qoladi
        }


        // 🔢 Kanal raqamini aniqlaymiz
        const last = await Channel.findOne().sort({ number: -1 });
        const number = last ? last.number + 1 : 1;

        // ✅ Saqlaymiz
        await Channel.create({
            number,
            link: chatId,                // -100... ID
            invite_link: text,             // doimiy invite link
            chat_id: chatId,
            title: title,
            added_by: adminId,
            added_at: new Date()
        });

        await AdminState.deleteOne({ admin_id: adminId });

        return ctx.reply("✅ Kanal ID va invite link bilan muvaffaqiyatli saqlandi.");

    } catch (err) {
        console.error("❌ saveChannelInvite xato:", err.message);
        return ctx.reply("❗️Invite linkni saqlashda xatolik yuz berdi.");
    }
};

module.exports = saveChannelInvite;