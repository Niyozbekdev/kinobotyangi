const http = require('http');
const connectDB = require('./utils/connectDB');
const bot = require('./bot');

(async () => {

    await connectDB();   // Mongo bazaga ulanadi
    // ✅ GLOBAL XATO TUTUVCHI — bu joy muhim!
    bot.catch((err, ctx) => {
        console.error('❌ GLOBAL XATO:', err.message);
        console.log('👤 User ID:', ctx?.from?.id);
        console.log('🔤 Nima yuborgan:', ctx?.message?.text || ctx?.callbackQuery?.data);
    });
    bot.launch();       // Bot endi ishga tushadi polling rejmida

    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Bot ishga tushdi');
    }).listen(process.env.PORT || 3150);
})();