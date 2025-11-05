export interface KnowledgeTrail {
    id: number;
    name: string;
    sectionId: number;
    ranked?: boolean;
}

export interface CreateKnowledgeTrail {
    name: string;
    sectionId: number;
    ranked: boolean;
}

export interface KnowledgeTrailFormData {
    name: string;
    courseId: string;
    sectionId: string;
    ranked: boolean;
}

export interface UpdateKnowledgeTrail {
    name: string;
    sectionId: number;
    ranked: boolean;
}

export interface EditKnowledgeTrailFormData {
    id: number;
    name: string;
    sectionId: number;
    sectionName: string;
    ranked: boolean;
}
