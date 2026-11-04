import {type Note,type Task} from "../types/interfaces"
import { api } from "./axios"
interface NotePayload {
    title:String,
    rawText:String
}
export interface NoteResponse {
    note: Note;
    tasks: Task[];
}
export const createNote = async (payload:NotePayload):Promise<NoteResponse> => {
    const response = await api.post('/note/create',payload);
    return response.data
}
export const getNotes = async () :Promise<Note[]>=> {
    const response = await api.get('/note/getMyNotes')
    return response.data

}
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/note/updateTask/${taskId}`, updates);
    return response.data;
}
export const deleteNote = async (noteId: string): Promise<void> => {
    const response = await api.delete(`/note/${noteId}`);
    return response.data;
}