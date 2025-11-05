"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteTaskContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentName: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteTaskContentModal({
  open,
  onOpenChange,
  contentName,
  onConfirm,
  isDeleting = false,
}: DeleteTaskContentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[450px] sm:max-w-[500px]">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-600 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Confirmar Exclusão
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Aviso */}
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 mb-1">
                  Você está prestes a excluir este conteúdo:
                </p>
                <p className="text-sm text-red-800 font-medium break-words">
                  "{contentName}"
                </p>
              </div>
            </div>
          </div>

          {/* Informação adicional */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600">
              O conteúdo será removido permanentemente e não poderá ser recuperado. 
              Os alunos não terão mais acesso a este material.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto order-2 sm:order-1 h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto order-1 sm:order-2 h-11 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Confirmar Exclusão
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
