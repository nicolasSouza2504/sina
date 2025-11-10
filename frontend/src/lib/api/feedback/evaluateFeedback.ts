"use server";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { FeedbackRegister, FeedbackResponse } from "@/lib/interfaces/feedbackInterfaces";
import getApiBaseUrl from '@/lib/api/api';

export default async function EvaluateFeedbackService(
  data: FeedbackRegister
): Promise<FeedbackResponse> {
  console.log('[EvaluateFeedbackService] Enviando avaliação:', data);
  const baseURL = getApiBaseUrl();
  const token = await getTokenFromSession();

  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${baseURL}/feedback/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  console.log('[EvaluateFeedbackService] Response status:', response.status);

  if (response.status === 401) {
    throw new Error('Não autorizado. Faça login novamente.');
  }

  if (response.status === 400) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Dados inválidos para avaliação');
  }

  if (response.status === 404) {
    throw new Error('Resposta do aluno não encontrada');
  }

  if (!response.ok) {
    throw new Error('Erro ao salvar avaliação');
  }

  const result = await response.json();
  console.log('[EvaluateFeedbackService] Avaliação criada:', result);

  return result;
}
