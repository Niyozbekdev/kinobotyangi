const { Markup } = require('telegraf');
const User = require('../models/User');

//Bosh menyu klaviaturasi
const boshMenyu = () => {
    return Markup.keyboard([
        ['🎬 Kino topish', '📞 Bog‘lanish'],
        ['🛠 Admin bo‘limi']
    ]).resize();
}

//Start logikasi istalgan joydan chaqrish mumkinn
const handleStart = async (ctx) => {

    const { id, username, first_name } = ctx.from;

    //Foydalanuvchini bazaga saqlash yoki mavjud bulsa o'zgartirish
    const tekshirishUser = await User.findOne({ user_id: id });
    if (tekshirishUser) {
        tekshirishUser.status = 'active';
        await tekshirishUser.save();
        ctx.reply('Yana qaytingiz ' + ctx.chat.first_name);
    } else {
        const newUser = new User({
            user_id: id,
            username,
            first_name
        });
        await newUser.save();

        ctx.reply(`Assalomu alaykum, ${first_name}! hush kelibsiz`,
            Markup.keyboard([
                ['🎬 Kino topish', '📞 Bog‘lanish'],
                ['🛠 Admin bo‘limi']
            ]).resize()
        )
    }
}



//Start komandasi bosilganda shu buladi Asosiy menyu
const startCommand = async (bot) => {
    await bot.start(handleStart); //Start komandasi
}

module.exports = {
    startCommand,
    boshMenyu,
    handleStart //Istalgan joyda import qilish uchun
}



