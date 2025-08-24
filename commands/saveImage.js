const path = require('path');
const Image = require('../models/imageSchema');

const saveImage = async (ctx) => {
    try {
        const images = ["rasm1.jpg", "rasm2.jpg", "rasm3.jpg"];

        for (const img of images) {
            const filePath = path.join(__dirname, "images", img);
            const msg = await ctx.replyWithPhoto({ source: filePath });

            const fileId = msg.photo[msg.photo.length - 1].file_id;

            // DBga yozish
            await Image.findOneAndUpdate(
                { name: img },
                { file_id: fileId },
                { upsert: true, new: true }
            );

            //console.log(`✅ ${img} saqlandi. File ID: ${fileId}`);
        }

        ctx.reply("Barcha rasmlar file_id bilan saqlandi ✅");
    } catch (err) {
        console.error("❌ save_images xato:", err);
        ctx.reply("Xato bo‘ldi, logni tekshiring.");
    }
};

module.exports = saveImage;