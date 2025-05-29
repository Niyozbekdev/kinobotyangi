const videoHandler = require('../admin/handleVideo');
const titleHandler = require('../admin/handleText');
const codeHandler = require('../admin/handleCode');
const HandleDeleteKinoKod = require('../admin/handleDeleteKinoKod');
const HandleKanal = require('../admin/handleKanal');
const AdminState = require('../../models/AdminState');

const adminText = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const msg = ctx.message;

        if (!msg) return;

        const state = await AdminState.findOne({ admin_id: userId });

        if (msg.video && state?.step === 'waiting_for_video') {
            return await videoHandler(ctx);
        }

        if (msg.text && state?.step === 'waiting_for_title') {
            return await titleHandler(ctx);
        }

        if (msg.text && state?.step === 'waiting_for_code') {
            return await codeHandler(ctx);
        }

        if (msg.text && state?.step === 'awaiting_delete_code') {
            return await HandleDeleteKinoKod(ctx);
        }

        if (msg.text && state?.step === 'awaiting_channel_link') {
            return await HandleKanal(ctx);
        }
    } catch (err) {
        console.error("Admin textda muoama", err)
    }
};

module.exports = adminText;