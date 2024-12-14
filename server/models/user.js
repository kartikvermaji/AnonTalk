import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  partnerGender: { type: String, enum: ["male", "female", "any"], default: "any" },
  isSearching: { type: Boolean, default: false },
  chatPartner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  interests: { type: [String], default: []},
  rating: { type: Number, default: 0},
  ratingsCount: { type: Number, default: 0,},
});

const USERS = mongoose.model("user", userSchema);
export default USERS;
