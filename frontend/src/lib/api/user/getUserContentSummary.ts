"use server";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import getApiBaseUrl from "@/lib/api/api";
import type { CourseContentSummary } from "@/lib/interfaces/courseContentInterfaces";

/**
 * Busca o resumo de conteúdo personalizado do usuário para um curso específico
 * Endpoint: GET /api/user/{userId}/{courseId}/content-summary
 * 
 * @param userId - ID do usuário
 * @param courseId - ID do curso
 * @returns CourseContentSummary com dados personalizados do usuário
 */
export default async function GetUserContentSummaryService(
  userId: number,
  courseId: number
): Promise<CourseContentSummary> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();

  try {
    if (!token) {
      throw new Error("No auth token found in session. Please login and try again.");
    }

    console.log('[GetUserContentSummaryService] Buscando conteúdo:', { userId, courseId });

    const response = await fetch(
      `${baseURL}/user/${userId}/${courseId}/content-summary`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 404) {
        const msg = errorData?.message || "Usuário ou curso não encontrado.";
        throw new Error(msg);
      }

      if (response.status === 401) {
        const msg = "Acesso não autorizado. Faça login novamente.";
        throw new Error(msg);
      }

      console.error("[GetUserContentSummaryService] API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorData,
      });

      const msg = errorData?.message || `Request failed with status ${response.status}`;
      throw new Error(msg);
    }

    const responseData = await response.json();
    const data: CourseContentSummary = responseData?.data;

    if (!data) {
      throw new Error("Dados do conteúdo não encontrados na resposta da API");
    }

    console.log('[GetUserContentSummaryService] Conteúdo carregado:', {
      courseName: data.name,
      sectionsCount: data.sections?.length || 0,
      quantitySemester: data.quantitySemester
    });

    return data;
  } catch (err) {
    console.error("[GetUserContentSummaryService] Network or unexpected error:", err);
    throw err;
  }
}
