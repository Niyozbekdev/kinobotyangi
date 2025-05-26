const connectDB = require('./utils/connectDB');
const bot = require('./bot');

(async () => {
    try {
        await connectDB();   // Mongo bazaga ulanadi
        bot.launch();        // Bot endi ishga tushadi
    } catch (err) {
        console.error("Index.js consol", err)
    }
})()