/**
 * @fileoverview Type definitions for course and semester entities
 * @author DEV Senior Team
 */

import { LearningTrack } from './activityTypes'

export interface Course {
  id: string
  title: string
  description: string
  code: string // e.g., "ADS", "SI", "ENG"
  year: number // e.g., 2022, 2023, 2024
  status: 'active' | 'inactive' | 'completed' | 'draft'
  startDate: Date
  endDate: Date
  image?: string
  color?: string
  semesters: Semester[]
  totalSemesters: number
  completedSemesters: number
  progress: number // 0-100
  instructor?: {
    id: string
    name: string
    avatar?: string
  }
  isEnrolled?: boolean
  enrollmentDate?: Date
}


export interface Semester {
  id: string
  title: string
  description: string
  courseId: string
  courseTitle: string
  order: number // 1, 2, 3, 4, 5, 6 (semestres sequenciais)
  status: 'active' | 'inactive' | 'completed' | 'locked'
  startDate: Date
  endDate: Date
  duration: string // e.g., "6 meses", "1 semestre"
  learningTracks: LearningTrack[]
  totalTracks: number
  completedTracks: number
  progress: number // 0-100
  prerequisites?: string[] // IDs of semesters that must be completed
  isUnlocked: boolean
  estimatedTime: string
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
}

export interface CourseEnrollment {
  id: string
  courseId: string
  userId: string
  enrolledAt: Date
  status: 'active' | 'completed' | 'dropped' | 'suspended'
  progress: number
  lastAccessedAt: Date
  completedAt?: Date
}

export interface SemesterProgress {
  id: string
  semesterId: string
  userId: string
  isCompleted: boolean
  completedAt?: Date
  progress: number
  timeSpent: number // in minutes
  lastAccessedAt: Date
}

export interface CourseFilters {
  status?: Course['status'][]
  year?: number[]
  code?: string[]
  instructor?: string[]
}

export interface SemesterFilters {
  status?: Semester['status'][]
  difficulty?: Semester['difficulty'][]
  isUnlocked?: boolean
}

// Navigation types
export interface CourseNavigation {
  course: Course
  currentSemester?: Semester
  breadcrumbs: Breadcrumb[]
}

export interface Breadcrumb {
  label: string
  href: string
  isActive: boolean
}

// API Response types
export interface CourseListResponse {
  courses: Course[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface SemesterListResponse {
  semesters: Semester[]
  total: number
  course: Course
}

// Component Props types
export interface CourseCardProps {
  course: Course
  onEnroll?: (courseId: string) => void
  onView?: (courseId: string) => void
  onEdit?: (course: Course) => void
  onDelete?: (courseId: string) => void
  showEnrollmentStatus?: boolean
  className?: string
}


export interface SemesterCardProps {
  semester: Semester
  onView?: (semesterId: string) => void
  showProgress?: boolean
  className?: string
}

export interface CourseHeaderProps {
  course: Course
  showProgress?: boolean
  showActions?: boolean
  className?: string
}

export interface SemesterHeaderProps {
  semester: Semester
  course: Course
  showProgress?: boolean
  showActions?: boolean
  className?: string
}

// Session types (alias for Semester with different naming)
export interface Session {
  id: string
  title: string
  description: string
  courseId: string
  order: number
  status: 'active' | 'inactive' | 'completed' | 'locked'
  isUnlocked: boolean
  estimatedTime: string
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  progress: number // 0-100
  totalTracks: number
  completedTracks: number
  learningTracks: LearningTrack[]
  prerequisites?: string[] // IDs of sessions that must be completed
}

export interface SessionCardProps {
  session: Session
  onView?: (sessionId: string) => void
  showProgress?: boolean
  className?: string
}
