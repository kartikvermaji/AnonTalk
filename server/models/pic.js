import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true },   // who sent the file
  fileId: { type: String, required: true },       // Telegram file_id
  type: { type: String, enum: ["photo", "video"], required: true },
  caption: { type: String }
}, { timestamps: true });

export const MEDIA = mongoose.model("MEDIA", mediaSchema);
export default MEDIA