export interface KnowledgeTrail {
    id: number;
    name: string;
    sectionId: number;
}

export interface CreateKnowledgeTrail {
    name: string;
    sectionId: number;
}

export interface KnowledgeTrailFormData {
    name: string;
    courseId: string;
    sectionId: string;
}
