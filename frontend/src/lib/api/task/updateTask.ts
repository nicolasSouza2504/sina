"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { Task } from '@/lib/interfaces/taskInterfaces';

export interface UpdateTaskPayload {
  courseId: number;
  knowledgeTrailId: number;
  name: string;
  description: string;
  difficultyLevel: 'FACIL' | 'MEDIO' | 'DIFICIL';
  dueDate?: string;
  taskOrder?: number;
}

export default async function UpdateTaskService(
  taskId: number,
  data: UpdateTaskPayload
): Promise<Task> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();
  
  try {
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login e tente novamente.');
    }

    const response = await fetch(`${baseURL}/task/update/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      if (response.status === 401) {
        const msg = 'Não autorizado. Faça login novamente.';
        if (typeof window !== "undefined") {
          const { toast } = await import("sonner");
          toast.error(msg);
        }
        throw new Error(msg);
      }
      
      if (response.status === 400) {
        const msg = errorData?.message || 'Dados inválidos para atualização da tarefa';
        if (typeof window !== "undefined") {
          const { toast } = await import("sonner");
          toast.error(msg);
        }
        throw new Error(msg);
      }
      
      if (response.status === 404) {
        const msg = 'Tarefa não encontrada';
        if (typeof window !== "undefined") {
          const { toast } = await import("sonner");
          toast.error(msg);
        }
        throw new Error(msg);
      }
      
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorData
      });
      
      throw new Error(`Request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
}
