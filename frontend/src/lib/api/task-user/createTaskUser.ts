"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { TaskUserRegister, TaskUserResponseDTO } from '@/lib/interfaces/taskUserInterfaces';

export default async function CreateTaskUserService(
  data: TaskUserRegister
): Promise<TaskUserResponseDTO> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();
  
  try {
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login e tente novamente.');
    }

    console.log('[CreateTaskUserService] Criando TaskUser:', data);

    const response = await fetch(`${baseURL}/user-task`, {
      method: 'POST',
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
        throw new Error(msg);
      }
      
      if (response.status === 400) {
        const msg = errorData?.message || 'Dados inválidos para criação do TaskUser';
        throw new Error(msg);
      }
      
      if (response.status === 404) {
        const msg = 'Usuário não encontrado';
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
    console.log('[CreateTaskUserService] TaskUser criado:', result.data);
    return result.data;
  } catch (error) {
    console.error('Erro ao criar TaskUser:', error);
    throw error;
  }
}
