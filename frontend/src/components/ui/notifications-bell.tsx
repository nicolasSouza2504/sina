"use client";

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockSubmissionService, StudentSubmission } from '@/lib/services/mockSubmissionService';
import { useRouter } from 'next/navigation';

export function NotificationsBell() {
  const router = useRouter();
  const [pendingSubmissions, setPendingSubmissions] = useState<StudentSubmission[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Carrega submissions pendentes
  useEffect(() => {
    loadPendingSubmissions();
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(loadPendingSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPendingSubmissions = () => {
    const pending = mockSubmissionService.getPendingSubmissions();
    setPendingSubmissions(pending);
  };

  const handleNotificationClick = (submission: StudentSubmission) => {
    // Redireciona para a página de gerenciamento de conteúdo
    router.push(`/professor/conteudo?taskId=${submission.taskId}&submissionId=${submission.id}`);
    setIsOpen(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInDays === 1) return 'Ontem';
    return `${diffInDays} dias atrás`;
  };

  const unreadCount = pendingSubmissions.length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-1 rounded-full hover:bg-white/10 transition-colors">
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {pendingSubmissions.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {pendingSubmissions.map((submission) => (
              <DropdownMenuItem
                key={submission.id}
                className="flex flex-col items-start p-3 cursor-pointer hover:bg-blue-50"
                onClick={() => handleNotificationClick(submission)}
              >
                <div className="flex items-start w-full">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    {submission.studentAvatar ? (
                      <img 
                        src={submission.studentAvatar} 
                        alt={submission.studentName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-semibold text-sm">
                        {submission.studentName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {submission.studentName}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      Enviou material: {submission.fileName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(submission.submittedAt)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {pendingSubmissions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => {
                router.push('/professor/conteudo');
                setIsOpen(false);
              }}
            >
              Ver todas as entregas
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

