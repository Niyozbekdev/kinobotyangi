const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const addDeleteUser = async (ctx) => {
    try {
        if (!ADMIN_ID.includes(ctx.from.id)) return;

        await AdminState.findOneAndUpdate(
            { admin_id: ctx.from.id },
            { step: 'awaiting_user_id_for_delete' },
            { upsert: true, }
        );

        await ctx.reply('🆔 Iltimos, o‘chirmoqchi bo‘lgan foydalanuvchining user_id sini yuboring:');
    } catch (err) {
        console.error("AddDeleteUser.js faylda xato", err)
    }
};

module.exports = addDeleteUser