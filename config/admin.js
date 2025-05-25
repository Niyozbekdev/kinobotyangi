require('dotenv').config();


const config = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    DB_URI: process.env.DB_URI,
    ADMIN_ID: parseInt(process.env.ADMIN_ID)
};

module.exports = config;