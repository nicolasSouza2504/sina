"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import { RankingResponseDTO } from "@/lib/interfaces/rankingInterfaces";

export default async function GetRankingByClassService(classId: number, knowledgeTrailIds: number[]): Promise<RankingResponseDTO[]> {

    console.log("[Ranking] Buscando ranking para turma:", classId);
    console.log("[Ranking] Buscando ranking para trilhas:", knowledgeTrailIds);
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();

    try {
        if (!token) {
            throw new Error("No auth token found in session. Please login and try again.");
        }

        // Constrói a URL com query parameters
        const url = new URL(`${baseURL}/ranking/by-class/${classId}`);
        if (knowledgeTrailIds.length > 0) {
            knowledgeTrailIds.forEach(id => url.searchParams.append('knowledgeTrailIds', id.toString()));
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            if (response.status === 404) {
                const msg = "Ranking não encontrado para esta turma.";
                if (typeof window !== "undefined") {
                    const { toast } = await import("sonner");
                    toast.error(msg);
                }
                throw new Error(msg);
            }

            if (response.status === 400) {
                const msg = errorData?.message || "Dados inválidos. Verifique os filtros selecionados.";
                if (typeof window !== "undefined") {
                    const { toast } = await import("sonner");
                    toast.error(msg);
                }
                throw new Error(msg);
            }

            console.error("API Error:", {
                status: response.status,
                statusText: response.statusText,
                body: errorData,
            });
            throw new Error(
                `Request failed with status ${response.status}: ${JSON.stringify(errorData)}`
            );
        }

        const result = await response.json();
        return result.data;
    } catch (err) {
        console.error("Network or unexpected error:", err);
        throw err;
    }
}
