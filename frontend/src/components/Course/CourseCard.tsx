"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle, 
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Play, 
  MoreVertical,
  Clock,
  GraduationCap,
  CheckCircle,
  Lock,
  Edit,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CourseCardProps } from '@/lib/types/courseTypes'
import Link from 'next/link'

/**
 * Course Card Component
 * Features:
 * - Course information display with image, title, and description
 * - Progress tracking and status indicators
 * - Enrollment status and actions
 * - Responsive design with hover effects
 * - Accessibility support
 */
export function CourseCard({
  course,
  onEnroll,
  onView,
  onEdit,
  onDelete,
  showEnrollmentStatus = true,
  className
}: CourseCardProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'inactive':
        return <Lock className="w-4 h-4" />
      case 'draft':
        return <BookOpen className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const getInitials = (title: string) => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      course.status === 'inactive' && "opacity-60",
      className
    )}>
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: course.color || '#3b82f6' }}
          >
            {getInitials(course.title)}
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={cn("flex items-center gap-1", getStatusColor(course.status))}>
            {getStatusIcon(course.status)}
            {course.status === 'active' ? 'Ativo' : 
             course.status === 'completed' ? 'Concluído' :
             course.status === 'inactive' ? 'Inativo' : 'Rascunho'}
          </Badge>
        </div>

        {/* Menu Button */}
        <div className="absolute top-3 left-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onEdit?.(course)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Curso
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e: any) => e.preventDefault()} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Curso
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o curso "{course.title}"? 
                      Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete?.(course.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>

        {/* Course Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(course.startDate)} - {formatDate(course.endDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.totalSessions} sessões</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Instructor */}
        {course.instructor && (
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-6 h-6">
              <AvatarImage src={course.instructor.avatar} />
              <AvatarFallback className="text-xs">
                {course.instructor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Prof. {course.instructor.name}
            </span>
          </div>
        )}

        {/* Progress */}
        {showEnrollmentStatus && course.isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-muted-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{course.completedSessions} de {course.totalSessions} sessões</span>
              <span>{course.progress}% concluído</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/cursos/${course.id}`}>
              <BookOpen className="w-4 h-4 mr-2" />
              {course.isEnrolled ? 'Continuar' : 'Ver Detalhes'}
            </Link>
          </Button>
          
          {!course.isEnrolled && course.status === 'active' && (
            <Button 
              variant="outline" 
              onClick={() => onEnroll?.(course.id)}
              className="px-3"
            >
              <GraduationCap className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Enrollment Status */}
        {showEnrollmentStatus && (
          <div className="mt-3 text-center">
            {course.isEnrolled ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Inscrito
              </Badge>
            ) : course.status === 'active' ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Disponível
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                <Lock className="w-3 h-3 mr-1" />
                Indisponível
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
