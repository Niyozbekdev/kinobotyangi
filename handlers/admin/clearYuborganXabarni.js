/**
 * 📍 Callback: clear_msgs
 * ➕ Maqsad: Barcha foydalanuvchilarga yuborilgan xabarlarni o‘chirish
 */

const SentMessage = require('../../models/SendMessage');
const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const clearMessages = async (ctx) => {
    try {
        const userId = ctx.from.id;
        if (!ADMIN_ID.includes(ctx.from.id)) return;

        await AdminState.deleteOne({ admin_id: userId })

        const all = await SentMessage.find({});
        let count = 0;
        let noCount = 0;

        for (const msg of all) {
            try {
                await ctx.telegram.deleteMessage(msg.user_id, msg.message_id);
                count++;
            } catch (err) {
                console.log(`❌ O‘chirilmadi: ${msg.user_id}, msg_id: ${msg.message_id}`);
                noCount++;
            }
        }

        // Bazani tozalash
        await SentMessage.deleteMany({});

        await ctx.reply(
            `🧼 Xabarlar tozalandi.\n\n` +
            `✅ O‘chirildi: ${count} ta\n` +
            `❌ O‘chirilmadi: ${noCount} ta`
        );
    } catch (err) {
        console.error('❌ clearMessages xatosi:', err.message);
        await ctx.reply('❌ Xatolik: xabarlarni tozalash muvaffaqiyatsiz tugadi.');
    }
};

module.exports = clearMessages;