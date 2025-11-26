"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { RankedKnowledgeTrail } from '@/lib/interfaces/rankedKnowledgeTrailInterfaces';

export default async function GetRankedKnowledgeTrailsService(classId: number): Promise<RankedKnowledgeTrail[]> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();
  
  const response = await fetch(
    `${baseURL}/class/${classId}/ranked-knowledge-trails`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token
      },
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Não encontradas tarefas rankeadas para a turma');
    }
    if (response.status === 401) {
      throw new Error('Não autorizado. Faça login novamente.');
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}
