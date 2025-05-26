const { Markup } = require('telegraf')

const adminKeyboard = () => {
    try {
        // Admin bo‘limi tugmalari
        return Markup.keyboard([
            ['🎥 Kino qo‘shish', '🗑 Kino o‘chirish'],
            ['📊 Statistika',],
            ['⬅️ Orqaga']
        ]).resize()

    } catch (err) {
        console.error("AdminKeyboarda", err)
    }
}

module.exports = adminKeyboard;

