"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, BookOpen, X } from 'lucide-react';
import { Course } from '@/lib/interfaces/courseInterfaces';
import type { KnowledgeTrailFormData } from '@/lib/interfaces/knowledgeTrailInterfaces';

interface Section {
  id: number;
  name: string;
  semester: number;
  courseId: number;
}

interface CreateKnowledgeTrailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  isLoadingCourses: boolean;
  onSubmit: (data: { name: string; sectionId: number }) => Promise<void>;
}

export default function CreateKnowledgeTrailModal({
  open,
  onOpenChange,
  courses,
  isLoadingCourses,
  onSubmit
}: CreateKnowledgeTrailModalProps) {
  const [formData, setFormData] = useState<KnowledgeTrailFormData>({
    name: '',
    courseId: '',
    sectionId: ''
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Atualiza as seções quando o curso é selecionado
  useEffect(() => {
    if (formData.courseId) {
      const course = courses.find(c => c.id.toString() === formData.courseId);
      setSelectedCourse(course || null);
      setAvailableSections(course?.sections || []);
      // Limpa a seção selecionada quando o curso muda
      setFormData(prev => ({ ...prev, sectionId: '' }));
    } else {
      setSelectedCourse(null);
      setAvailableSections([]);
    }
  }, [formData.courseId, courses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.name.trim()) {
      setError('O nome da trilha é obrigatório');
      return;
    }

    if (!formData.courseId) {
      setError('Selecione um curso');
      return;
    }

    if (!formData.sectionId) {
      setError('Selecione um semestre');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit({
        name: formData.name.trim(),
        sectionId: parseInt(formData.sectionId)
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar trilha');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', courseId: '', sectionId: '' });
      setSelectedCourse(null);
      setAvailableSections([]);
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  Nova Trilha de Conhecimento
                </DialogTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Crie uma nova trilha de aprendizado para seus alunos
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Nome da Trilha */}
            <div className="space-y-2">
              <Label htmlFor="trail-title" className="text-sm font-semibold text-gray-700">
                Nome da Trilha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="trail-title"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setError('');
                }}
                placeholder="Ex: Fundamentos de Programação"
                className="h-11 sm:h-12 text-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            
            {/* Seleção de Curso */}
            <div className="space-y-2">
              <Label htmlFor="trail-course" className="text-sm font-semibold text-gray-700">
                Curso <span className="text-red-500">*</span>
              </Label>
              {isLoadingCourses ? (
                <div className="flex items-center justify-center h-12 border-2 border-gray-200 rounded-xl">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Carregando cursos...</span>
                </div>
              ) : (
                <Select 
                  value={formData.courseId} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, courseId: value }));
                    setError('');
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-11 sm:h-12 text-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        Nenhum curso disponível
                      </div>
                    ) : (
                      courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()} className="py-3">
                          {course.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {/* Seleção de Semestre (Section) */}
            <div className="space-y-2">
              <Label htmlFor="trail-semester" className="text-sm font-semibold text-gray-700">
                Semestre <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.sectionId} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, sectionId: value }));
                  setError('');
                }}
                disabled={!formData.courseId || isSubmitting}
              >
                <SelectTrigger className="h-11 sm:h-12 text-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                  <SelectValue placeholder={
                    !formData.courseId 
                      ? "Selecione um curso primeiro" 
                      : "Selecione um semestre"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      {!formData.courseId 
                        ? "Selecione um curso primeiro" 
                        : "Nenhum semestre disponível"}
                    </div>
                  ) : (
                    availableSections.map(section => (
                      <SelectItem key={section.id} value={section.id.toString()} className="py-3">
                        {section.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Preview do Curso Selecionado */}
            {selectedCourse && (
              <div className="p-3 sm:p-4 bg-blue-50 border-2 border-blue-100 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Curso Selecionado:</span>
                  <span className="font-semibold text-gray-900">{selectedCourse.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total de Semestres:</span>
                  <span className="font-semibold text-gray-900">{selectedCourse.quantitySemester}</span>
                </div>
              </div>
            )}

            {/* Mensagem de Erro */}
            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-xs sm:text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}
            
            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto h-11 sm:h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-11 sm:h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Criar Trilha
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
