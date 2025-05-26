const userText = require('./userText');
const adminText = require('./adminText');
const AdminState = require('../../models/AdminState');
const userContact = require('./userContact');

const onText = async (ctx) => {
    try {
        const msg = ctx.message;
        if (!msg) return;
        const userId = ctx.from.id;

        if (msg.contact) {
            return await userContact(ctx)
        }
        // AdminState borligini tekshiramiz (step-based boshqaruv uchun)
        const state = await AdminState.findOne({ admin_id: userId });
        // === Admin xabarlari (step orqali)
        if (state && state.step) {
            return await adminText(ctx); // video, title, code...
        }
        // === Oddiy foydalanuvchi text yuborgan bo‘lsa
        if (msg.text) {
            return await userText(ctx);
        }
        // === Agar boshqa turdagi xabar bo‘lsa 
        return ctx.reply(`❗️Bu xabaringizni tushunmadim.`);
    } catch (err) {
        console.error("Ontextda", err)
    }
};

module.exports = onText;