require("dotenv").config();
const { Telegraf, Markup, session } = require("telegraf");
const ulanishDb = require('./db')
const User = require('./models/User')
const Kino = require('./models/Kino')
const AdminState = require('./models/AdminState');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session())
ulanishDb()

const admin = 6730238086;

bot.start(async (stx) => {
    const { id, username, first_name } = stx.from;

    //Foydalanuvchini bazaga saqlash yoki mavjud bulsa o'zgartirish
    const tekshirishUser = await User.findOne({ user_id: id });
    if (tekshirishUser) {
        tekshirishUser.status = 'active';
        await tekshirishUser.save();
        stx.reply('Yana qaytingiz ' + stx.chat.first_name);
    } else {
        const newUser = new User({
            user_id: id,
            username,
            first_name
        });
        await newUser.save();

        stx.reply(`Assalomu alaykum, ${first_name}! hush kelibsiz`,
            Markup.keyboard([
                ['🎬 Kino topish', '📞 Bog‘lanish'],
                ['🛠 Admin bo‘limi']
            ]).resize()
        )
    }
})

bot.hears('🛠 Admin bo‘limi', async (ctx) => {
    const userId = ctx.from.id;

    // Faqat admin kira oladi
    if (userId !== admin) return ctx.reply('❌ Siz admin emassiz');

    // Admin bo‘limi tugmalari
    await ctx.reply('🛠 Admin bo‘limiga xush kelibsiz. Quyidagi amallardan birini tanlang:',
        Markup.keyboard([
            ['🎥 Kino qo‘shish', '🗑 Kino o‘chirish'],
            ['📊 Statistika',],
            ['⬅️ Orqaga']
        ]).resize()
    );
});


// Kino qo‘shish tugmasi bosilganda
bot.hears('🎥 Kino qo‘shish', async (ctx) => {
    try {

        if (ctx.from.id !== admin) return ctx.reply("❌ Siz admin emassiz");

        await AdminState.findOneAndUpdate(
            { admin_id: ctx.from.id },
            { step: "waiting_for_video", updated_at: new Date() },
            { upsert: true }
        );

        await ctx.reply("🎬 Yuklamoqchi bulgan videoni yuboring", {
            parse_mode: "Markdown"
        });


    } catch (error) {
        console.error('AdminStatni saqlashda xato', error);
        return ctx.reply("Ichki xatolik yuz berdi")
    }

});



//Video qabul qiladigan holat
bot.on('video', async (ctx) => {
    const userId = ctx.from.id;
    if (userId !== admin) return;

    const state = await AdminState.findOne({ admin_id: userId });

    if (!state || state.step !== 'waiting_for_video') return;

    const kino = ctx.message?.video ||
        ctx.message?.reply_to_message?.video ||
        (ctx.message?.forward_from && ctx.message.video);

    if (!kino) return ctx.reply('Bu video emas boshqa narsa');

    await AdminState.findOneAndUpdate(
        { admin_id: userId },
        {
            step: 'waiting_for_title',
            temp_file_id: kino.file_id
        }
    );

    return ctx.reply('📌 Kinoning nomini yuboring', { parse_mode: 'Markdown' });
});


bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const state = await AdminState.findOne({ admin_id: userId });

    if (!state) return ctx.reply('Kerakli tugmani tanlang');

    if (state.step === 'waiting_for_title') {
        await AdminState.findOneAndUpdate(
            { admin_id: userId },
            {
                step: 'waiting_for_code',
                temp_title: ctx.message.text
            }
        );
        return ctx.reply('🆔 Endi kino *kodini* kiriting. (Masalan: 101)', { parse_mode: 'Markdown' });
    }

    //Bu oldingi bulimlarni tekshirib bu kodlarni uqishga imkon beradi
    if (state.step === 'waiting_for_code') {
        //Bu kod yuborganda raqam yoki yuqligini tekshiradi
        const code = ctx.message.text.trim();
        if (!/^\d+$/.test(code)) return ctx.reply(`❌ Xato: Kod faqat raqamlar iborat bo'lish kerak`)

        //Bu kod yuborganda bazada bor yoki yuqligini tekshiradi
        const exists = await Kino.findOne({ code });
        if (exists) {
            return ctx.reply('🚫 Bu kodli kino allaqachon mavjud.');
        }

        //Bu kiononi bazaga saqlaydi
        const newMovie = new Kino({
            code,
            title: state.temp_title,
            file_id: state.temp_file_id
        });
        await newMovie.save();

        //Bu admin video yuklab bulgandan so'ng AdminStateni tozalaydi bazadan
        await AdminState.deleteOne({ admin_id: userId });

        return ctx.reply(`✅ Kino saqlandi:\n🎬 *${state.temp_title}*\n🆔 Kod: *${code}*`, {
            parse_mode: 'Markdown'
        });
    }
});


bot.launch();
























































// Shu yerning ichida on('video') emas, bot.on() global ishlaydi. Shuning uchun quyidagi kod alohida bo‘ladi 👇
// bot.on('video', async (ctx) => {
//     const userId = ctx.from.id;

//     // Faqat admin yuklashi mumkin
//     if (userId !== admin) return;

//     // AdminState tekshiruv
//     const state = await AdminState.findOneAndUpdate(
//         { admin_id: ctx.from.id },
//         { step: 'waiting_for_movie_upload', updated_at: new Date() },
//         { upsert: true, new: true }
//     );

//     console.log("AdminState updated:", state);

//     const video = ctx.message.video;
//     const caption = ctx.message.caption;

//     // Forward qilingan bo‘lsa ham ishlaydi
//     if (!video || !caption) {
//         return ctx.reply("❗️Iltimos, caption bilan video yuboring. Masalan:\n\n`123 - Avatar`", {
//             parse_mode: "Markdown"
//         });
//     }

//     const [code, ...titleParts] = caption.split('-');
//     const codeClean = code.trim();
//     const title = titleParts.join('-').trim();

//     if (!codeClean || !title) {
//         return ctx.reply("❗️Format noto‘g‘ri. Masalan:\n`123 - Avatar`");
//     }

//     const existing = await Kino.findOne({ code: codeClean });
//     if (existing) return ctx.reply("❌ Bu kodli kino allaqachon mavjud");

//     const kino = new Kino({
//         code: codeClean,
//         title,
//         file_id: video.file_id
//     });

//     await kino.save();

//     // Stepni tozalaymiz
//     await AdminState.findOneAndDelete({ admin_id: userId });

//     return ctx.reply(`✅ Kino muvaffaqiyatli saqlandi:\n🎬 ${title} (${codeClean})`);
// });











// //Admin kino yuklaydi
// bot.on('video', async (stx) => {

//     const userId = stx.from.id;

//     if (stx.session?.step === 'waiting_for_movie_upload') {

//         if (userId !== admin) stx.reply('Siz admin emasiz kino botga qushilmaydi');

//         const video = stx.message.video;
//         const caption = stx.message.caption;

//         if (!video || !caption) {
//             return stx.reply(`Iltimos, video va caption shunday ko'rinishda yuboring:\n\n101 - Titanik`)
//         }


//         const [code, ...titleParts] = caption.split('-');
//         const codeClean = code.trim();
//         const title = titleParts.join('-').trim();

//         if (!codeClean || !title) return stx.reply('Format: kod - nom, Masalan: `101 - Titanic`');

//         const exist = await Kino.findOne({ code: codeClean });
//         if (exist) return stx.reply('Bu kod allaqachon mavjud');

//         //Bazaga saqlash
//         const kino = new Kino({
//             code: codeClean,
//             title,
//             file_id: video.file_id

//         })
//         await kino.save()
//         stx.reply(`Kino "${title}"  (${codeClean}) saqlandi`);
//     }
//     // const video = stx.message.video;
//     // const caption = stx.message.caption || ' 000 - nomsiz';
//     // const [code, ...titleParts] = caption.split('-');
//     // const codeClean = code.trim();
//     // const title = titleParts.join('-').trim();


// });

// //Foydalanuvchi kod yozsa kino yuvoradi
// bot.on('text', async (stx) => {
//     const text = stx.message.text.trim();

//     //Agar bu raqam bulsa
//     if (/^\d+$/.test(text)) {
//         const kino = await Kino.findOne({ code: text, is_deleted: false });

//         if (!kino) return stx.reply('Bunday kodli kino topilmadi');
//         return stx.replyWithVideo(kino.file_id, { caption: kino.title });
//     }



// })


// // bot.hears('Kino', (stx) => stx.reply('Mana sizga kino',
// //     Markup.inlineKeyboard([   //InlineKeyboard bu oynada chiqadigan tugmalar
// //         [Markup.button.callback('Kino topish', 'izla')]
// //     ])
// // ))

// // bot.action('izla', (stx) => {
// //     stx.reply("Kino kodini kiritin")
// // })
// // bot.hears('Malumot', (stx) => stx.reply('Mana sizga malumot'))
// // bot.hears('Statistika', (stx) => stx.reply('Mana sizga statistika'))


