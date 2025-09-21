// ✅ Global xatoliklarni tutib, crashdan saqlaydi
process.on("uncaughtException", (err) => {
    console.error("❌ Kutilmagan xatolik (uncaughtException):", err.message);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Promise xatoligi (unhandledRejection):", reason);
    process.exit(1);
});

const http = require('http');
const connectDB = require('./utils/connectDB');
const bot = require('./bot');

(async () => {

    //await connectDB();   // Mongo bazaga ulanadi
    // ✅ GLOBAL XATO TUTUVCHI — bu joy muhim!
    bot.catch((err, ctx) => {
        console.error('❌ GLOBAL XATO:', err.message);
        console.log('👤 User ID:', ctx?.from?.id);
        console.log('🔤 Nima yuborgan:', ctx?.message?.text || ctx?.callbackQuery?.data);
    });

    await connectDB();   // Mongo bazaga ulanadi
    bot.launch();       // Bot endi ishga tushadi polling rejmida

    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Bot ishga tushdi');
    }).listen(process.env.PORT || 3050);


})();