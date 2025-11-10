import { Role } from "@/lib/interfaces/roleInterfaces";
import { FeedbackResponseDTO } from "@/lib/interfaces/taskUserInterfaces";

// CourseSimpleResponseDTO do backend
export interface ClassSummaryCourse {
  id: number;
  name: string;
}

// UserResponseSummaryDTO do backend (simplificado para ClassSummary)
export interface UserResponseSummary {
  id: number;
  comment: string;
  taskUser: {
    id: number;
    userId: number;
    taskId: number;
  };
  contents: Array<{
    taskContentType: string;
    name: string;
    url: string;
  }>;
  createdAt?: string; // Campo opcional (pode não vir do backend)
}

// TaskUserResponseSummaryDTO do backend
export interface TaskUserResponseSummary {
  idUser: number;
  taskId: number;
  id: number; // taskUserId
  userResponse: UserResponseSummary | null;
  feedback: FeedbackResponseDTO | null; // ✅ Feedback no nível raiz
}

// UserTaskResponse do backend
export interface ClassSummaryUser {
  id: number;
  email: string;
  nome: string;
  status: string;
  role: Role;
  institutionName: string;
  cpf: string;
  taskUser: TaskUserResponseSummary[]; // ✅ Array de TaskUserResponseSummary
}

// ClassResponseSummaryDTO do backend
export interface ClassSummary {
  Id: number;
  nome: string;
  startDate: string;
  finalDate: string;
  imgClass: string;
  semester: number;
  code: string;
  course: ClassSummaryCourse;
  users: ClassSummaryUser[];
}
