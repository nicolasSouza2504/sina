'use server';
import getApiBaseUrl from "@/lib/api/api";

export default async function UserUpdateStatusService(status: string, userId: number) {
    try {
        const base = getApiBaseUrl();
        const url = `${base}/user/status/${userId}`;

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            let errorMessage = "Erro ao atualizar status do usuário";
            
            switch (response.status) {
                case 400:
                    errorMessage = "Dados inválidos. Verifique o status informado.";
                    break;
                case 401:
                    errorMessage = "Acesso não autorizado. Faça login novamente.";
                    break;
                case 403:
                    errorMessage = "Você não tem permissão para alterar o status deste usuário.";
                    break;
                case 404:
                    errorMessage = "Usuário não encontrado no sistema.";
                    break;
                case 409:
                    errorMessage = "Conflito: O usuário já possui este status.";
                    break;
                case 422:
                    errorMessage = "Status inválido. Use apenas ATIVO ou INATIVO.";
                    break;
                case 500:
                    errorMessage = "Erro interno do servidor. Tente novamente em alguns minutos.";
                    break;
                case 503:
                    errorMessage = "Serviço temporariamente indisponível. Tente novamente.";
                    break;
                default:
                    errorMessage = `Erro ${response.status}: Falha ao atualizar status do usuário.`;
            }

            // Tenta extrair mensagem de erro da resposta da API
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch {
                // Se não conseguir parsear o JSON, usa a mensagem padrão
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        // Se for um erro de rede ou outro erro não relacionado à resposta HTTP
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
        }
        
        // Se for um erro que já tratamos, repassa
        if (error instanceof Error) {
            throw error;
        }
        
        // Erro genérico para casos não previstos
        throw new Error("Erro inesperado ao atualizar status do usuário.");
    }
}