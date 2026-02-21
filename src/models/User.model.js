// src/models/User.model.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // =====================
    // Basic Information
    // =====================

    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },

    // =====================
    // Roles & Permissions
    // =====================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =====================
    // Account Status
    // =====================

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // =====================
    // Security Fields
    // =====================

    passwordChangedAt: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    emailVerificationToken: String,
    emailVerificationExpires: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  },
);

//
// ==========================
// 🔐 Password Hashing Middleware
// ==========================
//

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

//
// ==========================
// 🔑 Compare Password Method
// ==========================
//

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//
// ==========================
// 🚫 Hide Sensitive Fields
// ==========================
//

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.tokenVersion;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    delete ret.__v;

    ret.id = ret._id;
    delete ret._id;

    return ret;
  },
});


const User = mongoose.model("User", userSchema);

export default User;
