import { createNote,deleteNote,getNotesWithTasks,updateTask} from "../controllers/note.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { Router } from "express"
const router = Router()
router.post("/create",authenticate,createNote)
router.get("/getMyNotes",authenticate,getNotesWithTasks)
router.delete("/:id",authenticate,deleteNote)
router.put("updateTask/:taskId",authenticate,updateTask)
export default router