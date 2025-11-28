// Interfaces para Dashboard

export interface TaskResponseDTO {
  taskId: number;
  taskName: string;
  taskDescription: string;
}

export interface DashBoardUserGeneralInfo {
  waitingFeedbackTasks: TaskResponseDTO[];
  pendingTasks: TaskResponseDTO[];
  evaluatedTasks: TaskResponseDTO[];
}

export interface DashboardAdmGeneralInfo {
    totalActiveUsers: number;
    totalCourses: number;
    totalRankedTasks: number;
    totalTasks: number;
    totalTeachers: number;
}
