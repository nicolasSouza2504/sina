"use client"

import { useState, useCallback } from 'react'
import { Course, CourseFilters } from '@/lib/types/courseTypes'

interface UseCoursesReturn {
  courses: Course[]
  isLoading: boolean
  error: string | null
  createCourse: (courseData: Omit<Course, 'id'>) => Promise<Course>
  updateCourse: (id: string, courseData: Partial<Course>) => Promise<Course>
  deleteCourse: (id: string) => Promise<void>
  getCourse: (id: string) => Course | undefined
  refreshCourses: () => Promise<void>
}

/**
 * Custom hook for managing courses
 * Provides CRUD operations for courses with optimistic updates
 * Features:
 * - Create, read, update, delete operations
 * - Loading states and error handling
 * - Optimistic updates for better UX
 * - Local state management with persistence simulation
 */
export function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load courses from localStorage or API
  const loadCourses = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Always load default courses first for consistency
      const defaultCourses = await loadDefaultCourses()
      setCourses(defaultCourses)

      // Check if we're on the client side for localStorage
      if (typeof window !== 'undefined') {
        const storedCourses = localStorage.getItem('courses')
        if (storedCourses) {
          const parsedCourses = JSON.parse(storedCourses).map((course: any) => ({
            ...course,
            startDate: new Date(course.startDate),
            endDate: new Date(course.endDate),
            enrollmentDate: course.enrollmentDate ? new Date(course.enrollmentDate) : undefined
          }))
          setCourses(parsedCourses)
        } else {
          // Save default courses to localStorage
          localStorage.setItem('courses', JSON.stringify(defaultCourses))
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cursos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize courses on mount
  useState(() => {
    loadCourses()
  })

  // Create new course
  const createCourse = useCallback(async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    try {
      setIsLoading(true)
      setError(null)

      const newCourse: Course = {
        ...courseData,
        id: `course-${courses.length + 1}`,
        semesters: [],
        totalSemesters: 0,
        completedSemesters: 0,
        progress: 0,
        isEnrolled: false
      }

      // Optimistic update
      setCourses(prev => [...prev, newCourse])

      // Simulate API call
      await simulateApiCall(500)

      // Persist to localStorage (client-side only)
      if (typeof window !== 'undefined') {
        const updatedCourses = [...courses, newCourse]
        localStorage.setItem('courses', JSON.stringify(updatedCourses))
      }

      return newCourse
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar curso')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [courses])

  // Update existing course
  const updateCourse = useCallback(async (id: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      setIsLoading(true)
      setError(null)

      // Optimistic update
      setCourses(prev => prev.map(course => 
        course.id === id ? { ...course, ...courseData } : course
      ))

      // Simulate API call
      await simulateApiCall(300)

      // Update localStorage (client-side only)
      if (typeof window !== 'undefined') {
        const updatedCourses = courses.map(course => 
          course.id === id ? { ...course, ...courseData } : course
        )
        localStorage.setItem('courses', JSON.stringify(updatedCourses))
      }

      const updatedCourse = courses.find(c => c.id === id)!
      return { ...updatedCourse, ...courseData }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar curso')
      // Revert optimistic update
      setCourses(courses)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [courses])

  // Delete course
  const deleteCourse = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Optimistic update
      const courseToDelete = courses.find(c => c.id === id)
      setCourses(prev => prev.filter(course => course.id !== id))

      // Simulate API call
      await simulateApiCall(200)

      // Update localStorage (client-side only)
      if (typeof window !== 'undefined') {
        const updatedCourses = courses.filter(course => course.id !== id)
        localStorage.setItem('courses', JSON.stringify(updatedCourses))
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir curso')
      // Revert optimistic update
      setCourses(courses)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [courses])

  // Get single course
  const getCourse = useCallback((id: string): Course | undefined => {
    return courses.find(course => course.id === id)
  }, [courses])

  // Refresh courses
  const refreshCourses = useCallback(async () => {
    await loadCourses()
  }, [loadCourses])

  return {
    courses,
    isLoading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    refreshCourses
  }
}

// Helper functions
async function simulateApiCall(delay: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay))
}

async function loadDefaultCourses(): Promise<Course[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return [
    {
      id: 'ads-2024',
      title: 'ADS 2024',
      description: 'Análise e Desenvolvimento de Sistemas - Turma 2024. Curso completo de programação e desenvolvimento de software.',
      code: 'ADS',
      year: 2024,
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      color: '#3b82f6',
      semesters: [],
      totalSemesters: 8,
      completedSemesters: 2,
      progress: 25,
      instructor: {
        id: '1',
        name: 'João Silva',
        avatar: '/img/instructor1.jpg'
      },
      isEnrolled: true,
      enrollmentDate: new Date('2024-01-15')
    },
    {
      id: 'ads-2023',
      title: 'ADS 2023',
      description: 'Análise e Desenvolvimento de Sistemas - Turma 2023. Curso focado em tecnologias modernas e boas práticas.',
      code: 'ADS',
      year: 2023,
      status: 'active',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2025-12-31'),
      color: '#10b981',
      semesters: [],
      totalSemesters: 8,
      completedSemesters: 6,
      progress: 75,
      instructor: {
        id: '2',
        name: 'Maria Santos',
        avatar: '/img/instructor2.jpg'
      },
      isEnrolled: true,
      enrollmentDate: new Date('2023-01-10')
    },
    {
      id: 'si-2024',
      title: 'SI 2024',
      description: 'Sistemas de Informação - Turma 2024. Foco em gestão de sistemas e processos empresariais.',
      code: 'SI',
      year: 2024,
      status: 'active',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2026-12-31'),
      color: '#f59e0b',
      semesters: [],
      totalSemesters: 6,
      completedSemesters: 1,
      progress: 17,
      instructor: {
        id: '4',
        name: 'Ana Oliveira',
        avatar: '/img/instructor4.jpg'
      },
      isEnrolled: false
    }
  ]
}
