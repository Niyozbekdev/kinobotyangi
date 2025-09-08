const AdminState = require('../models/AdminState'); // AdminState modelini import qilamiz
const VipPost = require('../models/imageSchema');       // VipPost modelini import qilamiz
const { Markup } = require('telegraf');

const MAX_IMAGES = 10; // Bir post uchun maksimal 10 ta rasm

/**
 * Admin "VIP Post" tugmasini bosganda jarayonni boshlash
 */
async function startVipPost(ctx) {
    try {
        const adminId = ctx.from.id;

        // Admin uchun yangi state yaratamiz yoki mavjudini yangilaymiz
        await AdminState.findOneAndUpdate(
            { admin_id: adminId },
            {
                step: 'vip_post',            // qadamni belgilaymiz
                data: { images: [] },        // vaqtinchalik rasmlar saqlanadi
                updated_at: new Date()
            },
            { upsert: true, new: true }
        );

        // Admin’ga xabar yuboramiz
        await ctx.reply('📤 VIP post yaratish boshlandi.\n➡️ 1–10 ta rasm yuboring.');
    } catch (err) {
        console.error('startVipPost error:', err);
        await ctx.reply('❌ Xatolik. Qayta urinib ko‘ring.');
    }
}

/**
 * Admin rasm yuborganida ishlovchi funksiya
 */

// Albomlarni vaqtincha yig‘ib turish uchun cache (RAM)
// Global cache (albom rasmlarini vaqtincha yig‘ib turadi)
const mediaGroupsCache = {};

/**
 * Admin tomonidan yuborilgan rasmlarni qayta ishlash
 * - Bitta rasm bo‘lsa → oddiy photo preview
 * - Bir nechta rasm albom bo‘lsa → cache orqali faqat 1 marta preview
 */
const handleVipPhoto = async (ctx) => {
    try {
        const userId = ctx.from.id;
        const photos = ctx.message.photo;

        if (!photos || photos.length === 0) return;

        // Telegram eng katta sifatli rasmni oxirgi qilib yuboradi
        const fileId = photos[photos.length - 1].file_id;
        const caption = ctx.message.caption || "";
        const mediaGroupId = ctx.message.media_group_id;

        // AdminState olish
        let state = await AdminState.findOne({ admin_id: userId });
        if (!state) return;

        // 1) Agar admin albom yuborgan bo‘lsa
        if (mediaGroupId) {
            // Cache ichida massiv yaratamiz (agar yo‘q bo‘lsa)
            if (!mediaGroupsCache[mediaGroupId]) {
                mediaGroupsCache[mediaGroupId] = { images: [], timer: null, ctx, userId };
            }

            // Rasmlarni cache massiviga qo‘shish
            mediaGroupsCache[mediaGroupId].images.push({ file_id: fileId, caption });

            // Timer birinchi marta ishlaydi (takrorlanmaydi)
            if (!mediaGroupsCache[mediaGroupId].timer) {
                mediaGroupsCache[mediaGroupId].timer = setTimeout(async () => {
                    try {
                        const { images, ctx, userId } = mediaGroupsCache[mediaGroupId];

                        // Agar 10 tadan oshsa, limit qo‘yamiz
                        if (images.length > 10) {
                            await ctx.reply("❌ Maksimal 10 ta rasm yuklashingiz mumkin.");
                            delete mediaGroupsCache[mediaGroupId];
                            return;
                        }

                        // Avvalgi previewlarni o‘chirish
                        if (state.data.last_preview_msg_ids) {
                            for (let msgId of state.data.last_preview_msg_ids) {
                                try {
                                    await ctx.deleteMessage(msgId);
                                } catch (_) { }
                            }
                        }

                        // Preview yuborish (albom ko‘rinishda)
                        const sentMessages = await ctx.replyWithMediaGroup(
                            images.map((img, idx) => ({
                                type: "photo",
                                media: img.file_id,
                                caption: idx === 0 ? "📸 VIP post preview\n\nUserlarga shunday ko‘rinadi." : undefined
                            }))
                        );

                        // Saqlash / Bekor tugmalari
                        const actionMessage = await ctx.reply(
                            "✅ Agar tayyor bo‘lsa, VIP postni saqlang yoki bekor qiling.",
                            Markup.inlineKeyboard([
                                [Markup.button.callback("💾 Saqlash", "save_vip_post")],
                                [Markup.button.callback("❌ Bekor qilish", "cancel_vip_post")]
                            ])
                        );

                        // AdminState yangilash
                        state.data.vip_post = images;
                        state.data.last_preview_msg_ids = [
                            ...sentMessages.map(m => m.message_id),
                            actionMessage.message_id
                        ];
                        await state.save();

                    } catch (err) {
                        console.error("Alb om previewda xatolik:", err);
                        await ctx.reply("❌ Albom preview chiqarishda xatolik yuz berdi.");
                    } finally {
                        // Cache tozalash
                        delete mediaGroupsCache[mediaGroupId];
                    }
                }, 1500); // 1.5s kutib, faqat 1 marta preview qiladi
            }
        } else {
            // 2) Agar admin faqat 1 ta rasm yuborgan bo‘lsa
            // Avvalgi previewlarni o‘chirish
            if (state.data.last_preview_msg_ids) {
                for (let msgId of state.data.last_preview_msg_ids) {
                    try {
                        await ctx.deleteMessage(msgId);
                    } catch (_) { }
                }
            }

            // Preview yuborish
            const sentMessage = await ctx.replyWithPhoto(fileId, {
                caption: "📸 VIP post preview\n\nUserlarga shunday ko‘rinadi."
            });

            // Saqlash / Bekor tugmalari
            const actionMessage = await ctx.reply(
                "✅ Agar tayyor bo‘lsa, VIP postni saqlang yoki bekor qiling.",
                Markup.inlineKeyboard([
                    [Markup.button.callback("💾 Saqlash", "save_vip_post")],
                    [Markup.button.callback("❌ Bekor qilish", "cancel_vip_post")]
                ])
            );

            // AdminState yangilash
            state.data.vip_post = [{ file_id: fileId, caption }];
            state.data.last_preview_msg_ids = [sentMessage.message_id, actionMessage.message_id];
            await state.save();
        }

    } catch (err) {
        console.error("VIP photo xatolik:", err);
        await ctx.reply("❌ Rasmni qayta yuboring. Xatolik yuz berdi.");
    }
};



/**
 * Admin "✅ Saqlash" tugmasini bosganda
 */
async function saveVipPost(ctx) {
    try {
        const adminId = ctx.from.id;

        // State ni olish
        const state = await AdminState.findOne({ admin_id: adminId });

        if (!state || state.step !== 'vip_post') {
            await ctx.answerCbQuery('❌ Jarayon topilmadi.');
            return;
        }

        const images = state.data.images || [];

        if (images.length === 0) {
            await ctx.answerCbQuery('⚠️ Rasm yo‘q.');
            return;
        }

        // Yangi VIP postni bazaga yozamiz
        await VipPost.create({
            images,
            created_by: adminId,
            is_active: true
        });

        // AdminState ni o‘chiramiz
        await AdminState.deleteOne({ admin_id: adminId });

        // Callback tugmasi xabarini o‘zgartiramiz
        await ctx.editMessageText(`✅ VIP post saqlandi! 🖼 Rasm soni: ${images.length}`);
    } catch (err) {
        console.error('saveVipPost error:', err);
        await ctx.reply('❌ Saqlashda xatolik.');
    }
}

/**
 * Admin "❌ Bekor qilish" tugmasini bosganda
 */
async function cancelVipPost(ctx) {
    try {
        const adminId = ctx.from.id;

        // AdminState ni o‘chiramiz
        await AdminState.deleteOne({ admin_id: adminId });

        // Callback tugmasi xabarini o‘zgartiramiz
        await ctx.editMessageText('🚫 VIP post yaratish bekor qilindi.');
    } catch (err) {
        console.error('cancelVipPost error:', err);
        await ctx.reply('❌ Bekor qilishda xatolik.');
    }
}

module.exports = {
    startVipPost,
    handleVipPhoto,
    saveVipPost,
    cancelVipPost
};