"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CourseForm } from '@/components/Course/CourseForm'
import { Course } from '@/lib/types/courseTypes'

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  course?: Course
  onSubmit: (courseData: Omit<Course, 'id'>) => Promise<void>
  isLoading?: boolean
}

/**
 * Course Modal Component
 * Features:
 * - Modal wrapper for course form
 * - Handles create and edit modes
 * - Responsive design
 * - Proper accessibility
 */
export function CourseModal({
  isOpen,
  onClose,
  course,
  onSubmit,
  isLoading = false
}: CourseModalProps) {
  const handleSubmit = async (courseData: Omit<Course, 'id'>) => {
    try {
      await onSubmit(courseData)
      onClose()
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Erro no modal:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {course ? 'Editar Curso' : 'Novo Curso'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <CourseForm
            course={course}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
