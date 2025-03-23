import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    plan : {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: false,
    },
    teamUpgrade: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
