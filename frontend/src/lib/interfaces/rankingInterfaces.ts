export interface StudentRankingDTO {
    name: string;
    conclusionPercent: number;
    tasksSent: number;
    tasksReviewed: number;
    totalTasks: number;
    mediumGrade: number | null;
    lastResponseDate: string | null;
    pointsEarned: number;
    place: number;
}

export interface RankingResponseDTO {
    name: string;
    knowledgeTrailId: number;
    studentsRanking: StudentRankingDTO[];
}

export interface RankingData {
    message: string;
    data: RankingResponseDTO[];
}
