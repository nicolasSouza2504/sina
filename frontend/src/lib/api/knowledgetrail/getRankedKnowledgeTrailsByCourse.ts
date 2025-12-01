"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";

export interface KnowledgeTrailResponse {
    id: number;
    name: string;
    sectionId: number;
    ranked: boolean;
}

export default async function GetRankedKnowledgeTrailsByCourseService(courseId: number): Promise<KnowledgeTrailResponse[]> {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();
    
    try {
        if (!token) {
            throw new Error("No auth token found in session. Please login and try again.");
        }

        const response = await fetch(`${baseURL}/knowledge-trail/ranked/by-course/${courseId}`, {
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
                const msg = "Nenhuma trilha ranqueada encontrada para este curso.";
                if (typeof window !== "undefined") {
                    const { toast } = await import("sonner");
                    toast.error(msg);
                }
                throw new Error(msg);
            }
            
            if (response.status === 400) {
                const msg = errorData?.message || "Dados inválidos. Verifique os campos preenchidos.";
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
