const User = require('../../models/User');
const UserVideoYuborish = require('../../models/UserVideoYuborish');
const checkKanalar = require('../actions/checkKanalar');

//Kino topish bosilganda ishlaydi
const onKinoTopishClick = async (ctx) => {
    try {
        const userId = ctx.from.id

        const user = await User.findOne({ user_id: userId });

        if (!user || !user.phone_number) {
            return ctx.reply("❗️Botdan toliq foydalanish uchun raqamingizni yuboring", {
                reply_markup: {
                    keyboard: [
                        [{ text: "📲 Raqamni yuborish", request_contact: true }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
        const tekshirKanal = await checkKanalar(ctx);
        if (!tekshirKanal) return;
        //Bu user har safar kino topishni bosganda oxirgi faolik yangilanadi
        const today = new Date().toISOString().split('T')[0];

        // Raqam bor, davom etamiz
        await User.findOneAndUpdate(
            { user_id: userId },
            {
                step: "waiting_for_codd", updated_at: new Date(),
                last_active_at: today
            },
            { upsert: true }
        );

        const userVideo = await UserVideoYuborish.findOne({ user_id: userId });
        if (userVideo) {
            userVideo.step = null;
            await userVideo.save();
        }

        return ctx.reply("🎬 Kino kodini kiriting:");
    } catch (err) {
        console.error("onKinoTopishda", err)
    }

};

module.exports = onKinoTopishClick;