import { Schema, model, type InferSchemaType } from "mongoose";

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, trim: true, maxlength: 120,default:null},
    rawText: { type: String, required: true, maxlength: 20000 },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, createdAt: -1 });

export type Note = InferSchemaType<typeof noteSchema>;
export const NoteModel = model("Note", noteSchema);