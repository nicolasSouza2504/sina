import { getTokenFromLocalStorage } from "@/lib/auth/jwtAuth";

export default async function fetchTaskContentClient(filePath: string): Promise<{
    data: ArrayBuffer;
    mimeType: string;
}> {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const token = getTokenFromLocalStorage();

    console.log('[fetchTaskContentClient] Iniciando fetch:', { baseURL, filePath, hasToken: !!token });

    try {
        if (!token) {
            console.error('[fetchTaskContentClient] Token não encontrado');
            throw new Error('Token de autenticação não encontrado. Faça login e tente novamente.');
        }

        const url = `${baseURL}/task-content/find?filePath=${encodeURIComponent(filePath)}`;
        console.log('[fetchTaskContentClient] URL completa:', url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: token
            }
        });

        console.log('[fetchTaskContentClient] Response recebida:', { 
            status: response.status, 
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('[fetchTaskContentClient] Erro 401 - Não autorizado');
                throw new Error("Não autorizado. Faça login novamente.");
            }
            
            if (response.status === 404) {
                console.error('[fetchTaskContentClient] Erro 404 - Conteúdo não encontrado');
                throw new Error("Conteúdo não encontrado");
            }
            
            const errorText = await response.text().catch(() => 'Sem detalhes');
            console.error('[fetchTaskContentClient] Erro HTTP:', { status: response.status, body: errorText });
            throw new Error(`Erro ao buscar conteúdo (${response.status}): ${errorText}`);
        }

        const mimeType = response.headers.get('Content-Type') || 'application/octet-stream';
        console.log('[fetchTaskContentClient] MimeType:', mimeType);
        
        const data = await response.arrayBuffer();
        console.log('[fetchTaskContentClient] Dados recebidos:', { size: data.byteLength, mimeType });

        return { data, mimeType };
    } catch (error) {
        console.error("[fetchTaskContentClient] Erro capturado:", error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }
        throw error;
    }
}
