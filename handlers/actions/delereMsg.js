
//Bu foydalanuvhi video tagidagi X ni bosganda video uchib ketadi
const deleteMsg = async (ctx) => {
    try {
        await ctx.deleteMessage(); // Inline tugmani bosgan xabarni o‘chiradi
    } catch (error) {
        console.error('❌ Xabarni o‘chirishda xatolik:', error.message);
        await ctx.answerCbQuery('⚠️ Xabarni o‘chirishda muammo.');
    }
};

module.exports = deleteMsg;