// Interfaces para UserResponse e UserResponseContent

export interface UserResponseRegister {
  taskUserId: number;
  commentary: string;
}

export interface UserResponseContentRegister {
  userResponseId: number;
  name: string;
  contentType: 'PDF' | 'VIDEO' | 'MP4' | 'JPG' | 'PNG' | 'MP3' | 'DOCX' | 'LINK' | 'TEXT';
  link?: string;
}

export interface UserResponseContentResponse {
  id: number;
  contentUrl: string;
  contentType: string;
  name: string;
  userResponseId: number;
}

export interface UserResponseResponse {
  id: number;
  comment: string;
  taskUserId: number;
  feedback?: FeedbackResponse | null;
  createdAt?: string;
  contents?: Array<{
    taskContentType: string;
    name: string;
    url: string;
  }>;
}

// Interface para Feedback (avaliação do professor)
export interface FeedbackResponse {
  id: number;
  teacher: {
    id: number;
    name: string;
    email: string;
  };
  response: {
    id: number;
    comment: string;
    taskUserId: number;
  };
  comment: string;
  grade: number;
}

// Interface para criar/editar feedback
export interface FeedbackRegister {
  userResponseId: number;
  comment: string;
  grade: number;
}

export interface FeedbackFormData {
  comment: string;
  grade: number;
}

// Interface para o payload completo de submissão
export interface SubmitTaskPayload {
  taskUserId: number;
  commentary: string;
  files: File[];
}
