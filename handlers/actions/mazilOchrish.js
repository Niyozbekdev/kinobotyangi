// 🗑 Callback tugmasi: manzilni o‘chirish

const VideoQabulState = require('../../models/VideoQabulState');

const deleteVideoManzil = async (ctx) => {
    try {
        const result = await VideoQabulState.deleteMany({});
        await ctx.answerCbQuery("✅ Manzil muvaffaqiyatli o‘chirildi!", { show_alert: true });

        await ctx.editMessageText("🗑 Manzil o‘chirildi. Endi foydalanuvchi video yubora olmaydi.");
    } catch (err) {
        console.error("❌ deleteVideoManzil xatosi:", err.message);
        await ctx.reply("Xatolik: manzilni o‘chirishda muammo yuz berdi.");
    }
};

module.exports = deleteVideoManzil;