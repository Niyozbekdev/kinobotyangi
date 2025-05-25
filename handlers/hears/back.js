const { Markup } = require('telegraf');
const mainKeyboard = require('../../keyboards/mainKeyboard')

const orqagaClick = async (ctx) => {
    await ctx.reply(
        '🏠 Asosiy menyuga qaytdingiz:', mainKeyboard());
}

module.exports = orqagaClick
