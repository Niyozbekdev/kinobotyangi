const Kino = require("../../models/Kino");
const { Markup } = require("telegraf");

const PAGE_SIZE = 5;

async function KinolarWithVideos(ctx, page = 1, editNav = false) {
    try {
        // 🛡️ Sessionni himoyalab olamiz
        if (!ctx.session) ctx.session = {};
        if (!Array.isArray(ctx.session.lastMessages)) ctx.session.lastMessages = [];
        if (typeof ctx.session.navMessageId === 'undefined') ctx.session.navMessageId = null;

        const totalKinolar = await Kino.countDocuments();
        if (totalKinolar === 0) {
            return ctx.reply("📭 Bazada hali kino yo‘q");
        }

        const kinolar = await Kino.find()
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        // Eski sahifaning barcha xabarlarini o‘chiramiz
        for (const msgId of ctx.session.lastMessages) {
            try { await ctx.deleteMessage(msgId); } catch (_) { }
        }
        ctx.session.lastMessages = [];

        // Yangi sahifadagi kinolarni yuborish
        for (const kino of kinolar) {
            let caption =
                `🎬 Kino ma'lumotlari\n` +
                `📌 Kodi: ${kino.code}\n` +
                `📖 Nomi: ${kino.title}`;

            if (kino.is_deleted) caption += `\n🚫 Bu kino vaqtincha bloklangan!`;

            const sent = kino.file_id
                ? await ctx.replyWithVideo(kino.file_id, { caption, parse_mode: "Markdown" })
                : await ctx.reply(caption, { parse_mode: "Markdown" });

            ctx.session.lastMessages.push(sent.message_id);
        }

        // Navigatsiya (edit qilamiz, o‘chirib yubormaymiz)
        const totalPages = Math.ceil(totalKinolar / PAGE_SIZE);
        const btns = [];
        if (page > 1) btns.push(Markup.button.callback("⬅️ Oldingi", `kinolar_page_${page - 1}`));
        if (page < totalPages) btns.push(Markup.button.callback("Keyingi ➡️", `kinolar_page_${page + 1}`));

        const navText = `📄 Sahifa ${page}/${totalPages}`;

        if (editNav && ctx.session.navMessageId) {
            // Aniq nav xabarini edit qilish (barqarorroq usul)
            await ctx.telegram.editMessageText(
                ctx.chat.id,
                ctx.session.navMessageId,
                undefined,
                navText,
                { reply_markup: { inline_keyboard: [btns] } }
            );
        } else {
            const navMsg = await ctx.reply(navText, Markup.inlineKeyboard([btns]));
            ctx.session.navMessageId = navMsg.message_id;
        }

    } catch (err) {
        console.error("❌ sendKinolarWithVideos xatolik:", err);
        await ctx.reply("❗️Kinolarni chiqarishda xato bo‘ldi");
    }
}

module.exports = KinolarWithVideos;