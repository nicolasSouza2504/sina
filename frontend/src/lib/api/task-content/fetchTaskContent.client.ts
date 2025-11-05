import { getTokenFromLocalStorage } from "@/lib/auth/jwtAuth";

export default async function fetchTaskContentClient(filePath: string): Promise<{
    data: ArrayBuffer;
    mimeType: string;
}> {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const token = getTokenFromLocalStorage();

    try {
        if (!token) {
            throw new Error('Token de autenticação não encontrado. Faça login e tente novamente.');
        }

        const response = await fetch(`${baseURL}/task-content/find?filePath=${encodeURIComponent(filePath)}`, {
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
        console.error("Erro ao buscar conteúdo:", error);
        throw error;
    }
}
