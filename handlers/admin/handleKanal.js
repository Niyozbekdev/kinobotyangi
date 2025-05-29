const Channel = require('../../models/Channel');
const AdminState = require('../../models/AdminState');

// Yuborilgan linkni saqlash
const saveChannelLink = async (ctx) => {
    try {
        const state = await AdminState.findOne({ admin_id: ctx.from.id });

        // Agar state mavjud emas yoki noto‘g‘ri bo‘lsa, chiqib ketadi
        if (!state || state.step !== 'awaiting_channel_link') return;

        const link = ctx.text.trim(); // Admin yuborgan link

        // Regex orqali faqat @usernames yoki t.me linklarni qabul qiladi
        if (!/^(@[a-zA-Z0-9_]{5,})|(https:\/\/t\.me\/.+)/.test(link)) {
            return ctx.reply('❗️Noto‘g‘ri format. Faqat @usernames yoki https://t.me/... linklar qabul qilinadi.');
        }

        // Kanalni bazaga saqlash
        await Channel.create({ link, added_by: ctx.from.id });

        // Adminning holatini tozalash
        await AdminState.deleteOne({ admin_id: ctx.from.id });

        // Javob qaytarish
        ctx.reply(`✅ Kanal muvaffaqiyatli qo‘shildi: ${link}`);
    } catch (err) {
        console.error("HandleKanal faylda xato bor", err)
    }
};

module.exports = saveChannelLink;