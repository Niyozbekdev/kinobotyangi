const connectDB = require('./utils/connectDB');
const bot = require('./bot');

(async () => {

    await connectDB();   // Mongo bazaga ulanadi
    //Webhookni tozalash
    bot.telegram.deleteWebhook().then(() => {
        bot.launch();       // Bot endi ishga tushadi polling rejmida
    })

})();