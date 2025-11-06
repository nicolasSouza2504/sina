import { getTokenFromLocalStorage } from "@/lib/auth/jwtAuth";
import getApiBaseUrl from "@/lib/api/api";

export default async function fetchTaskContentClient(filePath: string): Promise<{
    data: ArrayBuffer;
    mimeType: string;
}> {
    const token = getTokenFromLocalStorage();
    const base = getApiBaseUrl();

    console.log('[fetchTaskContentClient] Iniciando fetch:', { base, filePath, hasToken: !!token, token: token?.substring(0, 20) + '...' });

    try {
        if (!token) {
            console.error('[fetchTaskContentClient] Token não encontrado no localStorage');
            throw new Error('Token de autenticação não encontrado. Faça login e tente novamente.');
        }

        const url = `${base}/task-content/find?filePath=${encodeURIComponent(filePath)}`;
        console.log('[fetchTaskContentClient] URL completa:', url);
        console.log('[fetchTaskContentClient] Headers:', { Authorization: token.substring(0, 20) + '...' });

        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
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
            
            if (response.status === 403) {
                console.error('[fetchTaskContentClient] Erro 403 - Acesso negado');
                console.error('[fetchTaskContentClient] Token enviado:', token?.substring(0, 30) + '...');
                throw new Error("Acesso negado. Você não tem permissão para acessar este conteúdo.");
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
