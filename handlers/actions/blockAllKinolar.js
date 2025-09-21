// handlers/actions/blockAllKinolar.js
const Kino = require("../../models//Kino");

/**
 * 🚫 Barcha kinolarni vaqtincha bloklash (is_deleted = true)
 */
module.exports = async function blockAllKinolar(ctx) {
    try {
        await Kino.updateMany({}, { $set: { is_deleted: true } });

        await ctx.answerCbQuery(); // tugma loadingni yopadi
        await ctx.reply("🚫 Barcha kinolar vaqtincha bloklandi!");
    } catch (err) {
        console.error("❌ blockAllKinolar xatolik:", err);
        await ctx.reply("❗️Kinolarni bloklashda xato bo‘ldi");
    }
};