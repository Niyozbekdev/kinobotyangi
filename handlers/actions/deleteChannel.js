const Channel = require('../../models/Channel');

const deleteChannel = async (ctx) => {
    try {
        const data = ctx.callbackQuery.data;
        const match = data.match(/^delete_channel_(\d+)$/);
        if (!match) return;

        const number = parseInt(match[1], 10);
        const channel = await Channel.findOne({ number });

        if (!channel) {
            return ctx.answerCbQuery('❗️ Bunday raqamli kanal topilmadi.', { show_alert: true });
        }

        await channel.deleteOne();
        await ctx.editMessageText(`✅ Kanal o‘chirildi:\n${channel.link}`);
    } catch (err) {
        console.error("❌ Kanalni o‘chirishda xatolik:", err);
        ctx.reply('⚠️ Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.');
    }
};

module.exports = deleteChannel;