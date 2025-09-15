const VipPost = require('../../models/VipPost');

/**
 * 👤 Oddiy user "VIP kanal" tugmasini bosganda
 */
const vipKanal = async (ctx) => {
    try {
        // Oxirgi saqlangan VIP postni topamiz
        const post = await VipPost.findOne({ is_active: true }).sort({ createdAt: -1 });

        if (!post) {
            return ctx.reply("❌ Hozircha VIP post mavjud emas.");
        }

        // Agar 1 tadan ko‘p rasm bo‘lsa → mediaGroup qilib yuboramiz
        if (post.images.length > 1) {
            await ctx.replyWithMediaGroup(
                post.images.map((img, idx) => ({
                    type: "photo",
                    media: img.file_id,
                    caption: idx === 0 && img.caption ? img.caption : undefined
                }))
            );
        } else {
            // Bitta rasm bo‘lsa → caption bilan yuboramiz
            const first = post.images[0];
            await ctx.replyWithPhoto(first.file_id, {
                caption: first.caption || ""
            });
        }

        // Agar postda uzun matn bo‘lsa → alohida yuboramiz
        if (post.long_text) {
            await ctx.reply(post.long_text);
        }

    } catch (err) {
        console.error("showVipPost error:", err);
        await ctx.reply("❌ VIP postni chiqarishda xatolik yuz berdi.");
    }
}

module.exports = vipKanal;