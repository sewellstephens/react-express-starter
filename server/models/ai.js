import mongoose from "mongoose";
const Schema = mongoose.Schema;

const aiSchema = new Schema(
  {
    Requester: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AI", aiSchema);
