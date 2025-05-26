const User = require('../../models/User');
const boshMenyu = require('../../keyboards/mainKeyboard');

const userContact = async (ctx) => {
    try {
        const msg = ctx.message;
        const userId = ctx.from.id;

        if (msg.contact && msg.contact.user_id === userId) {
            const phone = msg.contact.phone_number;

            await User.findOneAndUpdate(
                { user_id: userId },
                {
                    phone_number: phone,
                    last_active_at: new Date()
                },
                { new: true }
            );

            return ctx.reply("✅ Foydalanishingiz mumkin.", boshMenyu());
        }
    } catch (err) {
        console.error("UserContextda", err)
    }
};

module.exports = userContact;