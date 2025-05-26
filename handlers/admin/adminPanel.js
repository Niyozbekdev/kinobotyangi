const adminKeyboard = require('../../keyboards/adminKeyboard');
const { ADMIN_ID } = require('../../config/admin');

const adminPanel = async (ctx) => {
    try {
        if (ctx.from.id !== ADMIN_ID) {
            return ctx.reply('❌ Siz admin emassiz');
        }

        //Bu kod agar admin bo'lsa adminga tegishli buyruqlarni ko'rsatadi
        await ctx.reply('🛠 Admin bo‘limiga xush kelibsiz. Quyidagi amallardan birini tanlang:', adminKeyboard());
    } catch (err) {
        console.error("Admin panelda", err)
    }
};
module.exports = adminPanel;