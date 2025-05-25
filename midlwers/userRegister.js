// const User = require('../models/User');

// const userRegister = async (ctx, next) => {
//     try {
//         const userId = ctx.from.id;
//         const referrerId = ctx.startPayload; //Referal kodi
//         const { id, username, first_name, last_active_at } = ctx.from;

//         let user = await User.findOne({ user_id: userId });

//         if (!user) {
//             const newUser = new User({
//                 user_id: userId,
//                 username,
//                 first_name,
//                 last_active_at,
//                 referrer_id: referrerId ? Number(referrerId) : null
//             });
//             await newUser.save();

//             await ctx.reply("📲 Botdan toliq foydalanish uchun raqamingizni yuboring", {
//                 reply_markup: {
//                     keyboard: [
//                         [{ text: "📲 Raqamni yuborish", request_contact: true }]
//                     ],
//                     resize_keyboard: true,
//                     one_time_keyboard: true
//                 }
//             });
//             return; // faqat ro‘yxatga olib, shu yerda to‘xtatamiz
//         }
//         // Agar telefon raqami yo‘q bo‘lsa, uni so‘raymiz va to‘xtaymiz
//         if (!user.phone_number) {
//             await ctx.reply("📲 Foydalanish uchun raqamingizni yuboring:", {
//                 reply_markup: {
//                     keyboard: [
//                         [{ text: "📲 Raqamni yuborish", request_contact: true }]
//                     ],
//                     resize_keyboard: true,
//                     one_time_keyboard: true
//                 }
//             });
//             return; // baribir step boshlangan bo‘lsa ham to‘xtatamiz
//         }
//         // User mavjud bo‘lsa davom ettiramiz
//         return next();
//     } catch (error) {
//         console.log("userRegister catch", error.message)
//     }

// };

// module.exports = userRegister;