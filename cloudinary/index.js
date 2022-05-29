require("dotenv").config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: {
      folder: 'estante-montessori',
      allowedFormats: ['jpg', 'jpeg', 'png', 'svg'],
      transformation: [
         {
            width: 400, height: 400,
            crop: "fill"
         }
      ]
   }
});

module.exports = {
   cloudinary,
   storage
};