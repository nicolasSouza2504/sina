export type DifficultyLevel = 'FACIL' | 'MEDIO' | 'DIFICIL';

export interface CreateTask {
    courseId: number;
    knowledgeTrailId: number;
    name: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    dueDate?: string; // ISO 8601 format - Optional, only for ranked trails
}

export interface Task {
    id: number;
    courseId: number;
    knowledgeTrailId: number;
    name: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    dueDate: string;
    taskOrder: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface TaskFormData {
    name: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    dueDate?: string; // Optional, only for ranked trails
}
