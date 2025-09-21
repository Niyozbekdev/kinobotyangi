/**
 * 📌 PM2 uchun ecosystem konfiguratsiyasi
 * Bu fayl orqali botni avtomatik qayta ishga tushirish, loglarni yozish
 * va umumiy boshqaruvni sozlash mumkin.
 */

module.exports = {
    apps: [
        {
            name: "telegram-bot",            // 🔹 PM2 da chiqadigan bot nomi
            script: "./index.js",
            //exec_mode: "cluster",          // 🔹 Asosiy bot fayli
            instances: "max",                    // 🔹 Nechta instance ishga tushishi (1 ta kifoya, keyin cluster qilsa bo'ladi)
            autorestart: true,               // 🔹 Crash bo‘lsa yoki chiqib ketsa avtomatik qayta ishga tushadi
            watch: false,                    // 🔹 Kodni kuzatish (dev muhitida true, productionda false)
            max_memory_restart: "300M",      // 🔹 300 MB dan oshsa qayta ishga tushadi
            exp_backoff_restart_delay: 100,  // 🔹 Crash bo‘lsa restartni asta-sekin kechiktirib boradi (100ms → 200ms → 400ms...)

            // === Muhit o'zgaruvchilari (environment variables) ===
            env: {
                NODE_ENV: "production",        // 🔹 Production rejim
            },

            // === Log fayllarini sozlash ===
            error_file: "./logs/err.log",    // 🔹 Xatolik loglari shu faylga yoziladi
            out_file: "./logs/out.log",      // 🔹 Oddiy loglar shu faylga yoziladi
            merge_logs: true,                // 🔹 Bir nechta instance bo‘lsa loglarni bitta faylga yozadi
            time: true,                      // 🔹 Har bir log qatoriga vaqt qo'shadi
        },
    ],
};