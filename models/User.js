import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  favorites: [String],
  searchHistory: [{ query: String, timestamp: { type: Date, default: Date.now } }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
