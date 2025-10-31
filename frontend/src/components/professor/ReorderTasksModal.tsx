"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, GripVertical, Save, X } from 'lucide-react';
import { TaskSummary } from '@/lib/interfaces/courseContentInterfaces';

interface ReorderTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: TaskSummary[];
  trailName: string;
  onSubmit: (reorderedTasks: { taskId: number; newOrder: number }[]) => Promise<void>;
}

export default function ReorderTasksModal({
  open,
  onOpenChange,
  tasks,
  trailName,
  onSubmit
}: ReorderTasksModalProps) {
  const [orderedTasks, setOrderedTasks] = useState<TaskSummary[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && tasks) {
      // Ordena as tarefas pela ordem atual (taskOrder)
      const sorted = [...tasks].sort((a, b) => a.taskOrder - b.taskOrder);
      setOrderedTasks(sorted);
    }
  }, [open, tasks]);

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...orderedTasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newTasks.length) return;

    // Troca as posições
    [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
    
    setOrderedTasks(newTasks);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Cria o payload com todas as tarefas e suas novas ordens
      const payload = orderedTasks.map((task, index) => ({
        taskId: task.id,
        newOrder: index + 1 // Ordem começa em 1
      }));

      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao reordenar tarefas:', error);
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
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Reordenar Tarefas
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Trilha: <strong>{trailName}</strong>
          </p>
        </DialogHeader>

        <div className="space-y-2">
          {orderedTasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma tarefa para reordenar</p>
          ) : (
            orderedTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-blue-600 text-sm">#{index + 1}</span>
                    <span className="font-medium text-gray-900 truncate">{task.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Ordem atual: {task.taskOrder}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-600 truncate mt-1">{task.description}</p>
                  )}
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveTask(index, 'up')}
                    disabled={index === 0 || isSubmitting}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveTask(index, 'down')}
                    disabled={index === orderedTasks.length - 1 || isSubmitting}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
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
            disabled={isSubmitting || orderedTasks.length === 0}
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
                Salvar Ordem
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
