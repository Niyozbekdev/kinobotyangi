
module.exports = (bot) => {
    const deleteMsg = require('./delereMsg');

    bot.action('delete_msg', deleteMsg);

    // Yana boshqa action'larni bu yerga qo‘shishingiz mumkin:
    // bot.action('start_quiz', startQuiz);
    // bot.action('join_channel', joinChannel);
};