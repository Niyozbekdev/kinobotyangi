
module.exports = (bot) => {
    try {
        const deleteMsg = require('./delereMsg');
        const deleteParamentKino = require('./deleteParamentKino');
        const deleteTemporaryKino = require('./deleteTemporaryKino');

        bot.action('delete_msg', deleteMsg);
        bot.action('delete_permanent', deletePermanentKino);
        bot.action('delete_temporary', deleteTemporaryKino);


        // Yana boshqa action'larni bu yerga qo‘shishingiz mumkin:
        // bot.action('start_quiz', startQuiz);
        // bot.action('join_channel', joinChannel);
    } catch (err) {
        console.error("Actionlarni ulab turga index.js xato", err)
    }
};