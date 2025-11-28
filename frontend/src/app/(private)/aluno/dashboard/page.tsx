"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCcw,
  ChevronRight,
  FileCheck,
  ClipboardList,
  Award,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GetUserGeneralDashboardService from "@/lib/api/dashboard/getUserGeneralDashboard";
import type { DashBoardUserGeneralInfo, TaskResponseDTO } from "@/lib/interfaces/dashboardInterfaces";
import { MobileScrollButtons } from "@/components/ui/mobile-scroll-buttons";
import getUserFromToken from "@/lib/auth/userToken";
import GetUserByIdService from "@/lib/api/user/getUserById";
import type { UserData, UserFromToken } from "@/lib/interfaces/userInterfaces";
import { Users, BookOpen } from "lucide-react";

export default function AlunoDashboard() {
  const router = useRouter();

  // Estados
  const [dashboardData, setDashboardData] = useState<DashBoardUserGeneralInfo | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs para os containers de scroll
  const waitingFeedbackRef = useRef<HTMLDivElement>(null);
  const pendingTasksRef = useRef<HTMLDivElement>(null);
  const evaluatedTasksRef = useRef<HTMLDivElement>(null);

  // Carrega dados do dashboard e do usuário ao montar o componente
  useEffect(() => {
    loadDashboardData();
    loadUserData();
  }, []);

  // Função para recarregar todos os dados
  const refreshAllData = async () => {
    await Promise.all([
      loadDashboardData(),
      loadUserData()
    ]);
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await GetUserGeneralDashboardService();
      setDashboardData(data);
      console.log('[AlunoDashboard] Dados carregados:', data);
    } catch (err) {
      console.error('[AlunoDashboard] Erro ao carregar dashboard:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    setIsLoadingUser(true);
    try {
      const tokenUser: UserFromToken | undefined = await getUserFromToken();
      console.log('[AlunoDashboard] Usuário do token:', tokenUser);
      
      if (tokenUser?.id) {
        const user = await GetUserByIdService(tokenUser.id);
        setUserData(user);
        console.log('[AlunoDashboard] Dados do usuário carregados:', user);
      }
    } catch (err) {
      console.error('[AlunoDashboard] Erro ao carregar dados do usuário:', err);
      // Não mostra toast de erro aqui para não poluir a tela
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleTaskClick = (taskId: number) => {
    router.push(`/aluno/material/${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Cabeçalho */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard do Aluno
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Acompanhe suas atividades e progresso
            </p>
          </div>
          <Button
            onClick={refreshAllData}
            variant="outline"
            className="h-10 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
            disabled={isLoading || isLoadingUser}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${(isLoading || isLoadingUser) ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Aguardando Avaliação
              </CardTitle>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {dashboardData?.waitingFeedbackTasks.length || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Tarefas enviadas aguardando feedback
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Tarefas Pendentes
              </CardTitle>
              <div className="p-2 bg-orange-50 rounded-lg">
                <ClipboardList className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {dashboardData?.pendingTasks.length || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Tarefas que precisam ser entregues
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Tarefas Avaliadas
              </CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {dashboardData?.evaluatedTasks.length || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Tarefas já avaliadas pelo professor
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-2 border-red-200 rounded-xl shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Erro ao carregar dados
              </h3>
              <p className="text-gray-600 text-center mb-4">{error}</p>
              <Button
                onClick={loadDashboardData}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cards de Listagens */}
        {!isLoading && !error && dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Aguardando Avaliação */}
            <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                      Aguardando Avaliação
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600">
                      Tarefas enviadas aguardando feedback do professor
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.waitingFeedbackTasks.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <FileCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-600">Nenhuma tarefa aguardando avaliação</p>
                  </div>
                ) : (
                  <>
                    <div
                      ref={waitingFeedbackRef}
                      className={`${dashboardData.waitingFeedbackTasks.length > 5 ? 'max-h-[400px] overflow-y-auto' : ''} space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400`}
                    >
                      {dashboardData.waitingFeedbackTasks.map((task) => (
                        <div
                          key={task.taskId}
                          onClick={() => handleTaskClick(task.taskId)}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border-2 border-yellow-200 hover:border-yellow-400 rounded-lg transition-all group cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors truncate">
                              {task.taskName}
                            </p>
                            {task.taskDescription && (
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {task.taskDescription}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600 transition-colors flex-shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                    <MobileScrollButtons
                      containerRef={waitingFeedbackRef}
                      itemCount={dashboardData.waitingFeedbackTasks.length}
                      threshold={5}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tarefas Pendentes */}
            <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                      Tarefas Pendentes
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600">
                      Tarefas que precisam ser entregues
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.pendingTasks.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-600">Nenhuma tarefa pendente</p>
                  </div>
                ) : (
                  <>
                    <div
                      ref={pendingTasksRef}
                      className={`${dashboardData.pendingTasks.length > 5 ? 'max-h-[400px] overflow-y-auto' : ''} space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400`}
                    >
                      {dashboardData.pendingTasks.map((task) => (
                        <div
                          key={task.taskId}
                          onClick={() => handleTaskClick(task.taskId)}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-2 border-orange-200 hover:border-orange-400 rounded-lg transition-all group cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 transition-colors truncate">
                              {task.taskName}
                            </p>
                            {task.taskDescription && (
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {task.taskDescription}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                    <MobileScrollButtons
                      containerRef={pendingTasksRef}
                      itemCount={dashboardData.pendingTasks.length}
                      threshold={5}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tarefas Avaliadas */}
            <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      Tarefas Avaliadas
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600">
                      Tarefas já avaliadas pelo professor
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.evaluatedTasks.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-600">Nenhuma tarefa avaliada ainda</p>
                  </div>
                ) : (
                  <>
                    <div
                      ref={evaluatedTasksRef}
                      className={`${dashboardData.evaluatedTasks.length > 5 ? 'max-h-[400px] overflow-y-auto' : ''} space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400`}
                    >
                      {dashboardData.evaluatedTasks.map((task) => (
                        <div
                          key={task.taskId}
                          onClick={() => handleTaskClick(task.taskId)}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-400 rounded-lg transition-all group cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                              {task.taskName}
                            </p>
                            {task.taskDescription && (
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {task.taskDescription}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                    <MobileScrollButtons
                      containerRef={evaluatedTasksRef}
                      itemCount={dashboardData.evaluatedTasks.length}
                      threshold={5}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Card de Turmas e Cursos */}
        {!isLoadingUser && userData && userData.classes && userData.classes.length > 0 && (
          <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Minhas Turmas e Cursos
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-600">
                    Turmas em que você está matriculado
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {userData.classes.length} {userData.classes.length === 1 ? 'turma' : 'turmas'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.classes.map((classItem) => {
                  const classId = classItem.Id || classItem.id;
                  return (
                    <div
                      key={classId}
                      className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {classItem.nome}
                          </h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">Curso:</span> {classItem.course.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">Código da turma:</span> {classItem.code}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">Período:</span> {classItem.semester}º Semestre
                            </p>
                          </div>
                          <div className="mt-3 text-xs text-gray-500 space-y-1">
                            <p>
                              <span className="font-medium">Início:</span> {new Date(classItem.startDate).toLocaleDateString('pt-BR')}
                            </p>
                            <p>
                              <span className="font-medium">Término:</span> {new Date(classItem.finalDate || classItem.endDate || '').toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          
                          {/* Semestres Ativos (Sections) */}
                          {classItem.sections && classItem.sections.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <p className="text-xs font-semibold text-gray-700 mb-2">
                                Semestres Ativos:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {classItem.sections.map((section) => (
                                  <Badge 
                                    key={section.id}
                                    variant="outline" 
                                    className="text-xs bg-blue-100 text-blue-700 border-blue-300"
                                  >
                                    {section.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
