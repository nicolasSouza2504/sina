"use server";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import getApiBaseUrl from "@/lib/api/api";
import { ClassSummary } from "@/lib/interfaces/classSummaryInterfaces";

export default async function GetClassSummaryService(classId: number): Promise<ClassSummary> {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();

    const response = await fetch(`${baseURL}/class/${classId}/class-summary`, {
        method: "GET",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        if (response.status === 401) {
            throw new Error("Não autorizado. Faça login novamente.");
        }
        
        if (response.status === 404) {
            throw new Error("Turma não encontrada.");
        }
        
        const message = errorData?.message || `Erro ao buscar resumo da turma: ${response.status}`;
        throw new Error(message);
    }

    const result = await response.json();
    return result.data;
}
