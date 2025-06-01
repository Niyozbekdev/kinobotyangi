const User = require('../../models/User');
const AdminState = require('../../models/AdminState');

const videoQabul = async (ctx) => {
    try {
        const user_id = ctx.from.id;

        // ✅ Userni bazadan topamiz
        const user = await User.findOne({ user_id });

        // Agar user bazada bo'lmasa yoki step noto‘g‘ri bo‘lsa — to‘xtaymiz
        if (!user || user.step !== 'user_video') {
            return;
        }

        // ✅ Faqat video qabul qilamiz
        if (!ctx.message.video) {
            return ctx.reply('❗️ Faqat video yuboring.');
        }

        const videoId = ctx.message.video.file_id;
        const caption = ctx.message.caption || '';
        const admin_id = process.env.ADMIN_ID;

        // AdminState dan video manzilini olamiz
        const state = await AdminState.findOne({ admin_id });
        const manzil = state?.video_qabul_manba;

        if (!manzil) {
            return ctx.reply("❗️ Video qabul qiluvchisi belgilanmagan.");
        }

        // ✅ Videoni yuborish
        await ctx.telegram.sendVideo(manzil, videoId, {
            caption: `🎬 @${ctx.from.username || ctx.from.first_name} yubordi:\n\n${caption}`,
            parse_mode: 'HTML'
        });

        // User step ni tozalaymiz
        user.step = null;
        await user.save();

        await ctx.reply('✅ Video yuborildi!');
    } catch (err) {
        console.error("❌ videoQabul xatosi:", err.message);
        await ctx.reply('❌ Xatolik: video yuborib bo‘lmadi.');
    }
};

module.exports = videoQabul;