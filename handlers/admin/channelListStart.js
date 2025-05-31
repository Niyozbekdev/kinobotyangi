const Channel = require('../../models/Channel');
const { Markup } = require('telegraf');

const showChannelList = async (ctx) => {
    try {
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