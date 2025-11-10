"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { UserResponseRegister, UserResponseResponse } from '@/lib/interfaces/userResponseInterfaces';

export default async function CreateUserResponseService(
  data: UserResponseRegister
): Promise<UserResponseResponse> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();
  
  try {
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login e tente novamente.');
    }

    console.log('[CreateUserResponseService] Criando UserResponse:', data);

    const response = await fetch(`${baseURL}/user-response`, {
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
        const msg = errorData?.message || 'Dados inválidos para criação da resposta';
        throw new Error(msg);
      }
      
      if (response.status === 404) {
        const msg = 'TaskUser não encontrado';
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
    console.log('[CreateUserResponseService] UserResponse criado:', result.data);
    return result.data;
  } catch (error) {
    console.error('Erro ao criar UserResponse:', error);
    throw error;
  }
}
