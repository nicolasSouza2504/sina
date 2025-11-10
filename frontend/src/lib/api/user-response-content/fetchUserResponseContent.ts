"use server"
import getApiBaseUrl from "@/lib/api/api";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";

export default async function fetchUserResponseContent(filePath: string): Promise<{
    data: ArrayBuffer;
    mimeType: string;
}> {
    const base = getApiBaseUrl();
    const token = await getTokenFromSession();

    try {
        const response = await fetch(`${base}/user-response-content/find?filePath=${encodeURIComponent(filePath)}`, {
            method: "GET",
            headers: {
                Authorization: token
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Não autorizado. Faça login novamente.");
            }
            
            if (response.status === 404) {
                throw new Error("Conteúdo não encontrado");
            }
            
            throw new Error(`Erro ao buscar conteúdo: ${response.status}`);
        }

        const mimeType = response.headers.get('Content-Type') || 'application/octet-stream';
        const data = await response.arrayBuffer();

        return { data, mimeType };
    } catch (error) {
        console.error("Erro ao buscar conteúdo de resposta do aluno:", error);
        throw error;
    }
}
