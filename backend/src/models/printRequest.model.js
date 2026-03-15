import mongoose from "mongoose";

const PrintRequestSchema = new mongoose.Schema({
  name: String,
  phone: String,
  fileUrl: String,
  copies: Number,
  printType: {
    type: String,
    enum: ["black-white", "color"]
  },
  notes: String,
  status: {
    type: String,
    enum: ["pending", "printing", "completed"],
    default: "pending"
  }
}, { timestamps: true });

export const PrintRequest = mongoose.model("PrintRequest", PrintRequestSchema);
