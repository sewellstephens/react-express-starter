import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    activationToken: {
      type: String,
    },
    pictureUrl: {
      type: String,
      required: false,
    },
    admin : {
      type: Boolean,
      required: true,
      default: false,
    },
    teamSize: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      required: false,
    },
    org: {
      type: String,
      required: false,
    },
    team: {
      type: String,
      required: false,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Number,
    },
    unsubscribed: {
      type: Boolean,
      default: false,
    },
    tokenExpired: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    impersonated: {
      type: Boolean,
      default: false,
    },
    website: {
      type: String,
      required: false,
    },
    isTeamMember: {
      type: Boolean,
      default: false,
    },
    lastSiteFetch: {
      type: String,
      required: false,
    },
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
