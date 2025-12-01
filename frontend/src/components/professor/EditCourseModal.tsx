"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X, Edit, AlertCircle } from 'lucide-react';
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
      <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Editar Curso
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Atualize o nome do curso
              </p>
            </div>
          </div>
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
              className="h-12 text-sm sm:text-base border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
              disabled={isSubmitting}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Informações do Curso (Read-only) */}
          {course && (
            <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-3 text-sm">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">ID do Curso:</span>
                <span className="font-semibold text-gray-900">{course.id}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Semestres:</span>
                <span className="font-semibold text-gray-900">{course.quantitySemester}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Turmas:</span>
                <span className="font-semibold text-gray-900">{course.classes?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Seções:</span>
                <span className="font-semibold text-gray-900">{course.sections?.length || 0}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-8 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:ml-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
