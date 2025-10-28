export interface TaskContentSummary {
    id: number;
    contentType: string;
    contentUrl: string;
}

export interface TaskSummary {
    id: number;
    name: string;
    description: string;
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
