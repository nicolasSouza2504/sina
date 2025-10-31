"use server"
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import getApiBaseUrl from "@/lib/api/api";

interface TaskOrderUpdate {
  taskId: number;
  newOrder: number;
}

export default async function UpdateTaskOrderService(tasks: TaskOrderUpdate[]): Promise<void> {
  const token = await getTokenFromSession();
  const baseURL = getApiBaseUrl();

  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${baseURL}/task/update-order-tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(tasks)
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Não autorizado. Faça login novamente.');
    }
    if (response.status === 404) {
      throw new Error('Tarefa não encontrada');
    }
    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Dados inválidos');
    }
    throw new Error('Erro ao atualizar ordem das tarefas');
  }
}
