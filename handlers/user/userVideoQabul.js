const UserVideoYuborish = require('../../models/UserVideoYuborish');
const VideoQabulState = require('../../models/VideoQabulState');
const boshMenyu = require('../../keyboards/mainKeyboard');

// ✅ USER STEP: Agar foydalanuvchi video yuborayotgan bo‘lsa
const UserVideo = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const user = await UserVideoYuborish.findOne({ user_id: userId });
        const msg = ctx.message;
        if (!msg?.video) return ctx.reply("Faqat video yuboring")

        if (user && user.step === 'user_video') {
            if (!msg.video) return ctx.reply("❗️ Faqat video yuborishingiz mumkin.");

            const state = await VideoQabulState.findOne({ step: 'tayyor' });
            if (!state || !state.qabul_manzil) return ctx.reply("❗️ Admin video manzilni hali belgilamagan.");

            await ctx.telegram.sendVideo(state.qabul_manzil, msg.video.file_id, {
                caption: `🎥 @${ctx.from.username || ctx.from.first_name} yubordi: \n\n${msg.caption || ''}`,
                parse_mode: 'HTML'
            });

            user.step = null;
            await user.save();
            return ctx.reply("✅ Videongiz yuborildi.");
        }
    } catch (err) {
        console.error("UserVideo faylda xato".err.message)
    }
}

module.exports = UserVideo;