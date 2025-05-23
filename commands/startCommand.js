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
    try {
        const userId = ctx.from.id;
        const referrerId = ctx.startPayload; //Referal kodi
        const { id, username, first_name, referrer_id, last_active_at } = ctx.from;

        //Foydalanuvchini bazaga saqlash yoki mavjud bulsa o'zgartirish
        const tekshirishUser = await User.findOne({ user_id: id });
        if (tekshirishUser) {
            tekshirishUser.status = 'active';
            tekshirishUser.is_blocked = false; //Bu foydalanuvchini blockdan chiqdi deb hisoblaydi
            await tekshirishUser.save();

            // Telfon raqami yuq buladigan bulsa suraladi
            if (!tekshirishUser.phone_number) {
                return ctx.reply("📲 Botdan toliq foydalanish uchun raqamingizni yuboring", {
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: "📲 Raqamni yuborish",
                                    request_contact: true
                                }
                            ]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
            }

            ctx.reply('Yana qaytingiz ' + ctx.chat.first_name);
        } else {
            const newUser = new User({
                user_id: id,
                username,
                first_name,
                last_active_at,
                referrer_id: referrerId ? Number(referrerId) : null
            });
            await newUser.save();

            return ctx.reply(`Assalomu alaykum, ${first_name}! Hush kelibsiz 👋`, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: "📲 Raqamni yuborish",
                                request_contact: true
                            }
                        ]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });

            ctx.reply(`Assalomu alaykum, ${first_name}! hush kelibsiz`,
                Markup.keyboard([
                    ['🎬 Kino topish', '📞 Bog‘lanish'],
                    ['🛠 Admin bo‘limi']
                ]).resize()
            )
        }
    } catch (error) {
        if (error.code === 403)
            console.log('Foydalnuvchi botni bloklagan')
    }

}





//Start komandasi bosilganda shu buladi Asosiy menyu
const startCommand = async (bot) => {
    await bot.start(handleStart); //Start komandasi
    bot.on('contact', async (ctx) => {
        const userId = ctx.from.id;
        const phone = ctx.message.contact.phone_number;

        await User.findOneAndUpdate(
            { user_id: userId },
            { phone_number: phone, last_active_at: new Date() }
        );

        ctx.reply("✅ Raqamingiz saqlandi.", boshMenyu());
    });
}

module.exports = {
    startCommand,
    boshMenyu,
    handleStart //Istalgan joyda import qilish uchun
}



