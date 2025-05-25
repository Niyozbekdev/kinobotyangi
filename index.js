const connectDB = require('./utils/connectDB');
const bot = require('./bot');

(async () => {
    await connectDB();   // Mongo bazaga ulanadi
    bot.launch();        // Bot endi ishga tushadi
})()