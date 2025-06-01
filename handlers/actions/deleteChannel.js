const Channel = require('../../models/Channel');

const deleteChannel = async (ctx) => {
    try {
        const data = ctx.callbackQuery.data;
        const match = data.match(/^delete_channel_(\d+)$/);
        if (!match) return;

        const number = parseInt(match[1], 10);

        // Kanalni topamiz
        const channel = await Channel.findOne({ number });
        if (!channel) {
            return ctx.answerCbQuery('❗️ Bunday raqamli kanal topilmadi.', { show_alert: true });
        } 2

        // Kanalni o'chiramiz
        await channel.deleteOne();

        // Undan keyingi kanallarni 1 taga siljitamiz
        await Channel.updateMany(
            { number: { $gt: number } },
            { $inc: { number: -1 } }
        );

        // Foydalanuvchiga xabar
        await ctx.editMessageText(`
            ✅ Kanal o‘chirildi:\n\n🔗 ${channel.link}`,
            { parse_mode: 'Markdown' }
        );

    } catch (err) {
        console.error("❌ Kanalni o‘chirishda xatolik:", err);
        await ctx.reply('⚠️ Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.');
    }
};

module.exports = deleteChannel;