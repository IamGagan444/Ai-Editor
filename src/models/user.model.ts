import mongoose, { Schema, Document } from "mongoose";

export interface Messages {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Messages> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const MessageModel =
  (mongoose.models?.Message as mongoose.Model<Messages>) ||
  mongoose.model<Messages>("Message", MessageSchema);

export interface User extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Messages[];
  verifyCode: string;
  verifyCodeExpiry: Date;
}

export const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required!"],
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "email is required!"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minlength: 6,
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
      "enter strong password",
    ],
  },

  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
    required: true,
  },
  messages: [MessageSchema],
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry:{
    type:Date,
    required:true
  }
});

export const UserModel =
  (mongoose.models?.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
