import MessageModel from "../models/messageModel.js";
import multer from "multer";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();

// upload image to memory storage and filter file types
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // allow file pdf, doc, docx, jpg, jpeg, png, mp4, video
    const allowedFileTypes = /jpeg|jpg|png|docx|pdf|mp4/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (extension && mimeType) {
      return cb(null, true);
    } else {
      cb('Error: Images only! (jpeg, jpg, png)');
    }
  }, 
});

// AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Middleware to handle file upload
const singleFileUpload = upload.single("image");

export const addMessage = async (req, res) => {
  // Handle file upload error
  singleFileUpload(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }

    // Get data from request body
    const { chatId, senderId, text } = req.body;
    const imageUrl = req.file ? `uploads/${Date.now()}_${chatId}_${senderId}.png` : null;

    const message = new MessageModel({
      chatId,
      senderId,
      text,
      imageUrl
    });

    try {
      if (req.file) {
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: imageUrl,
          Body: req.file.buffer,
          ACL: "public-read",
        };

        console.log("Upload Params:", uploadParams);

        // Use AWS SDK v3 to upload to S3
        await s3.send(new PutObjectCommand(uploadParams));
      }

      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error:", error);
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

// delete message
export const deleteMessage = async (req, res) => {
  const { _id } = req.params;
  console.log("id:", _id);
  try {
    const result = await MessageModel.findByIdAndDelete(_id);
    console.log("Result:", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
