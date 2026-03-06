import mongoose, { Document, Model, Schema } from "mongoose";
import type { Types } from "mongoose";
import bcrypt from "bcryptjs";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokenVersion: number;
  role: "user" | "admin";
  isVerified: boolean;
  isActive: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserDocument extends IUser, IUserMethods, Document {
  _id: Types.ObjectId;
}

export type UserModel = Model<IUserDocument, {}, IUserMethods>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUserDocument, UserModel, IUserMethods>(
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

// ─── Password Hashing Middleware ──────────────────────────────────────────────

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ─── Instance Methods ─────────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── toJSON Transform ─────────────────────────────────────────────────────────

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;

    delete obj.password;
    delete obj.tokenVersion;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    delete obj.emailVerificationToken;
    delete obj.emailVerificationExpires;
    delete obj.__v;

    obj.id = obj._id;
    delete obj._id;

    return obj;
  },
});

// ─── Model ────────────────────────────────────────────────────────────────────

const User = mongoose.model<IUserDocument, UserModel>("User", userSchema);

export default User;