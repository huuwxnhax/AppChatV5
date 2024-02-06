import MessageModel from "../models/messageModel.js";
import multer from "multer";
import pkg from 'aws-sdk';
const { S3 } = pkg;

const storage = multer.memoryStorage();

// upload image to memory storage and filter file types
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);

    if (extension && mimeType) {
      return cb(null, true);
    } else {
      cb('Error: Images only! (jpeg, jpg, png)');
    }
  }, 
});

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Middleware to handle file upload
const singleFileUpload = upload.single("image");

// Route handler for adding a message and uploading image to AWS S3
export const addMessage = async (req, res) => {
  // Using singleFileUpload middleware to handle file upload
  singleFileUpload(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }

    const { chatId, senderId, text } = req.body;
    const imageUrl = req.file ? `uploads/${Date.now()}_${chatId}_${senderId}.png` : null;

    const message = new MessageModel({
      chatId,
      senderId,
      text,
      imageUrl,
    });

    try {
      if (req.file) {
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: imageUrl,
          Body: req.file.buffer,
          ACL: "public-read",
        };
        console.log("UploadParams: " + uploadParams);
        await s3.upload(uploadParams).promise();
      }

      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });
};

// Get Messages
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
