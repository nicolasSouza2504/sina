"use client"

import React, { useState, useMemo } from 'react'
import { CourseCard } from '@/components/Course/CourseCard'
import { CourseModal } from '@/components/Course/CourseModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCourses } from '@/hooks/useCourses'
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Plus,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Course, CourseFilters } from '@/lib/types/courseTypes'

/**
 * Courses Page Component
 * Features:
 * - List all courses with filtering and search
 * - Add new courses via modal
 * - Edit existing courses
 * - Delete courses with confirmation
 * - Responsive grid layout
 * - Loading states and error handling
 */
export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<Course['status'] | "all">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const {
    courses,
    isLoading,
    error: coursesError,
    createCourse,
    updateCourse,
    deleteCourse,
    refreshCourses
  } = useCourses()

  // Filter courses based on search and status
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || course.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [courses, searchTerm, filterStatus])

  // Statistics
  const stats = useMemo(() => {
    const total = courses.length
    const active = courses.filter(c => c.status === 'active').length
    const completed = courses.filter(c => c.status === 'completed').length
    const enrolled = courses.filter(c => c.isEnrolled).length

    return { total, active, completed, enrolled }
  }, [courses])

  // Handle creating new course
  const handleCreateCourse = async (courseData: Omit<Course, 'id'>) => {
    try {
      setError(null)
      await createCourse(courseData)
      setIsModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar curso')
      throw err
    }
  }

  // Handle editing course
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setIsModalOpen(true)
  }

  // Handle updating course
  const handleUpdateCourse = async (courseData: Omit<Course, 'id'>) => {
    try {
      setError(null)
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData)
        setIsModalOpen(false)
        setEditingCourse(undefined)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar curso')
      throw err
    }
  }

  // Handle deleting course
  const handleDeleteCourse = async (courseId: string) => {
    try {
      setError(null)
      await deleteCourse(courseId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir curso')
    }
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCourse(undefined)
    setError(null)
  }

  // Handle modal submit
  const handleModalSubmit = editingCourse ? handleUpdateCourse : handleCreateCourse

  if (coursesError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar cursos: {coursesError}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Meus Cursos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus cursos e acompanhe seu progresso
            </p>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Curso
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inscritos</p>
                  <p className="text-2xl font-bold">{stats.enrolled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={(value: Course['status'] | "all") => setFilterStatus(value)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={refreshCourses}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Courses Grid */}
        {isLoading && courses.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando cursos...</p>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterStatus !== "all" ? "Nenhum curso encontrado" : "Nenhum curso cadastrado"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "Tente ajustar os filtros ou termos de busca."
                : "Comece criando seu primeiro curso."
              }
            </p>
            {(!searchTerm && filterStatus === "all") && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Curso
              </Button>
            )}
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                showEnrollmentStatus={true}
              />
            ))}
          </div>
        )}

        {/* Course Modal */}
        <CourseModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          course={editingCourse}
          onSubmit={handleModalSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}