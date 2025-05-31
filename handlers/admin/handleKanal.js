const Channel = require('../../models/Channel');
const AdminState = require('../../models/AdminState');

const saveChannelLink = async (ctx) => {
    try {
        const adminId = ctx.from.id;
        const state = await AdminState.findOne({ admin_id: adminId });

        // Holat tekshiruvi
        if (!state || state.step !== 'awaiting_channel_link') return;

        const link = ctx.message.text.trim();

        // Takroriy linkni tekshirish
        const exists = await Channel.findOne({ link });
        if (exists) {
            await AdminState.deleteOne({ admin_id: adminId });
            return ctx.reply("❗️Bu link allaqachon qo‘shilgan.");
        }

        //Hozirgi mavjud kanalarni sonini aniqlaymiz
        const totalChanels = await Channel.countDocuments();
        const number = totalChanels + 1;
        // Faqat Telegram uchun tekshirish lozim bo‘lgan linklar
        const isTelegram = link.startsWith('@') || link.startsWith('https://t.me/');

        if (isTelegram) {
            // @username ni to‘liq link shakliga o‘tkazamiz
            let chatId = link;
            if (link.startsWith('https://t.me/')) {
                chatId = '@' + link.replace('https://t.me/', '').replace('+', '');
            }

            try {
                // Agar chat mavjud bo‘lsa saqlanadi
                await Channel.create({
                    number,
                    link,
                    added_by: adminId,
                    added_at: new Date()
                });

                await AdminState.deleteOne({ admin_id: adminId });
                return ctx.reply(`✅ Telegram kanal/guruh muvaffaqiyatli qo‘shildi:\n${link}`);
            } catch (err) {
                console.error("❌ getChat xatosi:", err.message);
                await AdminState.deleteOne({ admin_id: adminId });
                return ctx.reply("❗️Bunday Telegram kanal yoki guruh topilmadi. Iltimos, to‘g‘ri link yuboring.");
            }
        }

        // Telegram bo‘lmasa (boshqa linklar)
        await Channel.create({
            number,
            link,
            added_by: adminId,
            added_at: new Date()
        });

        await AdminState.deleteOne({ admin_id: adminId });
        return ctx.reply(`✅ Kanal saqlandi: ${link} (tekshirilmaydi)`);

    } catch (err) {
        console.error("❌ Kanal linkni saqlashda xato:", err.message);
        ctx.reply("❗️Kutilmagan xatolik yuz berdi kanal qushishda.");
    }
};

module.exports = saveChannelLink;