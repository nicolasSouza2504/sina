"use client";

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, GripVertical, Save, X, MoveVertical } from 'lucide-react';
import { TaskSummary } from '@/lib/interfaces/courseContentInterfaces';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ReorderTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: TaskSummary[];
  trailName: string;
  onSubmit: (reorderedTasks: { taskId: number; newOrder: number }[]) => Promise<void>;
}

interface SortableTaskItemProps {
  task: TaskSummary;
  index: number;
  originalOrder: number;
  hasChanged: boolean;
  isSubmitting: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function SortableTaskItem({
  task,
  index,
  originalOrder,
  hasChanged,
  isSubmitting,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-4 bg-white rounded-lg transition-all
        ${isDragging ? 'opacity-50 scale-105 shadow-2xl z-50' : 'shadow-sm'}
        ${hasChanged 
          ? 'border-2 border-amber-500' 
          : 'border-2 border-gray-200 hover:border-blue-300'
        }
      `}
    >
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1.5 sm:p-1 rounded-md bg-gray-100 text-gray-400 hover:text-blue-600"
        >
          <GripVertical className="h-5 w-5 sm:h-5 sm:w-5" />
        </div>

        {/* Conteúdo da Tarefa */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Número da Nova Posição */}
            <div className={`
              flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-[11px] sm:text-sm transition-colors
              ${hasChanged 
                ? 'bg-amber-500 text-white' 
                : 'bg-blue-500 text-white'
              }
            `}>
              {index + 1}
            </div>

            {/* Nome da Tarefa */}
            <span className="font-medium text-gray-900 text-sm sm:text-base break-words min-w-0 flex-1 leading-snug">
              {task.name}
            </span>

            {/* Badge de Ordem Original */}
            <Badge 
              variant="outline" 
              className="text-[9px] sm:text-xs bg-gray-100 border-gray-300 text-gray-600"
            >
              Original: #{originalOrder}
            </Badge>

            {/* Indicador de Alteração - Discreto */}
            {hasChanged && (
              <Badge 
                variant="outline"
                className="text-[9px] sm:text-xs bg-blue-50 border-blue-300 text-blue-700 flex items-center"
              >
                <MoveVertical className="h-3 w-3 mr-1" />
                Alterado
              </Badge>
            )}
          </div>

          {task.description && (
            <p className="text-[11px] sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 leading-tight">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Botões de Seta (Opcional - mantido para acessibilidade) */}
      <div className="flex gap-1.5 sm:gap-1 w-full sm:w-auto justify-end sm:justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onMoveUp}
          disabled={isFirst || isSubmitting}
          className="h-8 w-8 sm:h-8 sm:w-8 p-0"
          title="Mover para cima"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onMoveDown}
          disabled={isLast || isSubmitting}
          className="h-8 w-8 sm:h-8 sm:w-8 p-0"
          title="Mover para baixo"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function ReorderTasksModal({
  open,
  onOpenChange,
  tasks,
  trailName,
  onSubmit
}: ReorderTasksModalProps) {
  const [orderedTasks, setOrderedTasks] = useState<TaskSummary[]>([]);
  const [originalOrders, setOriginalOrders] = useState<Map<number, number>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requer 8px de movimento para iniciar o drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (open && tasks) {
      // Ordena as tarefas pela ordem atual (taskOrder)
      const sorted = [...tasks].sort((a, b) => a.taskOrder - b.taskOrder);
      setOrderedTasks(sorted);

      // Salva as ordens originais
      const ordersMap = new Map<number, number>();
      sorted.forEach((task, index) => {
        ordersMap.set(task.id, task.taskOrder);
      });
      setOriginalOrders(ordersMap);
    }
  }, [open, tasks]);

  // Verifica quais tarefas mudaram de posição
  const changedTasks = useMemo(() => {
    const changed = new Set<number>();
    orderedTasks.forEach((task, index) => {
      const originalOrder = originalOrders.get(task.id);
      const newOrder = index + 1;
      if (originalOrder !== newOrder) {
        changed.add(task.id);
      }
    });
    return changed;
  }, [orderedTasks, originalOrders]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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

  const hasAnyChanges = changedTasks.size > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[620px] max-h-[90vh] overflow-hidden flex flex-col p-3 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4 border-b">
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Reordenar Tarefas
          </DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Trilha: <strong>{trailName}</strong>
            </p>
            {hasAnyChanges && (
              <Badge className="bg-amber-500 text-white">
                {changedTasks.size} {changedTasks.size === 1 ? 'alteração' : 'alterações'}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Instruções */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 sm:p-4 mt-3">
          <p className="text-[11px] sm:text-sm text-gray-600 flex items-center gap-2">
            <GripVertical className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>
              Arraste e solte para reordenar ou use os botões de seta.
            </span>
          </p>
        </div>

        {/* Lista de Tarefas com Drag and Drop */}
        <div className="flex-1 overflow-y-auto mt-3 sm:mt-4 space-y-2 pr-1 sm:pr-2 pb-1">
          {orderedTasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma tarefa para reordenar</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {orderedTasks.map((task, index) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    originalOrder={originalOrders.get(task.id) || index + 1}
                    hasChanged={changedTasks.has(task.id)}
                    isSubmitting={isSubmitting}
                    onMoveUp={() => moveTask(index, 'up')}
                    onMoveDown={() => moveTask(index, 'down')}
                    isFirst={index === 0}
                    isLast={index === orderedTasks.length - 1}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Footer com Botões */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-100 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || orderedTasks.length === 0}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Ordem {hasAnyChanges && `(${changedTasks.size})`}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
