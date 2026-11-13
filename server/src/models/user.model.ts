import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:{type:String,required:true},
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false }
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);