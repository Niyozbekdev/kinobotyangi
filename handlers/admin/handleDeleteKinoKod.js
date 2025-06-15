const AdminState = require('../../models/AdminState');
const Kino = require('../../models/Kino');
const { ADMIN_ID } = require('../../config/admin');

const handleDeleteCode = async (ctx) => {
    try {
        const userId = ctx.from.id;
        if (!ADMIN_ID.includes(ctx.from.id)) return;

        const state = await AdminState.findOne({ admin_id: userId });

        if (!state || state.step !== 'awaiting_delete_code') return ctx.reply('Iltimos video yuboring');

        const code = ctx.text.trim();

        if (!/^\d+$/.test(code)) return ctx.reply(`❌ Xato: Kod faqat raqamlar iborat bo'lish kerak`)

        //Bu kod yuborganda bazada bor yoki yuqligini tekshiradi

        const kino = await Kino.findOne({ code });

        if (!kino) {
            return ctx.reply("❌ Bunday kodli kino topilmadi.");
        }

        await AdminState.findOneAndUpdate(
            { admin_id: userId },
            {
                step: 'confirm_delete',
                temp_file_id: code,
                updated_at: new Date()
            }
        );

        await ctx.replyWithVideo(kino.file_id, {
            caption: ` 🎞 Kino: ${kino.title}\n🆔 Kod: ${kino.code}`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🗑 Butunlay o‘chirish", callback_data: "delete_permanent" }],
                    [{ text: "🕓 Vaqtinchalik o‘chirish", callback_data: "delete_temporary" }]
                ]
            }
        });
    } catch (err) {
        console.error("HandleDeleteKinoKod faylida xato", err)
    }
};

module.exports = handleDeleteCode;