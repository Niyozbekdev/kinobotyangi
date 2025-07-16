const User = require('../../models/User');
const AdminState = require('../../models/AdminState')

/**
 * Admin user_id yuborganida tekshiradi va foydalanuvchini bazadan o‘chiradi.
 */
const handleDeleteUser = async (ctx) => {
    try {
        const adminId = ctx.from.id;
        const adminState = await AdminState.findOne({ admin_id: adminId });

        const code = ctx.text.trim();
        if (!/^\d+$/.test(code)) return ctx.reply(`❌ Xato: Id faqat raqamlar iborat bo'lish kerak`)

        // Faqat foydalanuvchini o‘chirish bosqichida ishlaydi
        if (!adminState || adminState.step !== 'awaiting_user_id_for_delete') return;

        const userIdInput = ctx.text.trim();
        const userId = Number(userIdInput);


        // Raqamligiga ishonch hosil qilish
        if (isNaN(userId)) {
            return ctx.reply('❗️Noto‘g‘ri ID format. Iltimos, faqat raqam yuboring.');
        }

        // Bazadan foydalanuvchini qidiramiz
        const user = await User.findOne({ user_id: userId });

        if (!user) {
            await ctx.reply('❌ Bunday foydalanuvchi topilmadi.');
        } else {
            // Topilgan foydalanuvchini o‘chiramiz
            await User.deleteOne({ user_id: userId });
            await ctx.reply('✅ Foydalanuvchi muvaffaqiyatli o‘chirildi.');
        }

        // Admin step ni tozalaymiz
        await AdminState.deleteOne({ admin_id: userId });

    } catch (error) {
        console.error('Foydalanuvchini o‘chirishda xatolik:', error);
        await ctx.reply('❌ Foydalanuvchini o‘chirishda xatolik yuz berdi.');
    }
};

module.exports = handleDeleteUser;