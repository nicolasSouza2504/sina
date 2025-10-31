"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar } from 'lucide-react';
import type { DifficultyLevel, TaskFormData } from '@/lib/interfaces/taskInterfaces';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: number;
  courseName: string;
  knowledgeTrailId: number;
  knowledgeTrailName: string;
  isRanked: boolean;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

const difficultyLevelMap: Record<string, DifficultyLevel> = {
  'Fácil': 'FACIL',
  'Médio': 'MEDIO',
  'Difícil': 'DIFICIL'
};

const difficultyLevelDisplay: Record<DifficultyLevel, string> = {
  'FACIL': 'Fácil',
  'MEDIO': 'Médio',
  'DIFICIL': 'Difícil'
};

export default function CreateTaskModal({
  open,
  onOpenChange,
  courseId,
  courseName,
  knowledgeTrailId,
  knowledgeTrailName,
  isRanked,
  onSubmit
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    difficultyLevel: 'FACIL',
    dueDate: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        description: '',
        difficultyLevel: 'FACIL',
        dueDate: undefined
      });
    }
  }, [open]);

  const handleSubmit = async () => {
    // Validações
    if (!formData.name.trim()) {
      return;
    }

    if (!formData.description.trim()) {
      return;
    }

    // Validar dueDate apenas para trilhas ranqueadas
    if (isRanked && !formData.dueDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Nova Tarefa
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Crie uma nova tarefa para a trilha de conhecimento</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Informações de Contexto (Read-only) */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Contexto da Tarefa</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-blue-600 font-medium">Curso</Label>
                  <div className="mt-1 px-3 py-2 bg-white border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{courseName}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-blue-600 font-medium">Trilha de Conhecimento</Label>
                  <div className="mt-1 px-3 py-2 bg-white border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{knowledgeTrailName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nome da Tarefa */}
            <div className="space-y-2">
              <Label htmlFor="task-name" className="text-sm font-semibold text-gray-700">
                Nome da Tarefa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="task-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Introdução à Programação"
                className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="task-description" className="text-sm font-semibold text-gray-700">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="task-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os objetivos e requisitos desta tarefa..."
                rows={4}
                className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl resize-none"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Aviso informativo sobre dificuldade */}
            {isRanked ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">🏆 Trilha Ranqueada</h4>
                    <p className="text-xs text-blue-700 mb-2">
                      Esta trilha possui sistema de ranqueamento. O nível de dificuldade afeta o <strong>multiplicador de pontos</strong> que os alunos receberão ao completar esta tarefa.
                    </p>
                    <div className="flex gap-3 text-xs">
                      <span className="inline-flex items-center gap-1 text-blue-700">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <strong>Fácil: 1x</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-blue-700">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <strong>Médio: 1.5x</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-blue-700">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <strong>Difícil: 2x</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Trilha não ranqueada</h4>
                    <p className="text-xs text-gray-700">
                      Esta trilha não possui sistema de ranqueamento. O nível de dificuldade é apenas informativo e não afeta pontuação.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dificuldade e Data de Entrega (condicional) */}
            <div className={isRanked ? "grid grid-cols-2 gap-4" : "space-y-2"}>
              <div className="space-y-2">
                <Label htmlFor="task-difficulty" className="text-sm font-semibold text-gray-700">
                  Nível de Dificuldade <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.difficultyLevel ? difficultyLevelDisplay[formData.difficultyLevel] : undefined} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    difficultyLevel: difficultyLevelMap[value] 
                  }))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    <SelectValue placeholder="Selecione a dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fácil" className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Fácil
                      </div>
                    </SelectItem>
                    <SelectItem value="Médio" className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Médio
                      </div>
                    </SelectItem>
                    <SelectItem value="Difícil" className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Difícil
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isRanked && (
                <div className="space-y-2">
                  <Label htmlFor="task-duedate" className="text-sm font-semibold text-gray-700">
                    Data de Entrega <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="task-duedate"
                      type="date"
                      value={formData.dueDate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      min={getMinDate()}
                      className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                      disabled={isSubmitting}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer com Botões */}
          <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 mt-6">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isSubmitting || !formData.name.trim() || !formData.description.trim() || !formData.difficultyLevel || (isRanked && !formData.dueDate)}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Tarefa
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
