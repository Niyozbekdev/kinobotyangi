const { Markup } = require('telegraf');

//Bosh menyu klaviaturasi
const boshMenyu = () => {
    try {
        return Markup.keyboard([
            ['🎬 Kino topish', '🎥 Video yuborish']// '📞 Bog‘lanish'],
            //['🛠 Admin bo‘limi']
        ]).resize();
    } catch (err) {
        console.error("Mainkeyboarda", err)
    }
}

module.exports = boshMenyu;