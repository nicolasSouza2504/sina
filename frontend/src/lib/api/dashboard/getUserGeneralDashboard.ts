"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import type { DashBoardUserGeneralInfo } from '@/lib/interfaces/dashboardInterfaces';

export default async function GetUserGeneralDashboardService(): Promise<DashBoardUserGeneralInfo> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();
  
  const response = await fetch(
    `${baseURL}/dashboard/user/general`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token
      },
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Não autorizado. Faça login novamente.');
    }
    if (response.status === 404) {
      throw new Error('Dashboard não encontrado.');
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}
