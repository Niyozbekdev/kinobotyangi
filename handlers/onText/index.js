const userText = require('./userText');
const adminText = require('./adminText');
const AdminState = require('../../models/AdminState');
const userContact = require('./userContact');
const VideoQabulState = require('../../models/VideoQabulState');
const videoManzilSaqlash = require('../admin/videoManzilSaqlash');
const UserVideoYuborishState = require('../../models/UserVideoYuborish');
const userVideoQabul = require('../user/userVideoQabul');

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

        const stateQabulVideoManzil = await VideoQabulState.findOne({ admin_id: userId });

        const userVideoQabulstate = await UserVideoYuborishState.findOne({ user_id: userId });


        if (userVideoQabulstate && userVideoQabulstate.step) {
            return await userVideoQabul(ctx)
        }

        if (stateQabulVideoManzil && stateQabulVideoManzil.step) {
            return await videoManzilSaqlash(ctx)
        }

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