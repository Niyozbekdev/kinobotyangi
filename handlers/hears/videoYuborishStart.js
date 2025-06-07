// handlers/user/videoYuborishniBosish.js
const User = require('../../models/User');
const UserVideoYuborish = require('../../models/UserVideoYuborish');
const VideoQabulState = require('../../models/VideoQabulState');

/**
 * 📍 Foydalanuvchi "🎥 Video yuborish" tugmasini bosganda
 * ➕ Maqsad: Uni video yuborish rejimiga o'tkazish (step = user_video)
 */
const videoYuborishStart = async (ctx) => {
    try {
        const user_id = ctx.from.id;
        const user = await User.findOne({ user_id: user_id });

        // 3. Admin tomonidan tayyorlangan video qabul manzilini topamiz
        const state = await VideoQabulState.findOne({ step: 'tayyor' });
        if (!state || !state.qabul_manzil) {
            return await ctx.reply("❗️Hozircha video qabul qilinmayabdi.");
        }

        await UserVideoYuborish.findOneAndUpdate(
            { user_id },
            { step: 'user_video', updated_at: new Date() },
            { upsert: true }
        );

        user.step = null;
        await user.save();

        await ctx.reply('📥 Endi video yuborishingiz mumkin!');
    } catch (err) {
        console.error("❌ videoYuborishgaRuxsat xatosi:", err.message);
        await ctx.reply("Xatolik: video yuborish rejimiga o‘tib bo‘lmadi.");
    }
};

module.exports = videoYuborishStart;