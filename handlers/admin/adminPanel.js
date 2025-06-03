const adminKeyboard = require('../../keyboards/adminKeyboard');
const User = require('../../models/User')
const { ADMIN_ID } = require('../../config/admin');

const adminPanel = async (ctx) => {
    try {
        if (ctx.from.id !== ADMIN_ID) {
            return ctx.reply('❌ Siz admin emassiz');
        }

        const user = await User.findOne({ user_id: ctx.from.id });
        user.step = null;
        await user.save();

        //Bu kod agar admin bo'lsa adminga tegishli buyruqlarni ko'rsatadi
        await ctx.reply('🛠 Admin bo‘limiga xush kelibsiz. Quyidagi amallardan birini tanlang:', adminKeyboard());
    } catch (err) {
        console.error("Admin panelda", err)
    }
};
module.exports = adminPanel;