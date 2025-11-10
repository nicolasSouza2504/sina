// Interface para TaskUser e UserResponse
// Baseado nos DTOs do backend Java

export interface UserResponseContent {
  taskContentType: string;
  name: string;
  url: string;
}

export interface TaskUserResponseDTO {
  id: number;
  userId: number;
  taskId: number;
}

export interface TaskUserRegister {
  userId: number;
  taskId: number;
}

// UserResponseDTO do backend (teacher no feedback)
export interface FeedbackTeacher {
  id: number;
  email: string;
  nome: string;
  status: string;
  role: {
    id: number;
    name: string;
  };
  institutionName: string;
  cpf: string;
  classes: any[];
}

// UserResponseResponseDTO do backend (response no feedback)
export interface FeedbackUserResponse {
  id: number;
  comment: string;
}

// FeedbackResponseDTO do backend
export interface FeedbackResponseDTO {
  id: number;
  teacher: FeedbackTeacher;
  response: FeedbackUserResponse;
  comment: string;
  grade: number;
}

// UserResponseSummaryDTO do backend
export interface UserResponseSummary {
  id: number;
  comment: string;
  taskUser: TaskUserResponseDTO;
  contents: UserResponseContent[];
}

// TaskUserResponseSummaryDTO do backend
export interface TaskUserResponse {
  idUser: number;
  taskId: number;
  id: number; // Este é o taskUserId
  userResponse: UserResponseSummary | null;
  feedback: FeedbackResponseDTO | null; // ✅ Feedback vem no nível raiz do TaskUserResponse
}
