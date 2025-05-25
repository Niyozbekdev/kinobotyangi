const User = require('../../models/User');

//Kino topish bosilganda ishlaydi
const onKinoTopishClick = async (ctx) => {
    const userId = ctx.from.id

    const user = await User.findOne({ user_id: userId });

    if (!user || !user.phone_number) {
        return ctx.reply("❗️ Avval raqamingizni yuboring", {
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
};

module.exports = onKinoTopishClick;