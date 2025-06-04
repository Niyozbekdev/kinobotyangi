const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const addKinoStart = async (ctx) => {
    try {

        if (ctx.from.id !== ADMIN_ID) return;

        await AdminState.findOneAndUpdate(
            { admin_id: ctx.from.id },
            { step: "waiting_for_video", updated_at: new Date() },
            { upsert: true }
        );

        await ctx.reply("🎬 Yuklamoqchi bulgan videoni yuboring", {
            parse_mode: "HTML"
        });


    } catch (error) {
        console.error('AdminStatni saqlashda xato', error);
        return ctx.reply("Ichki xatolik yuz berdi")
    }

}

module.exports = addKinoStart;        
