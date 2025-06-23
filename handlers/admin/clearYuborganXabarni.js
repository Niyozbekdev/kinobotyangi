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
        if (!ADMIN_ID.includes(userId)) return;

        await AdminState.deleteOne({ admin_id: userId });

        const allMessages = await SentMessage.find({});
        let deletedCount = 0;
        let failedCount = 0;

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < allMessages.length; i++) {
            const msg = allMessages[i];

            try {
                await ctx.telegram.deleteMessage(msg.user_id, msg.message_id);
                await SentMessage.deleteOne({ _id: msg._id });
                deletedCount++;
            } catch (err) {
                failedCount++;

                if (err.code === 400) {
                    console.log(`⚠️ Xatolik (400 - noto‘g‘ri so‘rov): ${msg.user_id}, msg_id: ${msg.message_id}`);
                } else if (err.code === 403) {
                    console.log(`⛔️ Foydalanuvchi botni bloklagan: ${msg.user_id}`);
                } else {
                    console.log(`❌ O‘chirilmadi: ${msg.user_id}, msg_id: ${msg.message_id}, error: ${err.message}`);
                }
            }

            // Har 25 ta so‘rovdan keyin 1 sekund delay
            if (i % 25 === 0) {
                await delay(1000);
            }
        }

        await ctx.reply(`🧼 Xabarlar tozalandi.\n\n✅ O‘chirildi: ${deletedCount} ta\n❌ O‘chirilmadi: ${failedCount} ta`);
    } catch (err) {
        console.error('❌ clearMessages xatosi:', err);
        await ctx.reply('❌ Xatolik: xabarlarni tozalash muvaffaqiyatsiz tugadi.');
    }
};

module.exports = clearMessages;