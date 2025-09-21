// adminText.js
const Kino = require("../../models/Kino");
const { Markup } = require('telegraf')
const { ADMIN_ID } = require('../../config/admin');

const kinoLar = async (ctx) => {
    try {
        if (!ADMIN_ID.includes(ctx.from.id)) return;

        // === Kinolar tugmasi bosilganda ===
        const kinolar = await Kino.find();

        if (!kinolar || kinolar.length === 0) {
            return ctx.reply("📭 Bazada hali kino yo‘q");
        }

        let msg = `🎬 *Barcha kinolar ro‘yxati: ${kinolar.length} ta*\n\n`;
        kinolar.forEach((kino) => {
            msg += `Kodi: ${kino.code}, Nomi: ${kino.title} \n`;
        });

        // Inline tugmalar
        const buttons = Markup.inlineKeyboard([
            [Markup.button.callback("🎥 Videolar bilan ko‘rish", "kinolar_videolar")],
            [Markup.button.callback("🚫 Barcha kinoni bloklash", "kinolar_bloklash")],
            [Markup.button.callback("✅ Kinoni tiklash", "kinolar_tiklash")]
        ]);

        return ctx.reply(msg, { parse_mode: "Markdown", ...buttons });
    } catch (err) {
        console.error("❌ Kinolarni chiqarishda xato:", err);
        await ctx.reply("❗️Kinolar ro‘yxatini olishda xato bo‘ldi");
    }
};

module.exports = kinoLar;