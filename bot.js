const { Telegraf } = require("telegraf");
const { BOT_TOKEN } = require('./config/admin');
const bot = new Telegraf(BOT_TOKEN);
//Botdagi xatolikni ushlaydi barchasini
bot.catch((err, ctx) => {
    console.error("Botda xatolik", err);
    ctx.reply("Xatolik yuz berdi.. Keyinroq urinib ko'ring.")
});

const { startCommand, handleStart } = require('./commands/startCommand');

//Bu start komandasini foallashtiradi
startCommand(bot);

bot.command('start', async (ctx) => {
    await handleStart(ctx);
});

const userContact = require('./handlers/onText/userContact')
bot.on('contact', userContact)

// Foydalanuvchi tugmalari (hears)
const onKinoTopish = require('./handlers/hears/onKinoTopishClick');
// const boglanish = require('./handlers/hears/boglanish');
// const ulashish = require('./handlers/hears/ulashish');
// const darajam = require('./handlers/hears/darajam');
const adminPanel = require('./handlers/admin/adminPanel');
const addKinoStart = require('./handlers/admin/addKinoStart');
const orqagaClick = require('./handlers/hears/back');

bot.hears('🎬 Kino topish', onKinoTopish);
// bot.hears('📞 Bog‘lanish', boglanish);
// bot.hears('📤 Ulashish', ulashish);
// bot.hears('📊 Darajam', darajam);
bot.hears('🛠 Admin bo‘limi', adminPanel);
bot.hears('🎥 Kino qo‘shish', addKinoStart);
bot.hears('⬅️ Orqaga', orqagaClick);

bot.command('kino', async (ctx) => {
    try {
        await onKinoTopish(ctx);
    } catch (err) {
        console.error("Bot jsda error", err)
    }
});
const onText = require('./handlers/onText');
bot.on('message', onText);

//Action handlers
require('./handlers/actions')(bot);
// Botni eksport qilish
module.exports = bot