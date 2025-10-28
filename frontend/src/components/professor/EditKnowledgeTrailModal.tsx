"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Edit, X, Trophy, BookOpen } from 'lucide-react';
import type { EditKnowledgeTrailFormData } from '@/lib/interfaces/knowledgeTrailInterfaces';

interface EditKnowledgeTrailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trail: EditKnowledgeTrailFormData | null;
  onSubmit: (data: { id: number; name: string; sectionId: number; ranked: boolean }) => Promise<void>;
}

export default function EditKnowledgeTrailModal({
  open,
  onOpenChange,
  trail,
  onSubmit
}: EditKnowledgeTrailModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    ranked: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Atualiza o formulário quando a trilha muda
  useEffect(() => {
    if (trail) {
      setFormData({
        name: trail.name,
        ranked: trail.ranked
      });
      setError('');
    }
  }, [trail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trail) return;

    // Validações
    if (!formData.name.trim()) {
      setError('O nome da trilha é obrigatório');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit({
        id: trail.id,
        name: formData.name.trim(),
        sectionId: trail.sectionId,
        ranked: formData.ranked
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar trilha');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', ranked: false });
      setError('');
      onOpenChange(false);
    }
  };

  if (!trail) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Edit className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  Editar Trilha de Conhecimento
                </DialogTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Atualize as informações da trilha de aprendizado
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Nome da Trilha */}
            <div className="space-y-2">
              <Label htmlFor="edit-trail-name" className="text-sm font-semibold text-gray-700">
                Nome da Trilha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-trail-name"
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

            {/* Semestre (Fixo/Informativo) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Semestre
              </Label>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 shadow-md flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{trail.sectionName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Este campo não pode ser alterado</p>
                </div>
              </div>
            </div>
            
            {/* Campo Ranked (Checkbox) */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-100 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 shadow-md flex-shrink-0">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Rankeamento de Atividades</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Ative esta opção para habilitar o sistema de rankeamento das atividades entregues pelos alunos nesta trilha. 
                      O ranking será exibido em outra seção do sistema.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="edit-ranked"
                      checked={formData.ranked}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({ ...prev, ranked: checked as boolean }));
                        setError('');
                      }}
                      disabled={isSubmitting}
                      className="h-5 w-5 border-2 border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <Label
                      htmlFor="edit-ranked"
                      className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                    >
                      Habilitar rankeamento para esta trilha
                    </Label>
                  </div>
                </div>
              </div>
            </div>

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
                    Salvando...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Salvar Alterações
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
