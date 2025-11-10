"use server";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import { FeedbackRegister, FeedbackResponse } from "@/lib/interfaces/userResponseInterfaces";

const base = process.env.NEXT_PUBLIC_API_URL;

export default async function CreateFeedbackService(
  data: FeedbackRegister
): Promise<FeedbackResponse> {
  try {
    const token = await getTokenFromSession();

    const response = await fetch(`${base}/feedback`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      throw new Error("Não autorizado. Faça login novamente.");
    }

    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Dados inválidos para feedback.");
    }

    if (response.status === 404) {
      throw new Error("Resposta do usuário não encontrada.");
    }

    if (!response.ok) {
      throw new Error("Erro ao salvar feedback. Tente novamente.");
    }

    const feedbackData = await response.json();
    return feedbackData.data;
  } catch (error) {
    console.error('[CreateFeedbackService] Erro:', error);
    throw error;
  }
}
