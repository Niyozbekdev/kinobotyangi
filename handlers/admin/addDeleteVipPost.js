const VipPost = require('../../models/VipPost'); // ✅ VipPost modelini import qilamiz
const { Markup } = require('telegraf');

/**
 * 📤 Admin "VIP postlarni ko‘rish/o‘chirish" tugmasini bosganda
 * - Barcha VIP postlarni chiqaradi
 * - Har bir postni preview qilib yuboradi (1 ta bo‘lsa photo, ko‘p bo‘lsa mediaGroup)
 * - Oxirida umumiy "❌ Barcha VIP postlarni o‘chirish" tugmasini chiqaradi
 */
const addDeleteVip = async (ctx) => {
    try {
        const adminId = ctx.from.id;

        // 🔹 Shu admin yaratgan barcha aktiv VIP postlarni olish
        const posts = await VipPost.find({ created_by: adminId, is_active: true }).sort({ createdAt: -1 });

        // 🔹 Agar VIP postlar bo‘lmasa
        if (!posts || posts.length === 0) {
            await ctx.reply("⚠️ Sizda VIP postlar mavjud emas.");
            return;
        }

        // 🔹 Har bir postni chiqarish
        for (let post of posts) {
            // 🖼 Agar postda faqat 1 ta rasm bo‘lsa
            if (post.images.length === 1) {
                await ctx.replyWithPhoto(post.images[0].file_id, {
                    caption: post.images[0].caption || ""
                });
            }
            // 📷 Agar 2 va undan ko‘p rasm bo‘lsa
            else {
                await ctx.replyWithMediaGroup(
                    post.images.map((img, idx) => ({
                        type: "photo",
                        media: img.file_id,
                        // caption faqat birinchi rasmga yoziladi (Telegram cheklovi)
                        caption: idx === 0 && post.caption ? post.caption : undefined
                    }))
                );
            }
        }

        // 🔹 Oxirida umumiy "Barchasini o‘chirish" tugmasini chiqaramiz
        await ctx.reply(
            "🗣 VIP postlarni o‘chirishni istaysizmi?",
            Markup.inlineKeyboard([
                [Markup.button.callback("❌ VIP postni o‘chirish", "vip_delete")]
            ])
        );

    } catch (err) {
        console.error("showAllVipPosts error:", err);
        await ctx.reply("❌ VIP postlarni olishda xatolik yuz berdi.");
    }
};

module.exports = addDeleteVip;