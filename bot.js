const { Telegraf } = require("telegraf");
const { BOT_TOKEN } = require('./config/admin');
const bot = new Telegraf(BOT_TOKEN);
const { startCommand, handleStart } = require('./commands/startCommand');
const kinoTopish = require('./commands/kinoTopish')

//Bu start komandasini foallashtiradi
startCommand(bot);

bot.command('start', async (ctx) => {
    await handleStart(ctx);
});
bot.command('kino', async (ctx) => {
    await kinoTopish(ctx);
    console.log("kino bosildi ")
});


// Foydalanuvchi tugmalari (hears)
const onKinoTopish = require('./handlers/hears/onKinoTopishClick');
const boglanish = require('./handlers/hears/boglanish');
const ulashish = require('./handlers/hears/ulashish');
const darajam = require('./handlers/hears/darajam');
const adminPanel = require('./handlers/admin/adminPanel');
const addKinoStart = require('./handlers/admin/addKinoStart');
const orqagaClick = require('./handlers/hears/back');

bot.hears('🎬 Kino topish', onKinoTopish);
bot.hears('📞 Bog‘lanish', boglanish);
bot.hears('📤 Ulashish', ulashish);
bot.hears('📊 Darajam', darajam);
// Admin panelga kirish
bot.hears('🛠 Admin bo‘limi', adminPanel);
bot.hears('🎥 Kino qo‘shish', addKinoStart);
bot.hears('⬅️ Orqaga', orqagaClick);
//Matn xabarlar uchun unversal yechim
const onText = require('./handlers/onText');
bot.on('message', onText);

//Action handlers
require('./handlers/actions')(bot);
// Botni eksport qilish
module.exports = bot;