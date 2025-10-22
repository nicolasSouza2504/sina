/**
 * @fileoverview Type definitions for activity-related entities
 * @author DEV Senior Team
 */

export interface ActivityResource {
  id: string
  type: 'video' | 'exercise' | 'quiz' | 'pdf' | 'document'
  title: string
  description?: string
  duration?: string
  url?: string
  filePath?: string
  isRequired: boolean
  completed?: boolean
}

export interface ActivitySubmission {
  id: string
  activityId: string
  userId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  submittedAt: Date
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision'
  feedback?: string
  grade?: number
}

export interface ActivityProgress {
  activityId: string
  userId: string
  isCompleted: boolean
  completedAt?: Date
  progress: number // 0-100
  timeSpent: number // in minutes
  lastAccessedAt: Date
}

export interface Activity {
  id: string
  title: string
  description: string
  content?: string
  type: 'teórica' | 'prática' | 'projeto' | 'avaliação'
  duration: string
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  completed: boolean
  progress: number
  resources: ActivityResource[]
  submissions?: ActivitySubmission[]
  trilhaId: string
  trilhaTitle: string
  requiresUpload?: boolean
  maxFileSize?: number // in MB
  allowedFileTypes?: string[]
}

export interface LearningTrack {
  id: string
  title: string
  description: string
  progress: number
  totalActivities: number
  completedActivities: number
  estimatedTime: string
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  activities: Activity[]
  isCompleted: boolean
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
