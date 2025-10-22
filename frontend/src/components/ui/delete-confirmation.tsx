"use client";

import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationProps {
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function DeleteConfirmation({ 
  title, 
  message, 
  itemName,
  onConfirm, 
  onCancel, 
  isVisible,
  confirmButtonText = 'Excluir',
  cancelButtonText = 'Cancelar'
}: DeleteConfirmationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <Card className="bg-white shadow-2xl border-2 border-red-200 max-w-md w-full mx-4">
        <div className="p-6 space-y-4">
          {/* Header com ícone de alerta */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                {itemName && (
                  <p className="text-sm text-gray-600 mt-1">
                    Item: <span className="font-semibold text-gray-900">"{itemName}"</span>
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mensagem */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Warning adicional */}
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <p className="text-xs text-yellow-800 font-medium flex items-center">
              <AlertCircle className="h-3 w-3 mr-2" />
              Esta ação não pode ser desfeita!
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-11 border-gray-300 hover:bg-gray-50 font-semibold"
            >
              {cancelButtonText}
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {confirmButtonText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface DeleteConfirmationState {
  isVisible: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
}

export function useDeleteConfirmation() {
  const [confirmationState, setConfirmationState] = React.useState<DeleteConfirmationState>({
    isVisible: false,
    title: '',
    message: '',
    itemName: '',
    onConfirm: () => {}
  });

  const showDeleteConfirmation = (
    title: string,
    message: string,
    itemName: string,
    onConfirm: () => void
  ) => {
    setConfirmationState({
      isVisible: true,
      title,
      message,
      itemName,
      onConfirm
    });
  };

  const hideDeleteConfirmation = () => {
    setConfirmationState(prev => ({ ...prev, isVisible: false }));
  };

  const handleConfirm = () => {
    confirmationState.onConfirm();
    hideDeleteConfirmation();
  };

  return {
    confirmationState,
    showDeleteConfirmation,
    hideDeleteConfirmation,
    handleConfirm
  };
}

