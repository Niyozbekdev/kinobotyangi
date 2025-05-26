const User = require('../../models/User');

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


        // Raqam bor, davom etamiz
        await User.findOneAndUpdate(
            { user_id: userId },
            { step: "waiting_for_codd", updated_at: new Date() },
            { upsert: true }
        );
        return ctx.reply("🎬 Kino kodini kiriting:");
    } catch (err) {
        console.error("onKinoTopishda", err)
    }

};

module.exports = onKinoTopishClick;