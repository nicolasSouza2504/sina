import { Role } from "@/lib/interfaces/roleInterfaces";
import { TaskUserResponse } from "@/lib/interfaces/taskUserInterfaces";
import { UserResponseResponse, FeedbackResponse } from "@/lib/interfaces/userResponseInterfaces";

// Interface para o curso dentro do ClassSummary
export interface ClassSummaryCourse {
  id: number;
  name: string;
}

// Interface para o usuário dentro do ClassSummary
export interface ClassSummaryUser {
  id: number;
  email: string;
  nome: string;
  status: string;
  role: Role;
  institutionName: string;
  cpf: string;
  taskUser: TaskUserResponse[];
}

// Interface para a tarefa do usuário com feedback
export interface TaskUserWithFeedback {
  taskId: number;
  taskUserId: number;
  hasResponse: boolean;
  response: UserResponseResponse;
  hasFeedback: boolean;
  feedback?: FeedbackResponse;
}

// Interface principal do ClassSummary
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
