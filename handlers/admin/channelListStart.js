const Channel = require('../../models/Channel');
const AdminState = require('../../models/AdminState');
const { Markup } = require('telegraf');
const { ADMIN_ID } = require('../../config/admin');

const showChannelList = async (ctx) => {
    try {
        const admin_id = ctx.from.id;
        if (!ADMIN_ID.includes(ctx.from.id)) return;

        await AdminState.deleteOne({ admin_id: admin_id })

        const channels = await Channel.find();

        if (!channels.length) {
            return ctx.reply('📭 Kanallar hozircha mavjud emas.');
        }

        for (const channel of channels) {
            const text = `📢 *Kanal:* [${channel.link}](${channel.link})\n🔢 *Raqami:* ${channel.number}`;

            await ctx.replyWithMarkdown(text, Markup.inlineKeyboard([
                [Markup.button.callback('❌ O‘chirish', `delete_channel_${channel.number}`)]
            ]));
        }
    } catch (err) {
        console.error("❌ Kanal ro‘yxatini ko‘rsatishda xatolik:", err);
        ctx.reply('⚠️ Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.');
    }
};

module.exports = showChannelList;