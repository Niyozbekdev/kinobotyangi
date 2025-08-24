const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    name: { type: String, required: true }, // rasm nomi (rasm1.jpg)
    file_id: { type: String, required: true }, // telegram file_id
});

module.exports = mongoose.model("Image", ImageSchema);