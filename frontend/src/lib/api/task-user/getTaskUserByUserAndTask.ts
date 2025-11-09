"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { TaskUserResponse } from '@/lib/interfaces/taskUserInterfaces';

export default async function GetTaskUserByUserAndTaskService(
  userId: number,
  taskId: number
): Promise<TaskUserResponse> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();
  
  try {
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login e tente novamente.');
    }

    const response = await fetch(`${baseURL}/user-task/user/${userId}/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token
      },
      cache: 'no-store'
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
      
      if (response.status === 404) {
        const msg = 'TaskUser não encontrado. O aluno ainda não iniciou esta tarefa.';
        console.log('[GetTaskUserByUserAndTaskService] TaskUser não encontrado:', { userId, taskId });
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
    console.log('[GetTaskUserByUserAndTaskService] TaskUser encontrado:', result.data);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar TaskUser:', error);
    throw error;
  }
}
