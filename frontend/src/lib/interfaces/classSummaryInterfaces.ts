import { Role } from "@/lib/interfaces/roleInterfaces";

// ============================================
// NOVAS INTERFACES - CLASS ASSESSMENT API
// ============================================

// CourseSimpleResponseDTO do backend
export interface ClassAssessmentCourse {
  id: number;
  name: string;
}

// UserResponseContentDTO do backend
export interface UserResponseContentAssessment {
  taskContentType: string;
  name: string;
  url: string;
}

// UserResponseAssessmentDTO do backend
export interface UserResponseAssessment {
  id: number;
  comment: string;
  contents: UserResponseContentAssessment[];
}

// TaskAssessmentDTO do backend
export interface TaskAssessment {
  id: number;
  name: string;
  description: string;
  dueDate: string | null;
  knowledgeTrailId: number;
}

// UserResponseDTO (Teacher) do backend
export interface TeacherAssessment {
  id: number;
  email: string;
  nome: string;
  status: string;
  role: Role;
  institutionName: string;
  cpf: string;
  classes?: Array<{
    Id: number;
    nome: string;
    startDate: string;
    finalDate: string;
    imgClass: string;
    semester: number;
    code: string;
    course: {
      id: number;
      name: string;
    };
  }>;
}

// UserResponseResponseDTO do backend
export interface UserResponseResponse {
  id: number;
  comment: string;
}

// FeedbackResponseDTO do backend
export interface FeedbackAssessment {
  id: number;
  teacher: TeacherAssessment;
  response: UserResponseResponse;
  comment: string;
  grade: number;
}

// TaskUserAssessmentDTO do backend
export interface TaskUserAssessment {
  idUser: number;
  taskId: number;
  id: number; // taskUserId
  task: TaskAssessment;
  userResponse: UserResponseAssessment | null;
  feedback: FeedbackAssessment | null;
}

// UserAssessmentDTO do backend
export interface UserAssessment {
  id: number;
  email: string;
  nome: string;
  status: string;
  role: Role;
  institutionName: string;
  cpf: string;
  tasksAssessment: TaskUserAssessment[];
}

// ClassAssessmentResponseDTO do backend
export interface ClassAssessment {
  id: number;
  nome: string;
  startDate: string;
  finalDate: string;
  imgClass: string;
  semester: number;
  code: string;
  course: ClassAssessmentCourse;
  users: UserAssessment[];
}

// ============================================
// INTERFACES ANTIGAS (DEPRECATED - manter para compatibilidade)
// ============================================

export interface ClassSummaryCourse {
  id: number;
  name: string;
}

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
  createdAt?: string;
}

export interface TaskUserResponseSummary {
  idUser: number;
  taskId: number;
  id: number;
  userResponse: UserResponseSummary | null;
  feedback: any | null;
}

export interface ClassSummaryUser {
  id: number;
  email: string;
  nome: string;
  status: string;
  role: Role;
  institutionName: string;
  cpf: string;
  taskUser: TaskUserResponseSummary[];
}

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
