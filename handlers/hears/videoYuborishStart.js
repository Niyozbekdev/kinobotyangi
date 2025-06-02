// handlers/user/videoYuborishniBosish.js
const User = require('../../models/User');
const UserVideoYuborish = require('../../models/UserVideoYuborish');

/**
 * 📍 Foydalanuvchi "🎥 Video yuborish" tugmasini bosganda
 * ➕ Maqsad: Uni video yuborish rejimiga o'tkazish (step = user_video)
 */
const videoYuborishStart = async (ctx) => {
    try {
        const user_id = ctx.from.id;

        await UserVideoYuborish.findOneAndUpdate(
            { user_id },
            { step: 'user_video', updated_at: new Date() },
            { upsert: true }
        );

        // // Userni topamiz yoki yangisini yaratamiz
        // let user = await User.findOne({ user_id });
        // if (!user) {
        //     user = new User({ user_id });
        // }

        // user.step = 'user_video'; // Stepni belgilaymiz
        // await user.save();

        await ctx.reply('📥 Endi video yuborishingiz mumkin!');
    } catch (err) {
        console.error("❌ videoYuborishgaRuxsat xatosi:", err.message);
        await ctx.reply("Xatolik: video yuborish rejimiga o‘tib bo‘lmadi.");
    }
};

module.exports = videoYuborishStart;