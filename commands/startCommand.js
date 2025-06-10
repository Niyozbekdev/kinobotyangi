const User = require('../models/User');
const checkKanalar = require('../handlers/actions/checkKanalar');
const boshMenyu = require('../keyboards/mainKeyboard');
const videoYuborishUser = require('../models/UserVideoYuborish')
const KinoTopishUser = require('../models/User');
//Start logikasi istalgan joydan chaqrish mumkinn
const handleStart = async (ctx) => {
    try {

        const userId = ctx.from.id;
        const referrerId = ctx.startPayload; //Referal kodi
        const { id, username, first_name } = ctx.from;

        const userVideo = await videoYuborishUser.findOne({ user_id: userId });


        //Foydalanuvchini bazaga saqlash yoki mavjud bulsa o'zgartirish
        const tekshirishUser = await User.findOne({ user_id: userId });
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

            if (userVideo) {
                userVideo.step = null;
                await userVideo.save();
            }

            return ctx.reply(`🏠 Bosh menyuga qaytdingiz: ` + ctx.chat.first_name, boshMenyu());
        } else {
            const total = await User.countDocuments();
            const today = new Date().toISOString().split('T')[0];
            const newUser = new User({
                user_id: id,
                username,
                first_name,
                user_number: total + 1,
                joined_date: today,
                referrer_id: referrerId ? Number(referrerId) : null
            });
            await newUser.save();

            return ctx.reply(`👋 Assalomu alaykum, ${first_name}\n ❗️Botdan toliq foydalanish uchun raqamingizni yuboring.`, {
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
        }

        const tekshirKanal = await checkKanalar(ctx);
        if (!tekshirKanal) return;

    } catch (err) {
        if (error.code === 403)
            console.error("HandlerStartda", err)
    }

}
//Start komandasi bosilganda shu buladi Asosiy menyu
const startCommand = async (bot) => {
    try {
        await bot.start(handleStart); //Start komandasi
    } catch (err) {
        console.error("Start comandda", err);
    }
}

module.exports = {
    startCommand,
    handleStart //Istalgan joyda import qilish uchun
}