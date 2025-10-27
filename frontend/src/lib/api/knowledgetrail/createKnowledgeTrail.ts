"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type {CreateKnowledgeTrail} from "@/lib/interfaces/knowledgeTrailInterfaces";

export default async function CreateKnowledgeTrailService(trailForm: CreateKnowledgeTrail) {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();
    try {
        if (!token) {
            throw new Error("No auth token found in session. Please login and try again.");
        }

        const response = await fetch(`${baseURL}/knowledge-trail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token,
            },
            body: JSON.stringify(trailForm),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            
            if (response.status === 404) {
                const msg = "Endpoint não encontrado. Verifique a configuração da API.";
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

        return await response.json();
    } catch (err) {
        console.error("Network or unexpected error:", err);
        throw err;
    }
}
