export interface User {
    _id: string; 
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    _id: string;
    userId: string;
    noteId: string;
    text: string;
    owner: string | null;
    dueText: string | null;
    status: "todo" | "done";
    unclear: boolean;
    sourceSnippet: string;
    createdAt: string;
    updatedAt: string;
}

export interface Note {
    _id: string;
    userId: string;
    title: string;
    rawText: string;
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
}
export type TaskPatch = Pick<Task, "text" | "owner" | "dueText">
export interface NotePayload {
    title:String,
    rawText:String
}
export interface NoteResponse {
    message: string;
    count:number
    data: Note[];
}
export interface TaskPayload {
    text: string;
    owner: string | null;
    dueText: string | null;
}