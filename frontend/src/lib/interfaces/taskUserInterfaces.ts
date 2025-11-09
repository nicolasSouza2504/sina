// Interface para TaskUser e UserResponse

export interface UserResponseContent {
  id: number;
  contentUrl: string;
  contentType: string;
  // Adicione outros campos conforme necessário
}

export interface TaskUserResponseDTO {
  id: number;
  userId: number;
  taskId: number;
  // Adicione outros campos conforme necessário
}

export interface UserResponseSummary {
  id: number;
  comment: string;
  taskUser: TaskUserResponseDTO;
  contents: UserResponseContent[];
}

export interface TaskUserResponse {
  idUser: number;
  taskId: number;
  id: number; // Este é o taskUserId
  userResponse: UserResponseSummary | null;
}
