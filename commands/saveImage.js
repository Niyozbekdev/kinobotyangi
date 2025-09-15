const VipAdminState = require('../models/VipAdminSchema');   // ✅ faqat VIP uchun state
const VipPost = require('../models/VipPost');               // ✅ saqlanadigan post modeli
const { Markup } = require('telegraf');

const MAX_IMAGES = 10;

// 🔹 Media group (albom) vaqtinchalik cache
const mediaGroupsCache = {};
const MAX_CAPTION_LENGTH = 1024;

// ⏳ Progress bar generatsiya qiluvchi funksiya
// function makeProgressBar(total, remaining, length = 20) {
//     const percent = (remaining / total);
//     const filled = Math.round(length * percent);
//     const empty = length - filled;
//     return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${remaining}s`;

/**
 * 📤 Admin "VIP Post" tugmasini bosganda jarayonni boshlash
 */
async function startVipPost(ctx) {
    try {
        const adminId = ctx.from.id;

        // State yangilash yoki yaratish
        await VipAdminState.findOneAndUpdate(
            { admin_id: adminId },
            {
                step: 'vip_post',
                vip_post: [],
                last_preview_msg_ids: [],
                updated_at: new Date(),
                expireAt: new Date(Date.now() + 60 * 1000) //Mudati yana 1 daqiqaga uzayadi
            },
            { upsert: true, new: true }
        );

        let msg = await ctx.reply(`📤 VIP post yaratish boshlandi.\n➡️ 10 tagacha rasm yuborishingiz mumkin undan ko'p bo'lsa hisoblanmaydi. \n\n ❗️Iltimos rasmga caption yozsangiz birinchi rasm tagiga yozing bo'lmasa qushilmaydi caption.`);

        //Countdown
        let remaining = 120;
        const timer = setInterval(async () => {
            remaining -= 5;
            if (remaining > 0) {
                try {
                    await ctx.telegram.editMessageText(
                        ctx.chat.id,
                        msg.message_id,
                        undefined,
                        `📤 VIP post yaratish boshlandi. \n━━━━⏳ Qolgan vaqt: ${remaining} s━━━━\n➡️ 10 tagacha rasm yuborishingiz mumkin undan ko'p bo'lsa hisoblanmaydi. \n\n ❗️Iltimos rasmga caption yozsangiz birinchi rasm tagiga yozing bo'lmasa qushilmaydi caption.`
                    );
                } catch (err) {
                    console.error("editMessageText error:", err.message);
                }
            } else {
                clearInterval(timer);
                try {
                    await ctx.telegram.editMessageText(
                        ctx.chat.id,
                        msg.message_id,
                        undefined,
                        "🗣 Vaqt tugadi, VIP post yaratish bekor qilindi \n✅ Qayta urning."
                    );
                } catch (_) { }
                // State ham tozalanadi
                await VipAdminState.deleteOne({ admin_id: adminId });
            }
        }, 5000);

    } catch (err) {
        console.error('startVipPost error:', err);
        await ctx.reply('❌ Xatolik. Qayta urinib ko‘ring.');
    }
}

/**
 * 🖼 Admin rasm yuborganda
 */


const handleVipPhoto = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const photos = ctx.message.photo;
        if (!photos || photos.length === 0) return;

        const fileId = photos[photos.length - 1].file_id;
        const caption = ctx.message.caption || '';
        const mediaGroupId = ctx.message.media_group_id;

        // 🔎 Caption uzunligini tekshiramiz
        if (caption.length > MAX_CAPTION_LENGTH) {
            await ctx.reply(
                `⚠️ Caption juda uzun(${caption.length} belgi).\nIltimos, ${MAX_CAPTION_LENGTH} belgidan kamroq matn yozing.`
            );
            return; // saqlamaymiz
        }


        //let state = await VipAdminState.findOne({ admin_id: userId });
        let state = await VipAdminState.findOne({ admin_id: userId });
        if (!state || state.step !== "vip_post") return;

        // === Albom (media_group) holati ===
        if (mediaGroupId) {
            if (!mediaGroupsCache[mediaGroupId]) {
                mediaGroupsCache[mediaGroupId] = { images: [], caption, ctx, userId, timer: null };
            }

            mediaGroupsCache[mediaGroupId].images.push({ file_id: fileId, caption });

            if (!mediaGroupsCache[mediaGroupId].timer) {
                // 1.5 soniyadan keyin albom to‘liq yig‘ilib preview chiqariladi
                mediaGroupsCache[mediaGroupId].timer = setTimeout(async () => {
                    try {
                        const { images, caption, ctx, userId } = mediaGroupsCache[mediaGroupId];

                        if (images.length > MAX_IMAGES) {
                            await ctx.reply('❌ Maksimal 10 ta rasm yuklashingiz mumkin.');
                            delete mediaGroupsCache[mediaGroupId];
                            return;
                        }

                        // Oldingi preview’larni o‘chirish
                        if (state.last_preview_msg_ids?.length) {
                            for (let msgId of state.last_preview_msg_ids) {
                                try { await ctx.deleteMessage(msgId); } catch (_) { }
                            }
                        }

                        // Preview yuborish
                        const sentMessages = await ctx.replyWithMediaGroup(
                            images.map((img, idx) => ({
                                type: 'photo',
                                media: img.file_id,
                                caption: idx === 0 ? caption : undefined
                            }))
                        );

                        await ctx.reply(`👀 Foydalanuvchilarga 👆 shunaqa tarzda ko'rinadi.`)
                        const actionMessage = await ctx.reply(
                            '✅ Agar tayyor bo‘lsa, VIP postni saqlang yoki bekor qiling.',
                            Markup.inlineKeyboard([
                                [Markup.button.callback('💾 Saqlash', 'vip_save')],
                                [Markup.button.callback('❌ Bekor qilish', 'vip_cancel')]
                            ])
                        );

                        // State yangilash
                        await VipAdminState.updateOne(
                            { admin_id: userId },
                            {
                                $set: {
                                    vip_post: images.map((img, idx) => ({
                                        file_id: img.file_id,
                                        caption: idx === 0 ? caption : ''
                                    })),
                                    last_preview_msg_ids: [
                                        ...sentMessages.map(m => m.message_id),
                                        actionMessage.message_id
                                    ],
                                    updated_at: new Date()
                                }
                            }
                        );

                    } catch (err) {
                        console.error('Albom preview xatolik:', err);
                        await ctx.reply('❌ Albom preview chiqarishda xatolik yuz berdi.');
                    } finally {
                        delete mediaGroupsCache[mediaGroupId];
                    }
                }, 1500);
            }

            // === Bitta rasm holati ===
        } else {
            if (state.last_preview_msg_ids?.length) {
                for (let msgId of state.last_preview_msg_ids) {
                    try { await ctx.deleteMessage(msgId); } catch (_) { }
                }
            }

            const sentMessage = await ctx.replyWithPhoto(fileId, { caption });

            await ctx.reply(`👀 Foydalanuvchilarga 👆 shunaqa tarzda ko'rinadi.`)
            const actionMessage = await ctx.reply(
                '✅ Agar tayyor bo‘lsa, VIP postni saqlang yoki bekor qiling.',
                Markup.inlineKeyboard([
                    [Markup.button.callback('💾 Saqlash', 'vip_save')],
                    [Markup.button.callback('❌ Bekor qilish', 'vip_cancel')]
                ])
            );

            await VipAdminState.updateOne(
                { admin_id: userId },
                {
                    $set: {
                        vip_post: [{ file_id: fileId, caption }],
                        last_preview_msg_ids: [sentMessage.message_id, actionMessage.message_id],
                        updated_at: new Date()
                    }
                }
            );
        }

    } catch (err) {
        console.error('handleVipPhoto error:', err);
        await ctx.reply('❌ Rasmni qayta yuboring. Xatolik yuz berdi.');
    }
};

/**
 * 💾 Saqlash tugmasi
 */
async function saveVipPost(ctx) {
    try {
        const adminId = ctx.from.id;
        const state = await VipAdminState.findOne({ admin_id: adminId });

        if (!state || state.step !== 'vip_post') {
            await ctx.answerCbQuery('❌ Jarayon topilmadi.');
            return;
        }

        const images = state.vip_post || [];
        if (images.length === 0) {
            await ctx.answerCbQuery('⚠️ Rasm yo‘q.');
            return;
        }

        await VipPost.deleteMany({});
        // Yangi VIP postni DB ga saqlash
        await VipPost.create({
            images,
            created_by: adminId,
            is_active: true
        });

        // State tozalash
        await VipAdminState.deleteOne({ admin_id: adminId });

        await ctx.editMessageText(`✅ VIP post saqlandi! \n🖼 Rasmlar soni: ${images.length}`);

    } catch (err) {
        console.error('saveVipPost error:', err);
        await ctx.reply('❌ Saqlashda xatolik qaytadan urning.');
    }
}

/**
 * ❌ Bekor tugmasi
 */
/**
 * ❌ Bekor tugmasi
 */
async function cancelVipPost(ctx) {
    try {
        const adminId = ctx.from.id;

        // State’ni topamiz
        const state = await VipAdminState.findOne({ admin_id: adminId });

        // Agar preview xabarlar bo‘lsa → o‘chirib tashlaymiz
        if (state?.last_preview_msg_ids?.length) {
            for (let msgId of state.last_preview_msg_ids) {
                try {
                    await ctx.deleteMessage(msgId);
                } catch (err) {
                    console.error(`❌ Xabarni o‘chirishda xatolik (msgId=${msgId}):`, err);
                }
            }
        }

        // State’ni tozalash
        await VipAdminState.deleteOne({ admin_id: adminId });

        // Callback tugmani o‘zgartirish (agar edit qilish imkoni bo‘lsa)
        try {
            await ctx.editMessageText('🚫 VIP post yaratish bekor qilindi.');
        } catch {
            // Agar tugma xabari allaqachon o‘chirilgan bo‘lsa → oddiy reply yuboramiz
            await ctx.reply('🚫 VIP post yaratish bekor qilindi.');
        }

    } catch (err) {
        console.error('cancelVipPost error:', err);
        await ctx.reply('❌ Bekor qilishda xatolik.');
    }
}

module.exports = { startVipPost, handleVipPhoto, saveVipPost, cancelVipPost };