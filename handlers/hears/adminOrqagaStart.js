const AdminState = require('../../models/AdminState');
const mainKeyboard = require('../../keyboards/mainKeyboard');
const { ADMIN_ID } = require('../../config/admin');

//Bu admin orqaga bosganda ishlatish uchun bu AdminStateni tozalab orqga qaytadi.
const adminOrqaga = async (ctx) => {
    try {
        const admin_id = ctx.from.id;
        if (admin_id !== ADMIN_ID) return;
        await AdminState.deleteOne({ admin_id: admin_id });
        await ctx.reply(
            '🏠 Asosiy menyuga qaytdingiz:', mainKeyboard());
    } catch (err) {
        console.error("Orqaga bulimada admin uchun", err)
    }
}

module.exports = adminOrqaga;
