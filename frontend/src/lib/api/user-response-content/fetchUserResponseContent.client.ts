"use client"
import getApiBaseUrl from '@/lib/api/api';
import { getTokenFromLocalStorage } from '@/lib/auth/jwtAuth';

/**
 * Busca o conteúdo de um arquivo enviado pelo aluno (UserResponseContent)
 * Similar ao fetchTaskContent, mas usa o endpoint /user-response-content/find
 */
export default async function fetchUserResponseContentClient(
  filePath: string
): Promise<{ data: ArrayBuffer; mimeType: string }> {
  const baseURL = getApiBaseUrl();
  const token = getTokenFromLocalStorage();

  try {
    console.log('[fetchUserResponseContentClient] Iniciando fetch:', {
      filePath,
      baseURL
    });

    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    const url = `${baseURL}/user-response-content/find?filePath=${encodeURIComponent(filePath)}`;
    console.log('[fetchUserResponseContentClient] URL completa:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token
      }
    });

    console.log('[fetchUserResponseContentClient] Response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      
      if (response.status === 404) {
        throw new Error('Arquivo não encontrado');
      }

      if (response.status === 403) {
        console.error('[fetchUserResponseContentClient] Erro 403 - Token enviado:', token);
        throw new Error('Acesso negado ao arquivo');
      }

      throw new Error(`Erro ao buscar arquivo: ${response.status}`);
    }

    // Obter o mimeType do header
    const mimeType = response.headers.get('Content-Type') || 'application/octet-stream';
    console.log('[fetchUserResponseContentClient] MimeType:', mimeType);

    // Converter resposta para ArrayBuffer
    const data = await response.arrayBuffer();
    console.log('[fetchUserResponseContentClient] Arquivo recebido:', {
      mimeType,
      size: data.byteLength
    });

    return { data, mimeType };
  } catch (error) {
    console.error('[fetchUserResponseContentClient] Erro:', error);
    throw error;
  }
}
