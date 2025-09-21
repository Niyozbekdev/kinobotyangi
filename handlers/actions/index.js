
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
        const KinolarWithVideos = require('./KinolarWithVideos');
        const blockAllKinolar = require('./blockAllKinolar');
        const restoreAllKinolar = require('./restoreAllKinolar');
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
        bot.action('kinolar_bloklash', blockAllKinolar);
        bot.action('kinolar_tiklash', restoreAllKinolar);
        bot.action(/delete_channel_\d+/, deleteChannel);
        bot.action('kinolar_videolar', async (ctx) => {
            await ctx.answerCbQuery();
            // 🧹 Birinchi chaqiriqda sessiyani tozalaymiz
            if (!ctx.session) ctx.session = {};
            ctx.session.lastMessages = [];
            ctx.session.navMessageId = null;
            await KinolarWithVideos(ctx, 1, false);
        });

        bot.action(/kinolar_page_(\d+)/, async (ctx) => {
            await ctx.answerCbQuery();
            const page = parseInt(ctx.match[1], 10);
            await KinolarWithVideos(ctx, page, true);
        });



        // Yana boshqa action'larni bu yerga qo‘shishingiz mumkin:
        // bot.action('start_quiz', startQuiz);
        // bot.action('join_channel', joinChannel);
    } catch (err) {
        console.error("Actionlarni ulab turga index.js xato", err)
    }
};