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

export default function SemesterPage({ params }: SemesterPageProps) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("overview")
  
  // TODO: Implement API integration to fetch course and semester data
  const course = null
  const semester = null
  
  if (!course || !semester) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso ou Semestre não encontrado</h1>
          <p className="text-muted-foreground mb-4">O curso ou semestre solicitado não existe ou não está disponível.</p>
          <Button asChild>
            <Link href="/cursos">Voltar para Meus Cursos</Link>
          </Button>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Placeholder content - will be implemented when API integration is ready */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Semestre Page</h1>
          <p className="text-muted-foreground">This page is under development.</p>
          <p>Course ID: {resolvedParams.courseId}</p>
          <p>Semester ID: {resolvedParams.semesterId}</p>
        </div>
      </div>
    </div>
  )
}