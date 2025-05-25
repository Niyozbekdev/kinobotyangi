const { Markup } = require('telegraf');

//Bosh menyu klaviaturasi
const boshMenyu = () => {
    return Markup.keyboard([
        ['🎬 Kino topish', '📞 Bog‘lanish'],
        ['🛠 Admin bo‘limi']
    ]).resize();
}

module.exports = boshMenyu;