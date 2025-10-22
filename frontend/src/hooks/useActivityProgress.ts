"use client"

import { useState, useEffect, useCallback } from 'react'
import { Activity, ActivityProgress, ActivitySubmission, UploadProgress } from '@/lib/types/activityTypes'

interface UseActivityProgressReturn {
  activity: Activity | null
  progress: ActivityProgress | null
  submission: ActivitySubmission | null
  isUploading: boolean
  uploadProgress: UploadProgress | null
  isLoading: boolean
  error: string | null
  completeActivity: () => Promise<void>
  uploadFile: (file: File) => Promise<void>
  updateProgress: (progress: number) => void
  markAsCompleted: () => void
}

/**
 * Custom hook for managing activity progress and submissions
 * Provides centralized state management for:
 * - Activity data and progress tracking
 * - File uploads with progress monitoring
 * - Completion status management
 * - Error handling and loading states
 */
export function useActivityProgress(activityId: string, userId: string = 'current-user'): UseActivityProgressReturn {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [progress, setProgress] = useState<ActivityProgress | null>(null)
  const [submission, setSubmission] = useState<ActivitySubmission | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load activity data and progress
  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API calls with mock data
        const mockActivity = await loadMockActivity(activityId)
        const mockProgress = await loadMockProgress(activityId, userId)
        const mockSubmission = await loadMockSubmission(activityId, userId)

        setActivity(mockActivity)
        setProgress(mockProgress)
        setSubmission(mockSubmission)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados da atividade')
      } finally {
        setIsLoading(false)
      }
    }

    loadActivityData()
  }, [activityId, userId])

  // Update progress in real-time
  const updateProgress = useCallback((newProgress: number) => {
    setProgress(prev => prev ? {
      ...prev,
      progress: Math.min(100, Math.max(0, newProgress)),
      lastAccessedAt: new Date()
    } : null)
  }, [])

  // Upload file with progress tracking
  const uploadFile = useCallback(async (file: File) => {
    try {
      setIsUploading(true)
      setUploadProgress({ loaded: 0, total: file.size, percentage: 0 })
      setError(null)

      // Simulate file upload with progress
      await simulateFileUpload(file, (progress) => {
        setUploadProgress(progress)
      })

      // Create submission record
      const newSubmission: ActivitySubmission = {
        id: `submission-${Date.now()}`,
        activityId,
        userId,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        mimeType: file.type,
        submittedAt: new Date(),
        status: 'pending'
      }

      setSubmission(newSubmission)
      
      // Auto-complete activity if file upload is required
      if (activity?.requiresUpload) {
        await completeActivity()
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar arquivo')
    } finally {
      setIsUploading(false)
      setUploadProgress(null)
    }
  }, [activity, activityId, userId])

  // Complete activity
  const completeActivity = useCallback(async () => {
    try {
      setError(null)

      // Update activity completion status
      setActivity(prev => prev ? { ...prev, completed: true, progress: 100 } : null)
      
      // Update progress
      setProgress(prev => prev ? {
        ...prev,
        isCompleted: true,
        completedAt: new Date(),
        progress: 100
      } : null)

      // Simulate API call to save completion
      await simulateSaveCompletion(activityId, userId)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar atividade como concluída')
    }
  }, [activityId, userId])

  // Mark as completed without upload
  const markAsCompleted = useCallback(async () => {
    await completeActivity()
  }, [completeActivity])

  return {
    activity,
    progress,
    submission,
    isUploading,
    uploadProgress,
    isLoading,
    error,
    completeActivity,
    uploadFile,
    updateProgress,
    markAsCompleted
  }
}

// Mock functions - In production, these would be API calls
async function loadMockActivity(activityId: string): Promise<Activity> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockActivities: Record<string, Activity> = {
    '1-1': {
      id: '1-1',
      title: 'Introdução ao HTML e CSS',
      description: 'Aprenda os fundamentos do HTML e CSS para criar páginas web estruturadas e estilizadas.',
      content: 'Conteúdo da atividade...',
      type: 'teórica',
      duration: '8-10 horas',
      difficulty: 'Iniciante',
      completed: false,
      progress: 0,
      resources: [
        {
          id: 'pdf-1',
          type: 'pdf',
          title: 'Material de Estudo - HTML e CSS',
          url: '/mock-pdfs/html-css-basics.pdf',
          isRequired: true
        }
      ],
      trilhaId: '1',
      trilhaTitle: 'Desenvolvimento Web - Fundamentos',
      requiresUpload: true,
      maxFileSize: 10,
      allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt']
    }
  }

  return mockActivities[activityId] || mockActivities['1-1']
}

async function loadMockProgress(activityId: string, userId: string): Promise<ActivityProgress> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    activityId,
    userId,
    isCompleted: false,
    progress: 0,
    timeSpent: 0,
    lastAccessedAt: new Date()
  }
}

async function loadMockSubmission(activityId: string, userId: string): Promise<ActivitySubmission | null> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Return null if no submission exists
  return null
}

async function simulateFileUpload(file: File, onProgress: (progress: UploadProgress) => void): Promise<void> {
  const total = file.size
  
  for (let loaded = 0; loaded <= total; loaded += total / 20) {
    await new Promise(resolve => setTimeout(resolve, 100))
    const percentage = Math.round((loaded / total) * 100)
    onProgress({ loaded, total, percentage })
  }
}

async function simulateSaveCompletion(activityId: string, userId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500))
  // In production, this would save to the backend
  console.log(`Activity ${activityId} completed by user ${userId}`)
}
