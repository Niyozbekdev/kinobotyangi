const userText = require('./userText');
const adminText = require('./adminText');
const AdminState = require('../../models/AdminState');
//const userContact = require('./userContact');
const handleDeleteUser = require('../admin/handleDeleteUser');
const VideoQabulState = require('../../models/VideoQabulState');
const videoManzilSaqlash = require('../admin/videoManzilSaqlash');
const UserVideoYuborishState = require('../../models/UserVideoYuborish');
const userVideoQabul = require('../user/userVideoQabul');
const { ADMIN_ID } = require('../../config/admin');

const onText = async (ctx) => {
    try {
        const msg = ctx.message;
        if (!msg) return;
        const userId = ctx.from.id;

        const videoManzilState = await VideoQabulState.findOne({ admin_id: userId });

        const userVideoQabulstate = await UserVideoYuborishState.findOne({ user_id: userId });

        // Adminmi? Har doim tekshiramiz
        const isAdmin = ADMIN_ID.includes(userId)

        const adminState = await AdminState.findOne({ admin_id: userId });


        // if (msg.contact) {
        //     return await userContact(ctx)
        // }
        if (isAdmin && msg.text && adminState?.step === 'awaiting_user_id_for_delete') {
            return await handleDeleteUser(ctx)
        }


        if (isAdmin && msg.text && videoManzilState?.step === 'manzil_kiritish') {
            return await videoManzilSaqlash(ctx)
        }


        if (isAdmin || adminState) {
            return await adminText(ctx); // video, title, code...
        }

        if (userVideoQabulstate?.step) {
            return await userVideoQabul(ctx)
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