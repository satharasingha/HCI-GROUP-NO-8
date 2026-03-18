import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
  name: { type: String, default: "Living Room" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  room: {
    width: { type: Number, default: 6 },
    depth: { type: Number, default: 6 },
  },
  items: { type: Array, default: [] },
  thumbnail: { type: String },
  isPublic: { type: Boolean, default: false },
  shareId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

const Design = mongoose.model("Design", designSchema);
export default Design;