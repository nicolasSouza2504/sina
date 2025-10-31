"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, AlertCircle } from 'lucide-react';

type DifficultyLevel = 'FACIL' | 'MEDIO' | 'DIFICIL';

interface EditTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    id: number;
    name: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    dueDate?: string;
    courseId: number;
    knowledgeTrailId: number;
    taskOrder: number;
    isRanked: boolean;
  } | null;
  onSubmit: (data: {
    id: number;
    name: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    dueDate?: string;
    courseId: number;
    knowledgeTrailId: number;
    taskOrder: number;
  }) => Promise<void>;
}

export default function EditTaskModal({
  open,
  onOpenChange,
  task,
  onSubmit
}: EditTaskModalProps) {
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    description: '',
    difficultyLevel: 'MEDIO' as DifficultyLevel,
    dueDate: '',
    courseId: 0,
    knowledgeTrailId: 0,
    taskOrder: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && task) {
      // Converter dueDate de ISO para formato de input date (YYYY-MM-DD)
      let dueDateForInput = '';
      if (task.dueDate) {
        try {
          const date = new Date(task.dueDate);
          dueDateForInput = date.toISOString().split('T')[0];
        } catch (e) {
          console.error('Erro ao converter data:', e);
        }
      }

      setFormData({
        id: task.id,
        name: task.name,
        description: task.description,
        difficultyLevel: task.difficultyLevel,
        dueDate: dueDateForInput,
        courseId: task.courseId,
        knowledgeTrailId: task.knowledgeTrailId,
        taskOrder: task.taskOrder
      });
      setError('');
    }
  }, [open, task]);

  const handleSubmit = async () => {
    // Validações
    if (!formData.name.trim()) {
      setError('O nome é obrigatório');
      return;
    }

    if (!formData.description.trim()) {
      setError('A descrição é obrigatória');
      return;
    }

    // Se a trilha for ranqueada, data é obrigatória
    if (task?.isRanked && !formData.dueDate) {
      setError('A data de entrega é obrigatória para trilhas ranqueadas');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit(formData);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar tarefa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Editar Tarefa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Aviso sobre tipo de trilha */}
          {task?.isRanked ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                🏆 Trilha Ranqueada - O nível de dificuldade afeta o multiplicador de pontos
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Fácil: 1x | Médio: 1.5x | Difícil: 2x
              </p>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700">
                Trilha não ranqueada - O nível de dificuldade é apenas informativo
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="edit-task-name" className="text-sm font-medium text-gray-700">
              Nome da Tarefa *
            </Label>
            <Input
              id="edit-task-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome da tarefa"
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-task-description" className="text-sm font-medium text-gray-700">
              Descrição *
            </Label>
            <Textarea
              id="edit-task-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva a tarefa"
              rows={4}
              disabled={isSubmitting}
              className="mt-1 resize-none"
            />
          </div>

          <div className={task?.isRanked ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : ""}>
            <div>
              <Label htmlFor="edit-task-difficulty" className="text-sm font-medium text-gray-700">
                Nível de Dificuldade *
              </Label>
              <Select 
                value={formData.difficultyLevel} 
                onValueChange={(value: DifficultyLevel) => setFormData(prev => ({ ...prev, difficultyLevel: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FACIL">😊 Fácil</SelectItem>
                  <SelectItem value="MEDIO">🤔 Médio</SelectItem>
                  <SelectItem value="DIFICIL">🔥 Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {task?.isRanked && (
              <div>
                <Label htmlFor="edit-task-duedate" className="text-sm font-medium text-gray-700">
                  Data de Entrega *
                </Label>
                <Input
                  id="edit-task-duedate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  disabled={isSubmitting}
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-100">
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
