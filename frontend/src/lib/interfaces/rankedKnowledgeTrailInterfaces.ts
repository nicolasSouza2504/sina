export interface RankedTask {
  name: string;
  id: number;
  description: string;
  startDate: string;
  quantitySubmissions: number;
  lastSubmission: string | null;
  knowledgeTrailId: number;
  knowledgeTrailName: string;
}

export interface RankedKnowledgeTrail {
  id: number;
  name: string;
  tasks: RankedTask[];
}
