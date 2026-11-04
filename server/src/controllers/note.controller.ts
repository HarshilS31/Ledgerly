import "../config/env.js"
import {Response, Request} from "express"
import {NoteModel} from "../models/note.model.js"
import {TaskModel} from "../models/task.model.js"
import { UserModel } from "../models/user.model.js"
import { generateAndMapTasks } from "../services/ai.service.js"
import mongoose from "mongoose"
import { ResponseFormat } from "@google/genai"
export const createNote = async(req:Request,res:Response)=> {
    try{
        const userId = req.user?.id;
        if(!userId) {
            return res.status(401).json({message:"Unauthorized"})
        }
        const {title,rawText} = req.body;
        const text = rawText.trim();
        if(!text || !title) {
            return res.status(400).json({message:"Please enter both title and text"});
        }
        const newNote = await NoteModel.create({userId:userId,title:title,rawText:text})
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const finalizedTasks = await generateAndMapTasks(text,userObjectId,newNote._id);
        const savedTasks = await TaskModel.insertMany(finalizedTasks);
        return res.status(201).json({ 
              message: "Note and tasks created successfully", 
              note: newNote,
              tasks: savedTasks 
            });
    }catch(err) {
        console.error(err)
        return res.status(500).json({message:"Internal Server Error",err})
    }
}
export const getNotesWithTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const notesWithTasks = await NoteModel.aggregate([
      { $match: { userId: userObjectId } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "tasks",     
          localField: "_id",   
          foreignField: "noteId", 
          as: "tasks"          
        }
      }
    ]);

    return res.status(200).json({ 
      message: "Notes and tasks fetched successfully", 
      count: notesWithTasks.length,
      data: notesWithTasks 
    });

  } catch (err) {
    console.error("Error aggregating notes with tasks:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteNote = async(req:Request,res:Response)=> {
    try{
        const userId = req.user?.id;
        if(!userId) {
            return res.status(401).json({message:"Unauthorized"})
        }
        const noteId = req.params.id;
        const deletedNote = await NoteModel.findOneAndDelete({_id:noteId,userId:userId})
        await TaskModel.deleteMany({ noteId: noteId });
        if(!deletedNote) {
            return res.status(404).json({message:"Note not found"})
        }
        return res.status(200).json({message:"Note and corresponding tasks deleted successfully"})
    }catch(err) {
        console.error(err)
        return res.status(500).json({message:"Internal Server Error",err})
    }
}
export const updateTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const taskId = req.params.taskId; // matches router.put("/updateTask/:taskId")
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const { text, dueText, owner, status } = req.body;
        const updatePayload: Record<string, unknown> = {};
        if (text !== undefined) {
            if (typeof text !== "string" || !text.trim()) {
                return res.status(400).json({ message: "Task text can't be empty" });
            }
            updatePayload.text = text.trim();
        }
        if (owner !== undefined) {
            updatePayload.owner = typeof owner === "string" && owner.trim() ? owner.trim() : null;
        }
        if (dueText !== undefined) {
            updatePayload.dueText = typeof dueText === "string" && dueText.trim() ? dueText.trim() : null;
        }
        if (status !== undefined) {
            if (status !== "todo" && status !== "done") {
                return res.status(400).json({ message: "Invalid status" });
            }
            updatePayload.status = status;
        }
        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }
        if ("text" in updatePayload || "owner" in updatePayload || "dueText" in updatePayload) {
            updatePayload.unclear = false;
        }

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: taskId, userId },
            { $set: updatePayload },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        return res.status(200).json(updatedTask)
    } catch (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};