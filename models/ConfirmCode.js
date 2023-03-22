import mongoose from "mongoose";
import cryptoRandomString from "crypto-random-string";
const generateRandomString = () => {
  return cryptoRandomString({
    length: 50,
    type: "url-safe",
  });
};

const ConfirmCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      default: generateRandomString,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ConfirmCode', ConfirmCodeSchema);