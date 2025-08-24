const User = require('../../models/User');
const Image = require('../../models/imageSchema');


//Kino topish bosilganda ishlaydi
const vipKanl = async (ctx) => {
    try {
        // const userId = ctx.from.id
        const images = await Image.find(); //Dbdan olamiz
        // const user = await User.findOne({ user_id: userId });
        // file_id lar bilan mediaGroup yuborish
        await ctx.telegram.sendMediaGroup(
            ctx.chat.id,
            images.map((img, i) => ({
                type: "photo",
                media: img.file_id,
                caption: i === 0 ? "🎁 VIP kanalga qushilish uchun admin bilan bog'laning.\n✅ Kanalga videolar tashalib boriladi.\n💵 Eslatib o'taman kanal pullik.\n\n👤 Admin:  @King_2343" : undefined, // faqat 1-rasmga caption
            })),
            { protect_content: true }
        );
        // await ctx.telegram.sendMediaGroup(ctx.chat.id, [
        //     { type: "photo", media: { source: file1 } },
        //     { type: "photo", media: { source: file2 } },
        //     { type: "photo", media: { source: file3 }, caption: "🎁 VIP kanalga qushilish uchun admin bilan bog'laning. \n💵 Eslatib o'taman kanal pullik.\n\n👤 Admin:  @King_2343" },
        // ]);

        // return ctx.reply("💵 VIP kanalga qushilish uchun admin bilan bog'laning. \n🎁 Admin:  @King_2343");
    } catch (err) {
        console.error("vipkanljs xato", err)
    }

};

module.exports = vipKanl;