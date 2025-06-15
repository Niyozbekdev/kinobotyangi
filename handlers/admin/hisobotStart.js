const User = require('../../models/User');
const Kino = require('../../models/Kino');
const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const statistikaniOlish = async (ctx) => {
    try {
        const admin_id = ctx.from.id;
        if (!ADMIN_ID.includes(ctx.from.id)) return;

        await AdminState.deleteOne({ admin_id: admin_id })

        const userCount = await User.countDocuments();
        // 📲 Contact (raqami) bor foydalanuvchilar
        const usersWithPhone = await User.countDocuments({
            phone_number: { $exists: true, $ne: null }
        });
        const today = new Date().toISOString().split('T')[0];
        const todayUsers = await User.countDocuments({ joined_date: today });
        const bloklanganlar = await User.countDocuments({ is_blocked: true })

        const kinoCount = await Kino.countDocuments({ is_deleted: false });
        const engKopKorilgan = await Kino.findOne({ is_deleted: false })
            .sort({ views: -1 })
            .limit(1);

        let msg = ` 📊 <b>STATISTIKA PANELI</b>\n\n`;
        msg += ` 👤 <b>Foydalanuvchilar:</b>\n`;
        msg += ` └ 📌 Jami: <b>${userCount}</b>\n`;
        msg += ` └ 📲 Raqami bor: <b>${usersWithPhone}</b>\n`
        msg += ` └ 🆕 Bugun qo‘shilgan: <b>${todayUsers}</b>\n`
        msg += ` └ 🚫 Botni bloklaganlar: <b>${bloklanganlar}</b> \n\n`;

        msg += ` 🎬 <b>Kino ma’lumotlari:</b>\n`;
        msg += `  └ 🎞 Jami kinolar: <b>${kinoCount}</b>\n\n`;

        if (engKopKorilgan) {
            msg += ` 🔥 <b>Trend kino:</b>\n`;
            msg += `  └ 🎬 Nomi: <b>${engKopKorilgan.title}</b>\n`;
            msg += `  └ 👁 Ko‘rishlar: <b>${engKopKorilgan.views}</b>\n`;
            msg += `  └ 🎯 Video kodi: <b>${engKopKorilgan.code}</b>\n`;
        }

        await ctx.reply(msg, { parse_mode: 'HTML' });

    } catch (err) {
        console.error("Statistikani olishda xato:", err);
        await ctx.reply("❌ Statistikani olishda xatolik yuz berdi.");
    }
};

module.exports = statistikaniOlish;