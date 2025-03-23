import mongoose from "mongoose";
const Schema = mongoose.Schema;

const usageSchema = new Schema(
  {
    creator: {
      type: String,
      required: true,
    },
    AiCredits: {
      type: Number,
      required: true,
      default: 0,
    },
    KeywordsCredits: {
      type: Number,
      required: true,
      default: 0,
    },
    textGenerationCredits: {
      type: Number,
      required: true,
      default: 0,
    },
    imageGenerationCredits: {
      type: Number,
      required: true,
      default: 0,
    },
    keywordCredits: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Usage", usageSchema);
