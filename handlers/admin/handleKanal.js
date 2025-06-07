const Channel = require('../../models/Channel');
const AdminState = require('../../models/AdminState');

/**
 * ✅ Admin tomonidan yuborilgan kanal/guruh/linkni qabul qiladi va bazaga saqlaydi.
 * 🔒 Telegram linklar uchun: bot kanalga adminmi — tekshiradi.
 * 🔐 Agar chatId bo‘lsa: getChat orqali tekshiradi.
 * 🔗 Invite link (https://t.me/+) bo‘lsa: faqat saqlanadi.
 * 🌐 Instagram, YouTube va boshqa linklar: faqat saqlanadi.
 */
const saveChannelLink = async (ctx) => {
    try {
        const adminId = ctx.from.id;
        const text = ctx.message?.text?.trim();

        // 📌 Adminning holatini tekshiramiz — noto‘g‘ri bosqichda to‘xtatiladi
        const state = await AdminState.findOne({ admin_id: adminId });
        if (!state || state.step !== 'awaiting_channel_link') return;

        // ❗️ Matn yo‘q bo‘lsa xabar beriladi
        if (!text) return ctx.reply("❗️Iltimos, kanal yoki havolani yuboring.");

        const link = text;

        // 🔁 Takroriy saqlangan linklarni tekshiramiz
        const exists = await Channel.findOne({ link }) || await Channel.findOne({ invite_link: link });
        if (exists) {
            await AdminState.deleteOne({ admin_id: adminId });
            return ctx.reply("❗️Bu link allaqachon qo‘shilgan.");
        }

        // 🔢 Avtomatik tartib raqamini aniqlaymiz
        const last = await Channel.findOne().sort({ number: -1 });
        const number = last ? last.number + 1 : 1;

        // ✅ Toifalarga ajratamiz
        const isInviteLink = link.startsWith('https://t.me/+');               // private kanal
        const isUsername = link.startsWith('@');                              // @kanal
        const isFullLink = link.startsWith('https://t.me/');                  // t.me/kanal
        const isChatId = /^-100\d+$/.test(link);                              // chat ID
        const isTelegram = isInviteLink || isUsername || isFullLink || isChatId;
        //const isOtherPlatform = /instagram\.com|youtube\.com|youtu\.be/.test(link);

        // 1️⃣ Private Telegram kanal — invite link
        if (isInviteLink) {
            await AdminState.deleteOne({ admin_id: adminId });
            return ctx.reply("ℹ️ Bu Invite link (private kanal) buni qushish uchun kanal idsin yuboring -100...");
        }

        // 2️⃣ Kanal ID (-100...) — invite linkni keyin so‘raymiz
        if (isChatId) {
            state.step = 'awaiting_channel_invite_link';
            state.temp_link = link;
            await state.save();

            return ctx.reply("ℹ️ Bu -100... ID formatdagi kanal. Iltimos, doimiy invite linkini ham yuboring (https://t.me/+...).");
        }

        // 3️⃣ @kanal yoki https://t.me/kanal — Telegram public kanal
        if (isUsername || isFullLink) {
            let chatId = isUsername ? link : '@' + link.replace('https://t.me/', '').replace('+', '');
            const inviteLink = isUsername ? `https://t.me/${link.slice(1)}` : link;

            try {
                // 📡 Telegram API orqali kanalni tekshiramiz
                const chat = await ctx.telegram.getChat(chatId);
                const title = chat.title;
                const realId = chat.id;

                await Channel.create({
                    number,
                    link: chatId,
                    invite_link: inviteLink,
                    chat_id: realId,
                    title,
                    added_by: adminId,
                    added_at: new Date()
                });

                await AdminState.deleteOne({ admin_id: adminId });
                return ctx.reply(`✅ Kanal qo‘shildi: ${title}\n🔗 ${link}`);
            } catch (err) {
                console.warn("⚠️ getChat xatosi:", err.message);
                await AdminState.deleteOne({ admin_id: adminId });
                return ctx.reply("❗️Kanal topilmadi yoki bot admin emas.");
            }
        }

        // 4️⃣ Boshqa platformalar (Instagram, YouTube, ...)
        if (!isTelegram) {
            await Channel.create({
                number,
                link,
                invite_link: null,
                chat_id: null,
                title: null,
                added_by: adminId,
                added_at: new Date()
            });

            await AdminState.deleteOne({ admin_id: adminId });
            return ctx.reply(`✅ Link saqlandi (tekshirilmaydi):\n${link}`);
        }

    } catch (err) {
        console.error("❌ saveChannelLink xatolik:", err.message);
        return ctx.reply("❗️Linkni saqlashda xatolik yuz berdi.");
    }
};

module.exports = saveChannelLink;