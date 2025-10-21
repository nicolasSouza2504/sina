"use client";

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SuccessMessageProps {
  title: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  className?: string;
}

export function SuccessMessage({ 
  title, 
  message, 
  onClose, 
  autoClose = false,
  autoCloseDelay = 3000,
  className = ''
}: SuccessMessageProps) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 ${className}`}>
      <Card className="bg-white/95 backdrop-blur-md shadow-lg border-2 border-green-200">
        <div className="flex items-start gap-4 p-4 pr-12">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-green-900">{title}</h3>
            <p className="text-sm text-green-700">{message}</p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-2 right-2 h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

interface SuccessToastProps {
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function SuccessToast({ 
  title, 
  message, 
  isVisible, 
  onClose,
  autoClose = true,
  autoCloseDelay = 3000
}: SuccessToastProps) {
  if (!isVisible) return null;

  return (
    <SuccessMessage 
      title={title}
      message={message}
      onClose={onClose}
      autoClose={autoClose}
      autoCloseDelay={autoCloseDelay}
    />
  );
}

