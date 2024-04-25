import express from "express";
import {
  addMessage,
  deleteMessage,
  getMessages,
} from "../controllers/MessageController.js";

const router = express.Router();

router.post("/", addMessage);

router.get("/:chatId", getMessages);

router.delete("/delete/:_id", deleteMessage);

export default router;
