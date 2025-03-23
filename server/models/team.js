import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    Requester: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
