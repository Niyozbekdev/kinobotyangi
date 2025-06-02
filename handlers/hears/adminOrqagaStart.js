const AdminState = require('../../models/AdminState');
const mainKeyboard = require('../../keyboards/mainKeyboard');
//const { ADMIN_ID } = require('../../config/admin');

//Bu admin orqaga bosganda ishlatish uchun bu AdminStateni tozalab orqga qaytadi.
const adminOrqaga = async (ctx) => {
    try {
        const userId = ctx.from.id;
        await AdminState.deleteOne({ admin_id: userId });
        await ctx.reply(
            '🏠 Asosiy menyuga qaytdingiz:', mainKeyboard());
    } catch (err) {
        console.error("Orqaga bulimada admin uchun", err)
    }
}

module.exports = adminOrqaga;
