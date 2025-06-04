/**
* 📍 Admin "📢 Xabar yuborish" tugmasini bosganda ishga tushadi.
* ➕ Maqsad: AdminState holatini boshlash va adminni xabar yuborishga chaqirish.
*/

const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const xabarYuborishniBoshlash = async (ctx) => {
    try {
        const admin_id = ctx.from.id;
        if (admin_id !== ADMIN_ID) return;

        await AdminState.findOneAndUpdate(
            { admin_id },
            {
                step: 'xabar_kutilmoqda', // Endi xabar yuboradi
                temp_file_id: null,
                temp_title: null,
                upsert: false,
                updated_at: new Date()
            },
            { upsert: true }
        );

        await ctx.reply("📢 Yubormoqchi bo‘lgan xabaringizni yuboring (matn, rasm yoki video):");

    } catch (err) {
        console.error("❌ xabarYuborishniBoshlash xatosi:", err.message);
        await ctx.reply("Xatolik: xabar yuborishni boshlashda muammo yuz berdi.");
    }
};

module.exports = xabarYuborishniBoshlash; 