const { Markup } = require('telegraf')

const adminKeyboard = () => {
    try {
        // Admin bo‘limi tugmalari
        return Markup.keyboard([
            ['🎥 Kino qo‘shish', '🗑 Kino o‘chirish'],
            ['➕ Kanal qo‘shish', '📋 Kanallar'],
            ['📢 Xabar yuborish'],
            ['📊 Statistika'],
            ['⬅️ Orqaga']
        ]).resize()

    } catch (err) {
        console.error("AdminKeyboarda", err)
    }
}

module.exports = adminKeyboard;

