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


// const userContact = require('./handlers/onText/userContact')
// bot.on('contact', userContact);


//const checkKanalar = require('./midlwers/checkKanalar');
//bot.use(checkKanalar)//Xar bir xato oldidan majburiy obunani tekshiradi

// Foydalanuvchi tugmalari (hears)
const onKinoTopish = require('./handlers/hears/onKinoTopishClick');
const onVideoYuborish = require('./handlers/hears/videoYuborishStart');
const vipKanal = require('./handlers/hears/vipKanal');
//const virtualKeks = require('./handlers/hears/virtualKeks');
const userFile = require('./handlers/admin/exportUser');
const adminPanel = require('./handlers/admin/adminPanel');
const addKinoStart = require('./handlers/admin/addKinoStart');
const deleteKinoStart = require('./handlers/admin/deleteKinoStart')
const addKanalStart = require('./handlers/admin/addKanalStart');
const addDeleteUser = require('./handlers/admin/addDeleteUser');
const addStatistika = require('./handlers/admin/hisobotStart')
const { startVipPost } = require('./commands/saveImage');
const orqagaAdmin = require('./handlers/hears/adminOrqagaStart');
const channelList = require('./handlers/admin/channelListStart')
const xabarYuborishniBoshlash = require('./handlers/admin/xabarYuborishStart');
const xabarlarniTozalash = require('./handlers/admin/clearYuborganXabarni');
const videoManzilSoraladi = require('./handlers/admin/videoManzilSorash');
const videoManzilKorsatish = require('./handlers/admin/addVideoManzilStart');

bot.hears('🎬 Kino topish', onKinoTopish);
bot.hears('🎥 Video yuborish', onVideoYuborish);
bot.hears('💸 VIP KANALGA QOSHILISH 💸', vipKanal);
//bot.hears('🎁 Virtual keks', virtualKeks);
// bot.hears('📊 Darajam', darajam);
//bot.hears('🛠 Admin bo‘limi', adminPanel);
bot.hears('🎥 Kino qo‘shish', addKinoStart);
bot.hears('🗑 Kino o‘chirish', deleteKinoStart);
bot.hears('➕ Kanal qo‘shish', addKanalStart);
bot.hears('📋 Kanallar', channelList);
bot.hears('📢 Xabar yuborish', xabarYuborishniBoshlash);
bot.hears('🧼 Xabarlarni tozalash', xabarlarniTozalash);
bot.hears('💾 Video qabul qilish', videoManzilSoraladi);
bot.hears('📀 Manzil', videoManzilKorsatish);
bot.hears('📊 Statistika', addStatistika);
bot.hears('💾 Userlarni olish', userFile);
bot.hears('📷 Vipsaqlash', startVipPost)
bot.hears('👤 Foydalanuvchini o‘chirish', addDeleteUser);
bot.hears('⬅️ Orqaga', orqagaAdmin);

bot.command('niyozbek', adminPanel);
//bot.command('saveimage', saveImage)
//bot.command('file', userFile)
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