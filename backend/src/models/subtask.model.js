import mongoose from "mongoose";

const SubtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// export const Subtask = mongoose.model("Subtask", SubtaskSchema);
