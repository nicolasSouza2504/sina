import { DifficultyLevel } from './taskInterfaces';

export interface TaskContentSummary {
    id: number;
    contentType: string;
    contentUrl: string;
    name: string; // Nome do conteúdo
}

export interface TaskSummary {
    id: number;
    name: string;
    description: string;
    difficultyLevel?: DifficultyLevel;
    dueDate?: string;
    taskOrder: number;
    contents: TaskContentSummary[];
}

export interface KnowledgeTrailSummary {
    id: number;
    name: string;
    ranked?: boolean;
    tasks: TaskSummary[];
}

export interface SectionSummary {
    id: number;
    name: string;
    semester: number;
    courseId: number;
    knowledgeTrails: KnowledgeTrailSummary[];
}

export interface CourseContentSummary {
    name: string;
    quantitySemester: number;
    id: number;
    sections: SectionSummary[];
}
