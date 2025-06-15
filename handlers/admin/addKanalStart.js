// Kanal qo‘shish jarayonini boshlash
const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const addKanalStart = async (ctx) => {
    try {
        if (!ADMIN_ID.includes(ctx.from.id)) return;
        // Admin holatini yangilash
        await AdminState.findOneAndUpdate(
            { admin_id: ctx.from.id },             // Admin ID
            { step: 'awaiting_channel_link' },     // Keyingi qadam
            { upsert: true }                       // Yo‘q bo‘lsa yarat
        );

        // Admindan kanal linkini so‘rash
        ctx.reply(`📥 Kanal yoki guruh malumotini shu tarzda yuboring. \n\n 📢 @mychannel\n 🖇 https://t.me/joinchat/XXXX\n 🆔 -100(kanal yoki guruh IDsi)`);
    } catch (err) {
        console.error("Addkanalstart faylda xato bot", err)
    }
};

module.exports = addKanalStart;