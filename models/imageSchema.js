import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    file_id: { type: String, required: true }, //Telegram rasm file_id
    // Telegram album caption odatda bitta mediaga qo‘yiladi.
    caption: { type: String, default: '' } //Izoh (caption)
}, { _id: false });

const vipPostSchema = new mongoose.Schema({
    images: {
        type: [imageSchema], //1-10 ta rasm
        validate: v => Array.isArray(v) && v.length > 0 && v.length <= 10
    },
    created_by: { type: Number, required: true }, // admin user_id kim rasm qushgani
    is_active: { type: Boolean, default: true } //activ yoki activ emasligi rasmlarni
}, { timestamps: true });

export default mongoose.model('VipPost', vipPostSchema);