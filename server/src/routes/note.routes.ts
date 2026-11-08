import { createNote,deleteNote,getNotesWithTasks,updateTask,addTask, deleteTask} from "../controllers/note.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { Router } from "express"
const router = Router()
router.post("/create",authenticate,createNote)
router.get("/getMyNotes",authenticate,getNotesWithTasks)
router.delete("/:id",authenticate,deleteNote)
router.put("/updateTask/:taskId",authenticate,updateTask)
router.post("/:id/tasks", authenticate, addTask);
router.delete("/tasks/:taskId", authenticate, deleteTask);
export default router