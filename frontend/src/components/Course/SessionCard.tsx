"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  BookOpen,
  ArrowRight,
  Users,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SessionCardProps } from '@/lib/types/courseTypes'
import Link from 'next/link'

/**
 * Session Card Component
 * Features:
 * - Session information with progress tracking
 * - Status indicators (locked, active, completed)
 * - Difficulty and time estimation
 * - Navigation to learning tracks
 * - Responsive design with accessibility
 */
export function SessionCard({
  session,
  onView,
  showProgress = true,
  className
}: SessionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'locked':
        return 'bg-gray-100 text-gray-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'locked':
        return <Lock className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800'
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800'
      case 'Avançado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa'
      case 'completed':
        return 'Concluída'
      case 'locked':
        return 'Bloqueada'
      case 'inactive':
        return 'Inativa'
      default:
        return 'Desconhecida'
    }
  }

  const canAccess = session.isUnlocked && session.status !== 'locked'

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300",
      !canAccess && "opacity-60 cursor-not-allowed",
      canAccess && "hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Sessão {session.order}
              </span>
              <Badge className={cn("flex items-center gap-1", getStatusColor(session.status))}>
                {getStatusIcon(session.status)}
                {getStatusLabel(session.status)}
              </Badge>
            </div>
            
            <CardTitle className="text-lg mb-2">{session.title}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {session.description}
            </p>
          </div>
        </div>

        {/* Session Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{session.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{session.totalTracks} trilhas</span>
          </div>
          <Badge variant="outline" className={getDifficultyColor(session.difficulty)}>
            {session.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-muted-foreground">{session.progress}%</span>
            </div>
            <Progress value={session.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{session.completedTracks} de {session.totalTracks} trilhas</span>
              <span>{session.progress}% concluído</span>
            </div>
          </div>
        )}

        {/* Learning Tracks Preview */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Trilhas de Conhecimento</span>
          </div>
          <div className="space-y-1">
            {session.learningTracks.slice(0, 3).map((track) => (
              <div key={track.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate flex-1 mr-2">
                  {track.title}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <span className="text-muted-foreground">{track.progress}%</span>
                </div>
              </div>
            ))}
            {session.learningTracks.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{session.learningTracks.length - 3} mais trilhas
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {canAccess ? (
            <Button asChild className="flex-1">
              <Link href={`/cursos/${session.courseId}/sessao/${session.id}`}>
                <BookOpen className="w-4 h-4 mr-2" />
                {session.status === 'completed' ? 'Revisar' : 'Acessar'}
              </Link>
            </Button>
          ) : (
            <Button disabled className="flex-1">
              <Lock className="w-4 h-4 mr-2" />
              Bloqueada
            </Button>
          )}
          
          {canAccess && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView?.(session.id)}
              className="px-3"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Prerequisites */}
        {session.prerequisites && session.prerequisites.length > 0 && !canAccess && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              <Lock className="w-3 h-3 inline mr-1" />
              Complete as sessões anteriores para desbloquear
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
