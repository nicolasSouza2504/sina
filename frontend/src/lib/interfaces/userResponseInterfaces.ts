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
  contents?: UserResponseContentResponse[];
}

// Interface para o payload completo de submissão
export interface SubmitTaskPayload {
  taskUserId: number;
  commentary: string;
  files: File[];
}
