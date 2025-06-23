const SentMessage = require('../../models/SendMessage');
const AdminState = require('../../models/AdminState');
const User = require('../../models/User');

// Sleep funksiyasi
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const xabarniYuborish = async (ctx) => {
    try {
        const state = await AdminState.findOne({ admin_id: ctx.from.id });
        if (!state || state.step !== 'confirm_broadcast') return;

        const users = await User.find({ is_blocked: false });
        const { temp_title, temp_file_id, temp_button_text, temp_button_url } = state;
        const messageText = temp_title?.trim() || "Yangi xabar";

        let yuborildi = 0;
        let yuborilmadi = 0;

        // Inline tugma qo‘shish
        const replyMarkup = temp_button_text && temp_button_url ? {
            inline_keyboard: [[{ text: temp_button_text, url: temp_button_url }]]
        } : undefined;

        // Message, Photo, Video uchun umumiy options
        const opts = {
            caption: temp_title,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
        };

        //Foydalanuvchilarni 25 tadan bo'lamiz gurughlarga
        const chunkSize = 25
        for (let i = 0; i < users.length; i += chunkSize) {
            const chunk = users.slice(i, i + chunkSize);

            //Har bir foydalanuvchiga xabar yuborish paralel ravishda
            await Promise.allSettled(chunk.map(async (users) => {
                try {
                    let sentMsg;

                    if (temp_file_id?.startsWith('AgAC') || temp_file_id?.startsWith('CQAC')) {
                        // Rasm
                        sentMsg = await ctx.telegram.sendPhoto(users.user_id, temp_file_id, opts);
                    } else if (temp_file_id) {
                        // Video
                        sentMsg = await ctx.telegram.sendVideo(users.user_id, temp_file_id, opts);
                    } else {
                        // Matnli xabar
                        sentMsg = await ctx.telegram.sendMessage(users.user_id, messageText, {
                            parse_mode: 'HTML',
                            reply_markup: replyMarkup
                        });
                    }

                    // 📌 Xabar ID ni saqlaymiz
                    await SentMessage.create({
                        user_id: users.user_id,
                        message_id: sentMsg.message_id,
                    });

                    yuborildi++;
                } catch (err) {
                    yuborilmadi++;

                    // 403 - bot bloklangan
                    if (err.code === 403) {
                        await User.updateOne(
                            { user_id: users.user_id },
                            { is_blocked: true }
                        );

                        // 400 - noto‘g‘ri format yoki ID
                    } else if (err.code === 400) {
                        console.warn(`⚠️ 400 xato: ${users.user_id}`);

                        // 429 - Juda ko‘p so‘rov
                    } else if (err.code === 429) {
                        const wait = err.parameters?.retry_after || 3;
                        console.warn(`⏳ 429 xato: ${users.user_id} - ${wait}s kutamiz`);
                        await delay(wait * 1000);

                        // Nomalum xato
                    } else {
                        console.error(`❌ Nomaʼlum xato (user: ${users.user_id}):`, err.message);
                    }
                }
            }));
            await sleep(1000);
        }

        // Statistikani yakuniy chiqarish
        const bloklanganlar = await User.countDocuments({ is_blocked: true });
        await AdminState.deleteOne({ admin_id: ctx.from.id });

        await ctx.editMessageText(
            `📬 Xabar yuborildi.\n\n✅ Yuborildi: ${yuborildi} ta\n❌ Yuborilmadi: ${yuborilmadi} ta\n🚫 Botni bloklaganlar: ${bloklanganlar} ta`
        );

    } catch (err) {
        console.error("❌ xabarniYuborish xatosi:", err.message);
        await ctx.reply("Xatolik: xabarni yuborish muvaffaqiyatsiz bo‘ldi.");
    }
};

module.exports = xabarniYuborish;