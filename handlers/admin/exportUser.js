const User = require("../../models/User"); // misol uchun

const userFile = async (ctx) => {
    try {
        // 1️⃣ Bazadan ma'lumot olish
        const data = await User.find().lean();

        // 2️⃣ Fayl mazmunini bufferga tayyorlash
        const buffer = Buffer.from(JSON.stringify(data, null, 2), "utf-8");

        // 3️⃣ Userga faylni to‘g‘ridan-to‘g‘ri yuborish
        await ctx.replyWithDocument(
            { source: buffer, filename: "users.json" },
            { caption: "📂 Foydalanuvchilar ro‘yxati" }
        );

    } catch (err) {
        console.error("❌ Xatolik:", err);
        ctx.reply("Ma'lumotlarni eksport qilishda xatolik yuz berdi.");
    }
};

module.exports = userFile;