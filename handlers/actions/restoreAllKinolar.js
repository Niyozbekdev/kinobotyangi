// handlers/actions/restoreAllKinolar.js
const Kino = require("../../models/Kino");

/**
 * ✅ Barcha kinolarni tiklash (is_deleted = false)
 */
module.exports = async function restoreAllKinolar(ctx) {
    try {
        await Kino.updateMany({}, { $set: { is_deleted: false } });

        await ctx.answerCbQuery(); // tugma loadingni yopadi
        await ctx.reply("✅ Barcha kinolar tiklandi!");
    } catch (err) {
        console.error("❌ restoreAllKinolar xatolik:", err);
        await ctx.reply("❗️Kinolarni tiklashda xato bo‘ldi");
    }
};