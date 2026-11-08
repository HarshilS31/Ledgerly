import {type Note,type Task} from "../types/interfaces"
import { api } from "./axios"
import { type NotePayload,type NoteResponse,type TaskPayload } from "../types/interfaces";
export const createNote = async (payload:NotePayload):Promise<NoteResponse> => {
    const response = await api.post('/note/create',payload);
    return response.data
}
export const getNotes = async () :Promise<Note[]>=> {
    const {data} = await api.get<NoteResponse>('/note/getMyNotes')
    return data.data
}
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/note/updateTask/${taskId}`, updates);
    return response.data;
}
export const deleteNote = async (noteId: string): Promise<void> => {
    const response = await api.delete(`/note/${noteId}`);
    return response.data;
}
export const addTask = async (
    noteId: string,
    payload: TaskPayload
): Promise<Task> => {
    const { data } = await api.post(`/note/${noteId}/tasks`, payload);
    return data.task; 
}
export const deleteTask = async (taskId: string): Promise<void> => {
    await api.delete(`/note/tasks/${taskId}`);
}
