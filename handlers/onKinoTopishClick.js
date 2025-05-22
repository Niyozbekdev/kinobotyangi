//Kino topish bosilganda ishlaydi
const onKinoTopishClick = async (ctx) => {
    ctx.session = ctx.session || {};
    ctx.session.step = 'kodni_kiritish';
    await ctx.reply("🎬 Kino kodini kiriting:");
};

module.exports = onKinoTopishClick;