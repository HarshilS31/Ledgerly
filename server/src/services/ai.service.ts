import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import mongoose from "mongoose";
const taskExtractionZod = z.object({
  tasks: z.array(
    z.object({
      text: z.string(),
      dueText: z.string().nullable(),
      status: z.enum(["todo", "done"]).default("todo"),
      unclear: z.boolean(),
      sourceSnippet: z.string().nullable(),
    })
  )
});

export type RawExtractedTask = z.infer<typeof taskExtractionZod>["tasks"][number];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAndMapTasks( rawText: string, userId: mongoose.Types.ObjectId, noteId: mongoose.Types.ObjectId) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `Extract action items from this text: "${rawText}"`,
    config: {
      systemInstruction: "You are a precise task generator. Extract tasks from raw text strictly matching the schema. Use null if information is missing.",
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(taskExtractionZod), 
      temperature: 0.1, 
    },
  });

  if (!response.text) throw new Error("AI returned empty response");

  const parsedData = taskExtractionZod.parse(JSON.parse(response.text));
  const finalizedTasks = parsedData.tasks.map((task: RawExtractedTask) => ({
      ...task,       
      userId,        
      noteId         
  }))

  return finalizedTasks;
}