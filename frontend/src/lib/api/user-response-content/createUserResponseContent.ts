"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { UserResponseContentRegister, UserResponseContentResponse } from '@/lib/interfaces/userResponseInterfaces';

export default async function CreateUserResponseContentService(
  data: UserResponseContentRegister,
  file: File
): Promise<UserResponseContentResponse> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();
  
  try {
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login e tente novamente.');
    }

    console.log('[CreateUserResponseContentService] Criando UserResponseContent:', {
      userResponseId: data.userResponseId,
      name: data.name,
      contentType: data.contentType,
      fileName: file.name,
      fileSize: file.size
    });

    // Criar FormData para enviar arquivo + dados
    const formData = new FormData();
    formData.append('userContentStr', JSON.stringify(data));
    formData.append('file', file);

    const response = await fetch(`${baseURL}/user-response-content/save`, {
      method: 'POST',
      headers: {
        Authorization: token
        // Não adicionar Content-Type, o browser define automaticamente para multipart/form-data
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      if (response.status === 401) {
        const msg = 'Não autorizado. Faça login novamente.';
        throw new Error(msg);
      }
      
      if (response.status === 400) {
        const msg = errorData?.message || 'Dados inválidos para upload do arquivo';
        throw new Error(msg);
      }
      
      if (response.status === 404) {
        const msg = 'UserResponse não encontrado';
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
    console.log('[CreateUserResponseContentService] UserResponseContent criado:', result.data);
    return result.data;
  } catch (error) {
    console.error('Erro ao criar UserResponseContent:', error);
    throw error;
  }
}
