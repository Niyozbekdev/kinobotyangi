const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const deleteKinoStart = async (ctx) => {
    try {

        if (ctx.from.id !== ADMIN_ID) return;

        await AdminState.findOneAndUpdate(
            { admin_id: ctx.from.id },
            { step: 'awaiting_delete_code', updated_at: new Date() },
            { upsert: true }
        );

        ctx.reply("🆔 O‘chirmoqchi bo‘lgan kino kodini yuboring:");
    } catch (err) {
        console.error("DeleteKinoStartda fayilda xato", err)
    }
};

module.exports = deleteKinoStart;