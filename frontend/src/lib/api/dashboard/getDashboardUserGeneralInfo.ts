import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { DashBoardUserGeneralInfo } from '@/lib/interfaces/dashboardInterfaces';

export default async function GetDashboardUserGeneralInfoService(): Promise<DashBoardUserGeneralInfo> {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();
    
    const response = await fetch(`${baseURL}/dashboard/user/general`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Não autorizado. Faça login novamente.');
        }
        if (response.status === 403) {
            throw new Error('Acesso negado. Você não tem permissão para acessar esta informação.');
        }
        if (response.status === 404) {
            throw new Error('Endpoint não encontrado.');
        }
        throw new Error(`Erro ao buscar dados do dashboard: ${response.status}`);
    }

    const result = await response.json();
    console.log('[GetDashboardUserGeneralInfoService] Dados recebidos:', result.data);
    return result.data;
}
