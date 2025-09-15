const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
    file_id: { type: String, required: true }, //Telegram rasm file_id
    // Telegram album caption odatda bitta mediaga qo‘yiladi.
    caption: { type: String, default: '' } //Izoh (caption)
}, { _id: false });


module.exports = imageSchema;