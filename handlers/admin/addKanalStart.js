// Kanal qo‘shish jarayonini boshlash
const AdminState = require('../../models/AdminState');

const addKanalStart = async (ctx) => {
    try {
        // Admin holatini yangilash
        await AdminState.findOneAndUpdate(
            { admin_id: ctx.from.id },             // Admin ID
            { step: 'awaiting_channel_link' },     // Keyingi qadam
            { upsert: true }                       // Yo‘q bo‘lsa yarat
        );

        // Admindan kanal linkini so‘rash
        ctx.reply('📎Kanal username yoki linkni yuboring (masalan: @mychannel yoki https://t.me/joinchat/XXXX)');
    } catch (err) {
        console.error("Addkanalstart faylda xato bot", err)
    }
};

module.exports = addKanalStart;