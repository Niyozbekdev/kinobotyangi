const User = require('../../models/User');
const Kino = require('../../models/Kino');
const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const statistikaniOlish = async (ctx) => {
    try {
        const admin_id = ctx.from.id;

        // 🛡 Faqat adminlar ko‘rsin
        if (!ADMIN_ID.includes(admin_id)) return;

        // Admin state’ni tozalash
        await AdminState.deleteOne({ admin_id });

        // 👥 Umumiy foydalanuvchilar
        const userCount = await User.countDocuments();

        // 📅 Bugun qo‘shilganlar
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todayUsers = await User.countDocuments({ joined_date: { $gte: startOfToday } });

        // ⚡️ Bugun foydalanganlar
        const todayActive = await User.countDocuments({ last_active_at: { $gte: startOfToday } });

        // ⚡️ So‘nggi 7 kun ichida foydalanganlar
        const last7days = new Date();
        last7days.setDate(last7days.getDate() - 7);
        const active7days = await User.countDocuments({ last_active_at: { $gte: last7days } });

        // ⚡️ So‘nggi 1 oy ichida foydalanganlar
        const last30days = new Date();
        last30days.setDate(last30days.getDate() - 30);
        const active30days = await User.countDocuments({ last_active_at: { $gte: last30days } });

        // 🚫 Botni bloklaganlar
        const bloklanganlar = await User.countDocuments({ is_blocked: true });

        // 🎬 Kino statistikasi
        const kinoCount = await Kino.countDocuments({ is_deleted: false });

        // 🔥 Eng ko‘p ko‘rilgan kino
        const engKopKorilgan = await Kino.findOne({ is_deleted: false })
            .sort({ views: -1 })
            .limit(1);

        // 📊 Javob xabari
        let msg = `📊 <b>STATISTIKA PANELI</b>\n\n`;

        msg += `👤 <b>Foydalanuvchilar:</b>\n`;
        msg += `└ 📌 Jami: <b>${userCount}</b>\n`;
        msg += `└ 🆕 Bugun qo‘shilgan: <b>${todayUsers}</b>\n`;
        msg += `└ ⚡️ Bugun foydalangan: <b>${todayActive}</b>\n`;
        msg += `└ 📆 So‘nggi 7 kun: <b>${active7days}</b>\n`;
        msg += `└ 🗓 So‘nggi 1 oy: <b>${active30days}</b>\n`;
        msg += `└ 🚫 Botni bloklaganlar: <b>${bloklanganlar}</b>\n\n`;

        msg += `🎬 <b>Kino ma’lumotlari:</b>\n`;
        msg += `└ 🎞 Jami kinolar: <b>${kinoCount}</b>\n\n`;

        if (engKopKorilgan) {
            msg += `🔥 <b>Trend kino:</b>\n`;
            msg += `└ 🎬 Nomi: <b>${engKopKorilgan.title}</b>\n`;
            msg += `└ 👁 Ko‘rishlar: <b>${engKopKorilgan.views}</b>\n`;
            msg += `└ 🎯 Video kodi: <b>${engKopKorilgan.code}</b>\n`;
        }

        await ctx.reply(msg, { parse_mode: 'HTML' });

    } catch (err) {
        console.error("❌ Statistikani olishda xato:", err);
        await ctx.reply("❌ Statistikani olishda xatolik yuz berdi.");
    }
};

module.exports = statistikaniOlish;