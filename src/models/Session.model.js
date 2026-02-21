import mongoose from "mongoose";
import crypto from "crypto";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    refreshTokenHash: {
      type: String,
      required: true
    },
    userAgent: String,
    ip: String,
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

sessionSchema.methods.setRefreshToken = function (refreshToken) {
  this.refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
};

sessionSchema.methods.compareRefreshToken = function (refreshToken) {
  const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  return hash === this.refreshTokenHash;
};

const Session = mongoose.model("Session", sessionSchema);

export default Session;
