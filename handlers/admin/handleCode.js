const AdminState = require('../../models/AdminState');
const Kino = require('../../models/Kino');

const codeHandler = async (ctx) => {
    const userId = ctx.from.id;
    const state = await AdminState.findOne({ admin_id: userId });
    //Bu oldingi bulimlarni tekshirib bu kodlarni uqishga imkon beradi
    if (state.step === 'waiting_for_code') {
        //Bu kod yuborganda raqam yoki yuqligini tekshiradi
        const code = ctx.text.trim();
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

        return ctx.reply(`✅ Kino saqlandi:\n🎬 Kino ${state.temp_title}\n🆔 Kod: ${code}`, {
            parse_mode: 'HTML'
        });
    }
}

module.exports = codeHandler;