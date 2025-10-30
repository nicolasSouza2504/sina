"use server"
import { CreateTaskContent, TaskContentResponse } from "@/lib/interfaces/taskContentInterfaces";
import getApiBaseUrl from "@/lib/api/api";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";

export default async function createTaskContent(
    taskContentData: CreateTaskContent, 
    file: File | null
): Promise<TaskContentResponse> {
    const base = getApiBaseUrl();
    const token = await getTokenFromSession();

    try {
        const formData = new FormData();

        // Adiciona o JSON como string (igual ao backend espera)
        const jsonPayload = JSON.stringify(taskContentData);
        formData.append("taskContentStr", jsonPayload);

        console.log('🔧 createTaskContent - Payload JSON:', jsonPayload);
        console.log('🔧 createTaskContent - Arquivo:', file ? file.name : 'null');

        // Adiciona o arquivo (se houver)
        if (file) {
            formData.append("file", file);
            console.log('✅ Arquivo adicionado ao FormData');
        } else {
            console.log('⚠️ Nenhum arquivo - enviando apenas JSON');
        }

        const response = await fetch(`${base}/task-content/save`, {
            method: "POST",
            headers: {
                Authorization: token
            },
            body: formData,
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
            
            if (response.status === 400) {
                const msg = errorData?.message || "Dados inválidos para criação do conteúdo";
                if (typeof window !== "undefined") {
                    const { toast } = await import("sonner");
                    toast.error(msg);
                }
                throw new Error(msg);
            }
            
            if (response.status === 404) {
                const msg = "Tarefa não encontrada";
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
    } catch (error) {
        console.error("Network or unexpected error:", error);
        throw error;
    }
}
