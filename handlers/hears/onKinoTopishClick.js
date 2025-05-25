const User = require('../../models/User');

//Kino topish bosilganda ishlaydi
const onKinoTopishClick = async (ctx) => {
    const userId = ctx.from.id

    await User.findOneAndUpdate(
        { user_id: userId },
        { step: "waiting_for_codd", updated_at: new Date() },
        { upsert: true }
    );
    await ctx.reply("🎬 Kino kodini kiriting:");
};

module.exports = onKinoTopishClick;