'use server'

import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import { UserData } from "@/lib/interfaces/userInterfaces";
import getApiBaseUrl from "@/lib/api/api";

export default async function GetUserByIdService(userId: number): Promise<UserData> {
  console.log(userId);
  const token = await getTokenFromSession();
  const base = getApiBaseUrl();

  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${base}/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  console.log(response);

  if (response.status === 401) {
    throw new Error('Não autorizado. Faça login novamente.');
  }

  if (response.status === 404) {
    throw new Error('Usuário não encontrado');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro ao buscar usuário');
  }

  const result = await response.json();

  // O backend retorna { message: "Sucesso!", data: UserResponseDTO }
  return result.data;
}
