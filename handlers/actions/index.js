
module.exports = (bot) => {
    try {
        const deleteMsg = require('./delereMsg');
        const deletePermanentKino = require('./deletePermanentKino');
        const deleteTemporaryKino = require('./deleteTemporaryKino');
        const checkKanalar = require('./checkKanalar')
        const deleteChannel = require('./deleteChannel')

        bot.action('delete_msg', deleteMsg);
        bot.action('delete_permanent', deletePermanentKino);
        bot.action('delete_temporary', deleteTemporaryKino);
        bot.action('check_subscription', checkKanalar)
        bot.action(/delete_channel_\d+/, deleteChannel)


        // Yana boshqa action'larni bu yerga qo‘shishingiz mumkin:
        // bot.action('start_quiz', startQuiz);
        // bot.action('join_channel', joinChannel);
    } catch (err) {
        console.error("Actionlarni ulab turga index.js xato", err)
    }
};