"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { Course } from '@/lib/interfaces/courseInterfaces';

interface EditCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onSave: (courseId: number, newName: string, quantitySemester: number) => Promise<void>;
}

export default function EditCourseModal({ open, onOpenChange, course, onSave }: EditCourseModalProps) {
  const [courseName, setCourseName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (course) {
      setCourseName(course.name);
      setError('');
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!course) return;
    
    // Validação
    if (!courseName.trim()) {
      setError('O nome do curso é obrigatório');
      return;
    }

    if (courseName.trim() === course.name) {
      setError('O nome não foi alterado');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave(course.id, courseName.trim(), course.quantitySemester);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCourseName(course?.name || '');
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Editar Curso</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Atualize o nome do curso
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="courseName" className="text-sm font-semibold text-gray-700">
              Nome do Curso <span className="text-red-500">*</span>
            </Label>
            <Input
              id="courseName"
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                setError('');
              }}
              placeholder="Digite o nome do curso"
              className="h-11 sm:h-12 text-sm sm:text-base"
              disabled={isSubmitting}
              autoFocus
            />
            {error && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          {/* Informações do Curso (Read-only) */}
          {course && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID do Curso:</span>
                <span className="font-semibold">{course.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Semestres:</span>
                <span className="font-semibold">{course.quantitySemester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Turmas:</span>
                <span className="font-semibold">{course.classes?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seções:</span>
                <span className="font-semibold">{course.sections?.length || 0}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
