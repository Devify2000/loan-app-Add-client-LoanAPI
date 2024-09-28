import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    profileImage: {
      type: String,
    },
    isActivated: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("User", UserSchema);
