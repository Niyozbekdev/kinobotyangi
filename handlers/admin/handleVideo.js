const AdminState = require('../../models/AdminState');
const { ADMIN_ID } = require('../../config/admin');

const videoHandler = async (ctx) => {
    const userId = ctx.from.id;
    if (userId !== ADMIN_ID) return;

    const state = await AdminState.findOne({ admin_id: userId });

    if (!state || state.step !== 'waiting_for_video') return ctx.reply('Iltimos video yuboring');

    const kino = ctx.message?.video ||
        ctx.message?.reply_to_message?.video ||
        (ctx.message?.forward_from && ctx.message.video);

    if (!kino) return ctx.reply('Bu video emas boshqa narsa');
    await AdminState.findOneAndUpdate(
        { admin_id: userId },
        {
            step: 'waiting_for_title',
            temp_file_id: kino.file_id
        }
    );
    return ctx.reply('📌 Kinoning nomini yuboring', { parse_mode: 'HTML' });
}

module.exports = videoHandler;