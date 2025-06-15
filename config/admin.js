require('dotenv').config();


const config = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    DB_URI: process.env.DB_URI,
    // ADMIN_ID: parseInt(process.env.ADMIN_ID)
    ADMIN_ID: process.env.ADMIN_ID.split(',').map(id => Number(id.trim()))
};

module.exports = config;