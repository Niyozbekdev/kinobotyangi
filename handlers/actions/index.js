
module.exports = (bot) => {
    try {
        const deleteMsg = require('./delereMsg');
        const deletePermanentKino = require('./deletePermanentKino');
        const deleteTemporaryKino = require('./deleteTemporaryKino');
        const checkKanalar = require('./checkKanalar');
        const saveChannelInvite = require('./saveChanelInvate')
        const deleteChannel = require('./deleteChannel');
        const deleteVipPost = require('./deleteVipPost')
        const xabarniYuborish = require('./xabarniYuborish');
        const brAddBtn = require('./brAddBtn');
        const brNotBtn = require('./brNotBtn');
        const deleteManzil = require('./mazilOchrish');
        const { saveVipPost, cancelVipPost } = require('../../commands/saveImage')

        bot.action('delete_msg', deleteMsg);
        bot.action('delete_permanent', deletePermanentKino);
        bot.action('delete_temporary', deleteTemporaryKino);
        bot.action('check_subscription', checkKanalar);
        bot.action('awaiting_channel_invite_link', saveChannelInvite);
        bot.action('br_addbtn', brAddBtn);
        bot.action('br_nobtn', brNotBtn);
        bot.action('br_send', xabarniYuborish);
        bot.action('vip_save', saveVipPost);
        bot.action('vip_cancel', cancelVipPost);
        bot.action('ochir_video_manzil', deleteManzil);
        bot.action('vip_delete', deleteVipPost)
        bot.action(/delete_channel_\d+/, deleteChannel)


        // Yana boshqa action'larni bu yerga qo‘shishingiz mumkin:
        // bot.action('start_quiz', startQuiz);
        // bot.action('join_channel', joinChannel);
    } catch (err) {
        console.error("Actionlarni ulab turga index.js xato", err)
    }
};