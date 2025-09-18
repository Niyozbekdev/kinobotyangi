const VipPost = require('../../models/VipPost'); // ✅ VipPost modelini import qilamiz

/**
 * 🗑 Admin "❌ Barcha VIP postlarni o‘chirish" tugmasini bosganda
 * - Shu admin yaratgan barcha VIP postlarni o‘chiradi
 * - Nechta post o‘chirilganini chiqaradi
 */
const deleteVipPost = async (ctx) => {
    try {
        const adminId = ctx.from.id;

        // 🔹 Shu admin yaratgan barcha aktiv VIP postlarni o‘chiramiz
        const result = await VipPost.deleteMany({ created_by: adminId, is_active: true });

        // 🔹 Agar hech narsa o‘chirilmagan bo‘lsa
        if (!result || result.deletedCount === 0) {
            await ctx.answerCbQuery("⚠️ O‘chirish uchun VIP postlar topilmadi.");
            return;
        }

        // 🔹 Callback tugmasidagi matnni o‘zgartiramiz
        await ctx.editMessageText(`🚫 ${result.deletedCount} ta VIP post muvaffaqiyatli o‘chirildi.`);
    } catch (err) {
        console.error("deleteAllVipPosts error:", err);
        await ctx.reply("❌ VIP postlarni o‘chirishda xatolik yuz berdi.");
    }
};

module.exports = deleteVipPost;