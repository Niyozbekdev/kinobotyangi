const UserVideoYuborish = require('../../models/UserVideoYuborish');
const VideoQabulState = require('../../models/VideoQabulState');

/**
 * 📩 USER STEP: Foydalanuvchi video yuborganida ushbu funksiya ishga tushadi
 */
const UserVideo = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const msg = ctx.message;

        // 1. Xabar va video mavjudligini tekshiramiz
        if (!msg || !msg.video) {
            return await ctx.reply("❗️ Faqat video yuboring.");
        }

        // 2. User step holatini tekshiramiz
        const user = await UserVideoYuborish.findOne({ user_id: userId });
        if (!user || user.step !== 'user_video') {
            return await ctx.reply("⚠️ Siz video yuborish rejimida emassiz.");
        }

        //3 Admin tomonidan tayyorlangan video qabul manzilini topamiz
        const state = await VideoQabulState.findOne({ step: 'tayyor' });
        if (!state || !state.qabul_manzil) {
            return await ctx.reply("❗️Hozircha video qabul qilinmayabdi");
        }

        // 4. Videoni yuborish
        await ctx.telegram.sendVideo(state.qabul_manzil, msg.video.file_id, {
            caption: `🎥 @${ctx.from.username || ctx.from.first_name} yubordi: \n\n${msg.caption || ''}`,
            parse_mode: 'HTML'
        });

        // 5. Stepni tozalash
        user.step = null;
        await user.save();

        return await ctx.reply("✅ Videongiz muvaffaqiyatli yuborildi.");
    } catch (err) {
        console.error("❌ UserVideo faylida xato:", err.message);
        return await ctx.reply("Xatolik: Videoni yuborishda muammo yuz berdi.");
    }
};

module.exports = UserVideo;