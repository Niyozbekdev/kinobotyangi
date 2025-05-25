const User = require('../../models/User');
const boshMenyu = require('../../keyboards/mainKeyboard');

const userContact = async (ctx) => {
    const msg = ctx.message;
    const userId = ctx.from.id;

    if (msg.contact && msg.contact.user_id === userId) {
        const phone = msg.contact.phone_number;

        await User.findOneAndUpdate(
            { user_id: userId },
            {
                phone_number: phone,
                last_active_at: new Date()
            }
        );

        return ctx.reply("✅ Raqamingiz saqlandi.", boshMenyu());
    }
};

module.exports = userContact;