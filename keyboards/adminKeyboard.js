const { Markup } = require('telegraf')

const adminKeyboard = () => {
    // Admin bo‘limi tugmalari
    return Markup.keyboard([
        ['🎥 Kino qo‘shish', '🗑 Kino o‘chirish'],
        ['📊 Statistika',],
        ['⬅️ Orqaga']
    ]).resize()

}

module.exports = adminKeyboard;

