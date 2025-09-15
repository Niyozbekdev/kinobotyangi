const videoHandler = require('../admin/handleVideo');
const titleHandler = require('../admin/handleText');
const codeHandler = require('../admin/handleCode');
const HandleDeleteKinoKod = require('../admin/handleDeleteKinoKod');
const HandleKanal = require('../admin/handleKanal');
const saveChanelInvate = require('../actions/saveChanelInvate');
const xabarniQabulQilish = require('../admin/xabarniQabulQilish');
const tugmaMatniniQabulQilish = require('../admin/tugmaMatniQabulQilish');
const tugmaURLniQabulQilish = require('../admin/tugmaURLniQabulQilish');
const AdminState = require('../../models/AdminState');
const VipAdminState = require('../../models/VipAdminSchema');
const VideoQabulState = require('../../models/VideoQabulState');
const videoManzilSaqlash = require('../admin/videoManzilSaqlash');
const { handleVipPhoto } = require('../../commands/saveImage')

const adminText = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const msg = ctx.message;

        if (!msg) return;

        const state = await AdminState.findOne({ admin_id: userId });
        const vippost = await VipAdminState.findOne({ admin_id: userId })
        const videoQabulState = await VideoQabulState.findOne({ admin_id: userId });

        //Bu admin video manzil qayerga saqlanish kerakligini tekshirib oladi.
        if (msg.text && videoQabulState?.step === 'manzil_kiritish') {
            return await videoManzilSaqlash(ctx);
        }

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

        if (msg.text && state?.step === 'awaiting_channel_invite_link') {
            return await saveChanelInvate(ctx);
        }

        if ((msg.text || msg.photo || msg.video || msg.video_note) && state?.step === 'xabar_kutilmoqda') {
            return await xabarniQabulQilish(ctx);
        }
        if (msg.text && state?.step === 'awaiting_button_text') {
            return await tugmaMatniniQabulQilish(ctx);
        }
        if (msg.text && state?.step === 'awaiting_button_url') {
            return await tugmaURLniQabulQilish(ctx);
        }

        if (msg.photo && vippost?.step === 'vip_post') {
            return await handleVipPhoto(ctx)
        }


    } catch (err) {
        console.error("Admin textda muoama", err)
    }
};

module.exports = adminText;