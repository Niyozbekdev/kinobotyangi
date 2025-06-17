const http = require('http');
const connectDB = require('./utils/connectDB');
const bot = require('./bot');

(async () => {

    await connectDB();   // Mongo bazaga ulanadi
    bot.launch();       // Bot endi ishga tushadi polling rejmida

    http.createServer((req, res) => {
        res.writeHead(200)
    }).listen(process.env.Port || 3001);

})();