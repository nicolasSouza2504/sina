"use client"

import React, { useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SemesterCard } from '@/components/Course/SemesterCard'
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap,
  Play,
  CheckCircle,
  Lock,
  Brain,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Course, Semester } from '@/lib/types/courseTypes'

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

// Mock data - In production, this would come from an API
const mockCourses: Record<string, Course> = {
  'ads-2024': {
    id: 'ads-2024',
    title: 'ADS 2024',
    description: 'Análise e Desenvolvimento de Sistemas - Turma 2024. Curso completo de programação e desenvolvimento de software com foco em tecnologias modernas.',
    code: 'ADS',
    year: 2024,
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2026-12-31'),
    color: '#3b82f6',
    semesters: [],
    totalSemesters: 6,
    completedSemesters: 1,
    progress: 25,
    instructor: {
      id: '1',
      name: 'João Silva',
      avatar: '/img/instructor1.jpg'
    },
    isEnrolled: true,
    enrollmentDate: new Date('2024-01-15')
  }
}

const mockSemesters: Semester[] = [
  {
    id: 'semester-1',
    title: '1º Semestre - Fundamentos de Programação',
    description: 'Introdução aos conceitos básicos de programação, algoritmos e estruturas de dados essenciais.',
    courseId: 'ads-2024',
    courseTitle: 'ADS 2024',
    order: 1,
    status: 'completed',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    duration: '6 meses',
    learningTracks: [],
    totalTracks: 2,
    completedTracks: 2,
    progress: 100,
    isUnlocked: true,
    estimatedTime: '60-75 horas',
    difficulty: 'Iniciante'
  },
  {
    id: 'semester-2',
    title: '2º Semestre - Desenvolvimento Web',
    description: 'Aprenda HTML, CSS, JavaScript e conceitos de desenvolvimento web moderno.',
    courseId: 'ads-2024',
    courseTitle: 'ADS 2024',
    order: 2,
    status: 'active',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-12-31'),
    duration: '6 meses',
    learningTracks: [],
    totalTracks: 3,
    completedTracks: 1,
    progress: 45,
    isUnlocked: true,
    estimatedTime: '70-85 horas',
    difficulty: 'Iniciante'
  },
  {
    id: 'semester-3',
    title: '3º Semestre - Frameworks e Banco de Dados',
    description: 'Aprofunde-se em frameworks modernos e banco de dados avançados.',
    courseId: 'ads-2024',
    courseTitle: 'ADS 2024',
    order: 3,
    status: 'inactive',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-06-30'),
    duration: '6 meses',
    learningTracks: [],
    totalTracks: 4,
    completedTracks: 0,
    progress: 0,
    isUnlocked: true,
    estimatedTime: '80-100 horas',
    difficulty: 'Intermediário'
  },
  {
    id: 'semester-4',
    title: '4º Semestre - Desenvolvimento Full-Stack',
    description: 'Desenvolva aplicações completas com frontend e backend integrados.',
    courseId: 'ads-2024',
    courseTitle: 'ADS 2024',
    order: 4,
    status: 'inactive',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-31'),
    duration: '6 meses',
    learningTracks: [],
    totalTracks: 5,
    completedTracks: 0,
    progress: 0,
    isUnlocked: true,
    estimatedTime: '90-110 horas',
    difficulty: 'Intermediário'
  },
  {
    id: 'semester-5',
    title: '5º Semestre - Especialização e DevOps',
    description: 'Especialize-se em áreas específicas e aprenda DevOps e deployment.',
    courseId: 'ads-2024',
    courseTitle: 'ADS 2024',
    order: 5,
    status: 'inactive',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
    duration: '6 meses',
    learningTracks: [],
    totalTracks: 3,
    completedTracks: 0,
    progress: 0,
    isUnlocked: true,
    estimatedTime: '100-120 horas',
    difficulty: 'Avançado'
  },
  {
    id: 'semester-6',
    title: '6º Semestre - Projeto Final e Estágio',
    description: 'Desenvolva seu projeto final e participe do estágio supervisionado.',
    courseId: 'ads-2024',
    courseTitle: 'ADS 2024',
    order: 6,
    status: 'inactive',
    startDate: new Date('2026-07-01'),
    endDate: new Date('2026-12-31'),
    duration: '6 meses',
    learningTracks: [],
    totalTracks: 2,
    completedTracks: 0,
    progress: 0,
    isUnlocked: true,
    estimatedTime: '120-150 horas',
    difficulty: 'Avançado'
  }
]

/**
 * Course Detail Page Component
 * Features:
 * - Course overview with progress tracking
 * - Semesters listing with navigation
 * - Instructor information
 * - Statistics and achievements
 * - Responsive design
 */
export default function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = use(params)
  const course = mockCourses[resolvedParams.courseId]

  if (!course) {
    notFound()
  }

  const completedSemesters = mockSemesters.filter(semester => semester.status === 'completed').length
  const nextSemester = mockSemesters.find(semester => semester.status === 'active')

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/cursos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Meus Cursos
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/cursos" className="hover:underline">Meus Cursos</Link>
            <span>/</span>
            <span className="font-medium">{course.title}</span>
          </div>
        </div>

        {/* Course Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
            <p className="text-muted-foreground mt-2">{course.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.instructor?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(course.startDate)} - {formatDate(course.endDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                <span>{course.totalSemesters} semestres</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">Progresso do Curso:</h4>
                <Progress value={course.progress} className="w-64 mt-2" />
                <p className="text-sm text-muted-foreground mt-1">{course.progress}% Concluído</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Semestres Concluídos: {completedSemesters}/{course.totalSemesters}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {nextSemester ? (
                <Button asChild className="flex items-center gap-2">
                  <Link href={`/cursos/${resolvedParams.courseId}/semestre/${nextSemester.id}`}>
                    <Play className="w-4 h-4" />
                    Continuar Curso
                  </Link>
                </Button>
              ) : (
                <Button disabled className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Curso Concluído!
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Semesters List */}
        <h2 className="text-xl font-bold mb-4">Semestres do Curso</h2>
        <div className="space-y-4">
          {mockSemesters.map((semester) => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              courseId={course.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}