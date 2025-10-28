"use server";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import getApiBaseUrl from "@/lib/api/api";
import type { CourseContentSummary } from "@/lib/interfaces/courseContentInterfaces";

export default async function CourseContentSummaryService(courseId: number) {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();

    try {
        if (!token) {
            throw new Error("No auth token found in session. Please login and try again.");
        }

        const response = await fetch(`${baseURL}/course/${courseId}/content-summary`, {
            method: "GET",
            cache: "no-store",
            headers: {
                Accept: "application/json",
                Authorization: token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            
            if (response.status === 404) {
                const msg = errorData?.message || "Curso não encontrado.";
                throw new Error(msg);
            }
            
            if (response.status === 401) {
                const msg = "Acesso não autorizado. Faça login novamente.";
                throw new Error(msg);
            }
            
            console.error("API Error:", {
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
            throw new Error("Dados do curso não encontrados na resposta da API");
        }

        return data;
    } catch (err) {
        console.error("Network or unexpected error:", err);
        throw err;
    }
}
