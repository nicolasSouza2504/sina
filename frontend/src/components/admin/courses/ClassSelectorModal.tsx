"use client";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, BookOpen, X } from 'lucide-react';
import type { Class } from '@/lib/interfaces/classInterfaces';

interface ClassSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableClasses: Class[];
  selectedClassIds: number[];
  onConfirm: (selectedIds: number[]) => void;
  isLoading?: boolean;
}

export default function ClassSelectorModal({
  open,
  onOpenChange,
  availableClasses,
  selectedClassIds,
  onConfirm,
  isLoading = false,
}: ClassSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);

  // Sincroniza seleção temporária quando o modal abre
  useEffect(() => {
    if (open) {
      setTempSelectedIds([...selectedClassIds]);
      setSearchTerm('');
    }
  }, [open, selectedClassIds]);

  // Filtra turmas por nome
  const filteredClasses = availableClasses.filter((classItem) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = classItem.nome?.toLowerCase().includes(searchLower) || false;
    const codeMatch = classItem.code?.toLowerCase().includes(searchLower) || false;
    return nameMatch || codeMatch;
  });

  const handleToggle = (classId: number) => {
    setTempSelectedIds((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSelectAll = () => {
    if (tempSelectedIds.length === filteredClasses.length) {
      // Desmarcar todos os filtrados
      const filteredIds = filteredClasses.map(c => c.id);
      setTempSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Marcar todos os filtrados
      const allFilteredIds = filteredClasses.map((c) => c.id);
      setTempSelectedIds(prev => {
        const newIds = [...prev];
        allFilteredIds.forEach(id => {
          if (!newIds.includes(id)) {
            newIds.push(id);
          }
        });
        return newIds;
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    onOpenChange(false);
  };

  const getImagePath = (imageName: string | null) => {
        if (!imageName) return "/placeholder.svg";
        return `/img/${imageName}`;
  };

  const handleCancel = () => {
    setTempSelectedIds([...selectedClassIds]);
    onOpenChange(false);
  };

  const allFilteredSelected = filteredClasses.length > 0 && 
    filteredClasses.every(c => tempSelectedIds.includes(c.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Turmas</DialogTitle>
          <DialogDescription>
            Busque e selecione as turmas que farão parte deste curso
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou código da turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Contador e Selecionar Todos */}
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={allFilteredSelected}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium cursor-pointer"
              >
                Selecionar todos
              </label>
            </div>
            <Badge variant="secondary">
              {tempSelectedIds.length} selecionada(s)
            </Badge>
          </div>

          {/* Lista de Turmas */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Carregando turmas...</span>
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                {searchTerm ? (
                  <>
                    <p>Nenhuma turma encontrada</p>
                    <p className="text-sm">Tente buscar com outros termos</p>
                  </>
                ) : (
                  <>
                    <p>Nenhuma turma disponível</p>
                    <p className="text-sm">Crie turmas primeiro para associá-las ao curso</p>
                  </>
                )}
              </div>
            ) : (
              <>
                {filteredClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                    tempSelectedIds.includes(classItem.id) ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <Checkbox
                    id={`modal-class-${classItem.id}`}
                    checked={tempSelectedIds.includes(classItem.id)}
                    onCheckedChange={() => handleToggle(classItem.id)}
                  />
                  <label
                    htmlFor={`modal-class-${classItem.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{classItem.nome || 'Sem nome'}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {classItem.code && (
                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {classItem.code}
                            </span>
                          )}
                          {classItem.semester && (
                            <span>{classItem.semester}º Semestre</span>
                          )}
                        </div>
                      </div>
                      {classItem.imgClass && (
                        <img
                          src={getImagePath(classItem.imgClass)}
                          alt={classItem.nome || 'Turma'}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                    </div>
                  </label>
                </div>
                ))}
              </>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={tempSelectedIds.length === 0}
            className="w-full sm:w-auto"
          >
            Confirmar ({tempSelectedIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
