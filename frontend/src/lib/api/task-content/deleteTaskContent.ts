"use server"
import getApiBaseUrl from "@/lib/api/api";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";

export default async function deleteTaskContent(contentId: number): Promise<void> {
    const base = getApiBaseUrl();
    const token = await getTokenFromSession();

    try {
        const response = await fetch(`${base}/task-content/${contentId}`, {
            method: "DELETE",
            headers: {
                Authorization: token
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            
            if (response.status === 401) {
                const msg = "Não autorizado. Faça login novamente.";
                if (typeof window !== "undefined") {
                    const { toast } = await import("sonner");
                    toast.error(msg);
                }
                throw new Error(msg);
            }
            
            if (response.status === 404) {
                const msg = "Conteúdo não encontrado";
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
    } catch (error) {
        console.error("Network or unexpected error:", error);
        throw error;
    }
}
