import { Schema, model, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true },
    text: { type: String, required: true, trim: true },
    owner: { type: String, default: null },
    dueDate: { type: Date, default: null },
    status: { type: String, enum: ["todo", "done"], default: "todo" },
    unclear: { type: Boolean, default: false },
    sourceSnippet: { type: String, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ noteId: 1 });

export type Task = InferSchemaType<typeof taskSchema>;
export const TaskModel = model("Task", taskSchema);