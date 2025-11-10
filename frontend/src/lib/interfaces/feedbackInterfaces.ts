export interface FeedbackRegister {
  userResponseId: number;
  teacherId: number;
  comment: string;
  grade: number;
}

export interface FeedbackResponse {
  id: number;
  userResponseId: number;
  teacherId: number;
  comment: string;
  grade: number;
  teacher: {
    id: number;
    name: string;
    email: string;
  };
}
