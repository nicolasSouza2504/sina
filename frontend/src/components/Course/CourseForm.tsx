"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Save, 
  X, 
  Calendar, 
  Palette,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Course } from '@/lib/types/courseTypes'

interface CourseFormProps {
  course?: Course
  onSubmit: (courseData: Omit<Course, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  className?: string
}

interface FormData {
  title: string
  description: string
  code: string
  year: number
  status: Course['status']
  startDate: string
  endDate: string
  color: string
  instructorName: string
  instructorAvatar?: string
}

interface FormErrors {
  title?: string
  description?: string
  code?: string
  year?: string
  startDate?: string
  endDate?: string
  color?: string
  instructorName?: string
}

/**
 * Course Form Component
 * Features:
 * - Create and edit course functionality
 * - Form validation with error handling
 * - Color picker for course branding
 * - Date validation and constraints
 * - Loading states and feedback
 * - Responsive design
 */
export function CourseForm({
  course,
  onSubmit,
  onCancel,
  isLoading = false,
  className
}: CourseFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    code: '',
    year: new Date().getFullYear(),
    status: 'active',
    startDate: '',
    endDate: '',
    color: '#3b82f6',
    instructorName: '',
    instructorAvatar: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-populate form when editing
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        code: course.code,
        year: course.year,
        status: course.status,
        startDate: course.startDate.toISOString().split('T')[0],
        endDate: course.endDate.toISOString().split('T')[0],
        color: course.color || '#3b82f6',
        instructorName: course.instructor?.name || '',
        instructorAvatar: course.instructor?.avatar || ''
      })
    }
  }, [course])

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Código do curso é obrigatório'
    } else if (formData.code.length < 2) {
      newErrors.code = 'Código deve ter pelo menos 2 caracteres'
    }

    if (formData.year < 2020 || formData.year > 2030) {
      newErrors.year = 'Ano deve estar entre 2020 e 2030'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Data de fim é obrigatória'
    } else if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      if (endDate <= startDate) {
        newErrors.endDate = 'Data de fim deve ser posterior à data de início'
      }
    }

    if (!formData.color) {
      newErrors.color = 'Cor é obrigatória'
    }

    if (!formData.instructorName.trim()) {
      newErrors.instructorName = 'Nome do instrutor é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      const courseData: Omit<Course, 'id'> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formData.code.trim().toUpperCase(),
        year: formData.year,
        status: formData.status,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        color: formData.color,
        sessions: course?.sessions || [],
        totalSessions: course?.totalSessions || 0,
        completedSessions: course?.completedSessions || 0,
        progress: course?.progress || 0,
        instructor: {
          id: course?.instructor?.id || `instructor-${Date.now()}`,
          name: formData.instructorName.trim(),
          avatar: formData.instructorAvatar?.trim() || undefined
        },
        isEnrolled: course?.isEnrolled || false,
        enrollmentDate: course?.enrollmentDate
      }

      await onSubmit(courseData)
    } catch (error) {
      console.error('Erro ao salvar curso:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }))
    }
  }

  // Predefined colors
  const colorOptions = [
    { value: '#3b82f6', label: 'Azul', preview: 'bg-blue-500' },
    { value: '#10b981', label: 'Verde', preview: 'bg-green-500' },
    { value: '#f59e0b', label: 'Amarelo', preview: 'bg-yellow-500' },
    { value: '#ef4444', label: 'Vermelho', preview: 'bg-red-500' },
    { value: '#8b5cf6', label: 'Roxo', preview: 'bg-purple-500' },
    { value: '#06b6d4', label: 'Ciano', preview: 'bg-cyan-500' },
    { value: '#f97316', label: 'Laranja', preview: 'bg-orange-500' },
    { value: '#84cc16', label: 'Lima', preview: 'bg-lime-500' }
  ]

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          {course ? 'Editar Curso' : 'Novo Curso'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Curso *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: ADS 2024"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código do Curso *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="Ex: ADS, SI, ENG"
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.code}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o curso, objetivos e público-alvo..."
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Ano *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  min="2020"
                  max="2030"
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.year}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: Course['status']) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Cor do Curso *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => handleInputChange('color', color.value)}
                        className={cn(
                          "w-6 h-6 rounded border-2",
                          color.preview,
                          formData.color === color.value && "ring-2 ring-offset-1 ring-primary"
                        )}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                {errors.color && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.color}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Datas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Fim *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Instrutor
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="instructorName">Nome do Instrutor *</Label>
              <Input
                id="instructorName"
                value={formData.instructorName}
                onChange={(e) => handleInputChange('instructorName', e.target.value)}
                placeholder="Ex: João Silva"
                className={errors.instructorName ? 'border-red-500' : ''}
              />
              {errors.instructorName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.instructorName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructorAvatar">Avatar (URL)</Label>
              <Input
                id="instructorAvatar"
                value={formData.instructorAvatar}
                onChange={(e) => handleInputChange('instructorAvatar', e.target.value)}
                placeholder="https://exemplo.com/avatar.jpg"
                type="url"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {course ? 'Atualizar' : 'Criar'} Curso
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
