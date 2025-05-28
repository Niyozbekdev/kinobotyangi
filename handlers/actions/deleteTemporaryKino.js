const AdminState = require('../../models/AdminState');
const Kino = require('../../models/Kino');

const deleteTemporaryKino = async (ctx) => {
    try {
        const adminId = ctx.from.id;
        const state = await AdminState.findOne({ admin_id: adminId });

        if (!state || state.step !== 'confirm_delete') return;

        const kino = await Kino.findOne({ code: state.temp_file_id });
        if (!kino) return ctx.editMessageCaption("❌ Kino topilmadi.");

        kino.is_deleted = true;
        await kino.save();
        await ctx.editMessageCaption("✅ Kino vaqtinchalik o‘chirildi.");
        await AdminState.deleteOne({ admin_id: adminId });
        await ctx.answerCbQuery();
    } catch (err) {
        console.error("DeleteTemporaryKino faylda xato", err)
    }
};

module.exports = deleteTemporaryKino;