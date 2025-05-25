const AdminState = require('../../models/AdminState');

const titleHandler = async (ctx) => {
    const userId = ctx.from.id;
    const state = await AdminState.findOne({ admin_id: userId });

    if (!state) return ctx.reply('Kerakli tugmani tanlang');

    if (state.step === 'waiting_for_title') {
        await AdminState.findOneAndUpdate(
            { admin_id: userId },
            {
                step: 'waiting_for_code',
                temp_title: ctx.message.text
            }
        );
        return ctx.reply('🆔 Endi kino kodini kiriting. (Masalan: 101)', { parse_mode: 'HTML' });
    }

}

module.exports = titleHandler;
