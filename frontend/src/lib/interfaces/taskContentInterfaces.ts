export type TaskContentType = 'PDF' | 'VIDEO' | 'JPG' | 'PNG' | 'MP3' | 'MP4' | 'LINK' | 'TEXT' | 'DOCX';

export interface CreateTaskContent {
    taskId: number;
    name: string;
    taskContentType: TaskContentType;
    link?: string; // Opcional - apenas para tipo LINK
}

export interface TaskContent {
    id: number;
    taskId: number;
    name: string;
    contentType: TaskContentType;
    contentUrl: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TaskContentFormData {
    name: string;
    taskContentType: TaskContentType;
    file: File | null;
    link?: string; // Opcional - apenas para tipo LINK
}

export interface TaskContentResponse {
    id: number;
    taskId: number;
    name: string;
    contentType: TaskContentType;
    contentUrl: string;
    status: string;
}
