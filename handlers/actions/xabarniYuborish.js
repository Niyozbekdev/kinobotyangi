/**
 * 📍 Callback: br_send
 * ➕ Maqsad: Admin tasdiqlagan xabarni barcha foydalanuvchilarga yuborish
 */

const AdminState = require('../../models/AdminState');
const User = require('../../models/User');

const xabarniYuborish = async (ctx) => {
    try {
        const state = await AdminState.findOne({ admin_id: ctx.from.id });
        if (!state || state.step !== 'confirm_broadcast') return;

        const users = await User.find({ is_blocked: false });
        const { temp_title, temp_file_id, temp_button_text, temp_button_url } = state;

        let yuborildi = 0;
        let yuborilmadi = 0;

        const opts = {
            caption: temp_title,
            parse_mode: 'HTML',
            reply_markup: temp_button_text && temp_button_url ? {
                inline_keyboard: [[{ text: temp_button_text, url: temp_button_url }]]
            } : undefined
        };

        for (const user of users) {
            try {
                if (temp_file_id && temp_file_id.startsWith('AgAC') || temp_file_id.startsWith('CQAC')) {
                    await ctx.telegram.sendPhoto(user.user_id, temp_file_id, opts);
                } else if (temp_file_id) {
                    await ctx.telegram.sendVideo(user.user_id, temp_file_id, opts);
                } else {
                    await ctx.telegram.sendMessage(user.user_id, temp_title, opts);
                }
                yuborildi++;
            } catch {
                yuborilmadi++;
            }
        }

        await AdminState.deleteOne({ admin_id: ctx.from.id });

        await ctx.editMessageText(`📬 Xabar yuborildi.\n\n✅ Yuborildi: ${yuborildi} ta\n❌ Yuborilmadi: ${yuborilmadi} ta`);
    } catch (err) {
        console.error("❌ xabarniYuborish xatosi:", err.message);
        await ctx.reply("Xatolik: xabarni yuborish muvaffaqiyatsiz bo‘ldi.");
    }
};

module.exports = xabarniYuborish;