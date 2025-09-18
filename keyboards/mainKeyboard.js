const { Markup } = require('telegraf');

//Bosh menyu klaviaturasi
const boshMenyu = () => {
    try {
        return Markup.keyboard([
            ['🎬 Kino topish', '🎥 Video yuborish'],// '📞 Bog‘lanish'],
            [`👑 VIP KANALGA QOSHILISH 👑`]
        ]).resize();
    } catch (err) {
        console.error("Mainkeyboarda", err)
    }
}

module.exports = boshMenyu;
