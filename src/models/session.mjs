import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  token: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
