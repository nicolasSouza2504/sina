"use client"

import React, { useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Brain,
  Play,
  CheckCircle,
  Lock,
  TrendingUp,
  Target,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Course, Semester } from '@/lib/types/courseTypes'
import { LearningTrack } from '@/lib/types/activityTypes'
import { LearningTrackCard } from '@/components/KnowledgeTrail/learning_track_card'

interface SemesterPageProps {
  params: Promise<{
    courseId: string
    semesterId: string
  }>
}

// Mock data
const mockCourses: Record<string, Course> = {
  'ads-2024': {
    id: 'ads-2024',
    title: 'ADS 2024',
    description: 'Análise e Desenvolvimento de Sistemas - Turma 2024',
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
      name: 'João Silva'
    },
    isEnrolled: true
  }
}

const mockSemesters: Record<string, Semester> = {
  'semester-1': {
    id: 'semester-1',
    title: '1º Semestre - Fundamentos de Programação',
    description: 'Introdução aos conceitos básicos de programação, algoritmos e estruturas de dados. Este semestre estabelece as bases fundamentais para todo o desenvolvimento de software.',
    courseId: 'ads-2024',
    courseTitle: 'ADS 2024',
    order: 1,
    status: 'completed',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    duration: '6 meses',
    learningTracks: [
      {
        id: '1',
        title: 'Desenvolvimento Web - Fundamentos',
        description: 'Aprenda os fundamentos essenciais para se tornar um desenvolvedor web, desde HTML e CSS até JavaScript básico.',
        progress: 75,
        totalActivities: 3,
        completedActivities: 2,
        estimatedTime: '35-45 horas',
        difficulty: 'Iniciante',
        activities: [
          {
            id: '1-1',
            title: 'Introdução ao HTML e CSS',
            icon: <BookOpen className="w-5 h-5" />,
            completed: false,
            pdfUrl: '/pdfs/introducao-html-css.pdf',
          },
          {
            id: '1-2',
            title: 'JavaScript Básico',
            icon: <BookOpen className="w-5 h-5" />,
            completed: true,
            pdfUrl: '/pdfs/javascript-basico.pdf',
          },
          {
            id: '1-3',
            title: 'Projeto Prático - Landing Page',
            icon: <BookOpen className="w-5 h-5" />,
            completed: false,
          },
        ],
        isCompleted: false
      },
      {
        id: '2',
        title: 'Banco de Dados e SQL',
        description: 'Domine os conceitos de banco de dados relacionais e a linguagem SQL para gerenciar dados de forma eficiente.',
        progress: 100,
        totalActivities: 3,
        completedActivities: 3,
        estimatedTime: '25-30 horas',
        difficulty: 'Iniciante',
        activities: [
          {
            id: '2-1',
            title: 'Fundamentos de Banco de Dados',
            icon: <BookOpen className="w-5 h-5" />,
            completed: true,
            pdfUrl: '/pdfs/fundamentos-bd.pdf',
          },
          {
            id: '2-2',
            title: 'Consultas SQL Avançadas',
            icon: <BookOpen className="w-5 h-5" />,
            completed: true,
            pdfUrl: '/pdfs/consultas-sql.pdf',
          },
          {
            id: '2-3',
            title: 'Modelagem de Dados',
            icon: <BookOpen className="w-5 h-5" />,
            completed: true,
          },
        ],
        isCompleted: true
      }
    ],
    totalTracks: 2,
    completedTracks: 1,
    progress: 87,
    isUnlocked: true,
    estimatedTime: '60-75 horas',
    difficulty: 'Iniciante'
  },
  'semester-2': {
    id: 'semester-2',
    title: '2º Semestre - Desenvolvimento Web',
    description: 'Aprofunde seus conhecimentos em desenvolvimento web com frameworks modernos e conceitos avançados de frontend e backend.',
    courseId: 'ads-2024',
    courseTitle: 'ADS 2024',
    order: 2,
    status: 'active',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-12-31'),
    duration: '6 meses',
    learningTracks: [
      {
        id: '3',
        title: 'React e Desenvolvimento Frontend',
        description: 'Domine React e suas bibliotecas para criar aplicações modernas, responsivas e escaláveis.',
        progress: 45,
        totalActivities: 4,
        completedActivities: 1,
        estimatedTime: '40-50 horas',
        difficulty: 'Intermediário',
        activities: [
          {
            id: '3-1',
            title: 'Introdução ao React',
            icon: <BookOpen className="w-5 h-5" />,
            completed: true,
          },
          {
            id: '3-2',
            title: 'Hooks e Estado',
            icon: <BookOpen className="w-5 h-5" />,
            completed: false,
          },
          {
            id: '3-3',
            title: 'Roteamento com React Router',
            icon: <BookOpen className="w-5 h-5" />,
            completed: false,
          },
          {
            id: '3-4',
            title: 'Projeto - Dashboard Interativo',
            icon: <BookOpen className="w-5 h-5" />,
            completed: false,
          },
        ],
        isCompleted: false
      },
      {
        id: '4',
        title: 'Design e UX/UI',
        description: 'Aprenda princípios de design e experiência do usuário para criar interfaces intuitivas e atraentes.',
        progress: 20,
        totalActivities: 3,
        completedActivities: 0,
        estimatedTime: '30-35 horas',
        difficulty: 'Iniciante',
        activities: [
          {
            id: '4-1',
            title: 'Fundamentos de Design',
            icon: <BookOpen className="w-5 h-5" />,
            completed: false,
          },
          {
            id: '4-2',
            title: 'Figma e Prototipagem',
            icon: <BookOpen className="w-5 h-5" />,
            completed: false,
          },
          {
            id: '4-3',
            title: 'Projeto - Redesign de App',
            icon: <BookOpen className="w-5 h-5" />,
            completed: false,
          },
        ],
        isCompleted: false
      }
    ],
    totalTracks: 2,
    completedTracks: 0,
    progress: 32,
    isUnlocked: true,
    estimatedTime: '70-85 horas',
    difficulty: 'Intermediário'
  }
}

/**
 * Semester Detail Page Component
 * Features:
 * - Semester overview with progress tracking
 * - Learning tracks listing with navigation
 * - Course context and navigation
 * - Statistics and achievements
 * - Responsive design
 */
export default function SemesterPage({ params }: SemesterPageProps) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("overview")
  
  const course = mockCourses[resolvedParams.courseId]
  const semester = mockSemesters[resolvedParams.semesterId]
  
  if (!course || !semester) {
    notFound()
  }

  // Find the first incomplete learning track
  const nextTrack = semester.learningTracks.find(track => !track.isCompleted)
  
  // If all tracks are completed, find the first track with incomplete activities
  const nextTrackWithIncompleteActivities = semester.learningTracks.find(track => 
    track.completedActivities < track.totalActivities
  )
  
  // Fallback: if no incomplete tracks, use the first track
  const targetTrack = nextTrack || nextTrackWithIncompleteActivities || semester.learningTracks[0]
  const completedTracks = semester.learningTracks.filter(track => track.isCompleted)
  
  const totalTracks = semester.learningTracks.length
  const totalActivities = semester.learningTracks.reduce((total, track) => total + track.totalActivities, 0)
  const completedActivities = semester.learningTracks.reduce((total, track) => total + track.completedActivities, 0)

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
      case 'locked':
        return 'bg-gray-100 text-gray-800'
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
              <Link href={`/cursos/${resolvedParams.courseId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Curso
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/cursos" className="hover:underline">Meus Cursos</Link>
            <span>/</span>
            <Link href={`/cursos/${resolvedParams.courseId}`} className="hover:underline">{course.title}</Link>
            <span>/</span>
            <span className="font-medium">{semester.title}</span>
          </div>
        </div>

        {/* Semester Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-3 text-3xl font-bold mb-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                    {semester.order}
                  </div>
                  {semester.title}
                </CardTitle>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  {semester.description}
                </p>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={cn("flex items-center gap-1", getStatusColor(semester.status))}>
                    {semester.status === 'active' ? 'Ativo' : 
                     semester.status === 'completed' ? 'Concluído' : 'Bloqueado'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {semester.estimatedTime}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{semester.progress}%</div>
                <div className="text-sm text-muted-foreground">Concluído</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso do Semestre</span>
                <span className="text-sm text-muted-foreground">
                  {semester.completedTracks} de {semester.totalTracks} trilhas
                </span>
              </div>
              <Progress value={semester.progress} className="h-3" />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedTracks.length}</div>
                <div className="text-xs text-green-700">Trilhas Concluídas</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{completedActivities}</div>
                <div className="text-xs text-blue-700">Atividades Concluídas</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{totalTracks}</div>
                <div className="text-xs text-purple-700">Total Trilhas</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{totalActivities}</div>
                <div className="text-xs text-orange-700">Total Atividades</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {targetTrack ? (
                <Button asChild className="flex items-center gap-2">
                  <Link href={`/trilhas/${targetTrack.id}`}>
                    <Play className="w-4 h-4" />
                    Continuar Semestre
                  </Link>
                </Button>
              ) : semester.status === 'completed' ? (
                <Button className="flex items-center gap-2" disabled>
                  <CheckCircle className="w-4 h-4" />
                  Semestre Concluído
                </Button>
              ) : (
                <Button className="flex items-center gap-2" disabled>
                  <Lock className="w-4 h-4" />
                  Semestre Bloqueado
                </Button>
              )}
              
              <Button variant="outline">
                Ver Certificado
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Learning Tracks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Trilhas de Conhecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {semester.learningTracks.map((track) => (
                <LearningTrackCard
                  key={track.id}
                  title={track.title}
                  progress={track.progress}
                  activities={track.activities}
                  trilhaId={track.id}
                  showDetailsButton={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}