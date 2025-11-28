"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Users,
  Loader2,
  GraduationCap,
  Code,
  Monitor,
  BookOpenCheck,
  ChartBarDecreasing,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { GetDashboardAdmGeneralInfoService } from '@/lib/api/dashboard';
import { DashboardAdmGeneralInfo } from '@/lib/interfaces/dashboardInterfaces';
import QuickActions from '@/components/admin/quickActions';

export default function ProfessorDashboard() {
  // Estados para dados do dashboard
  const [dashboardData, setDashboardData] = useState<DashboardAdmGeneralInfo | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // Carregar dados do dashboard
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Função para carregar dados do dashboard
  const loadDashboardData = async () => {
    setIsLoadingDashboard(true);
    try {
      const data = await GetDashboardAdmGeneralInfoService();
      setDashboardData(data);
      console.log('[ProfessorDashboard] Dados carregados:', data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar estatísticas gerais');
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const quickActions = [
    {
      title: 'Gerenciar Conteúdo',
      description: 'Criar e editar trilhas e materiais',
      icon: BookOpen,
      href: '/professor/conteudo',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gerenciar Alunos',
      description: 'Acompanhar e gerenciar alunos',
      icon: Users,
      href: '/admin/students',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Avaliar',
      description: 'Avaliar entregas dos alunos',
      icon: BookOpenCheck,
      href: '/professor/avaliacao',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Ranking',
      description: 'Ver ranking de alunos',
      icon: ChartBarDecreasing,
      href: '/ranking',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];


  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Professor</h1>
        <p className="text-gray-600 mt-2">Gerencie os cursos e conteúdos de forma eficiente</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Alunos Ativos
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              {isLoadingDashboard ? (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              ) : (
                <Users className="h-5 w-5 text-blue-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {isLoadingDashboard ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                dashboardData?.totalActiveUsers.toLocaleString('pt-BR') || '0'
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600 font-semibold">Ativos</span> na plataforma
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Cursos</CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              {isLoadingDashboard ? (
                <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
              ) : (
                <Code className="h-5 w-5 text-purple-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {isLoadingDashboard ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                dashboardData?.totalCourses || '0'
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-blue-600 font-semibold">Cursos</span> cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Professores
            </CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              {isLoadingDashboard ? (
                <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
              ) : (
                <GraduationCap className="h-5 w-5 text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {isLoadingDashboard ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                dashboardData?.totalTeachers || '0'
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600 font-semibold">Docentes</span> ativos
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total de Tarefas</CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
              {isLoadingDashboard ? (
                <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
              ) : (
                <Monitor className="h-5 w-5 text-amber-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {isLoadingDashboard ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                dashboardData?.totalTasks || '0'
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-gray-600 font-semibold">Todas</span> as tarefas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Tarefas Ranqueadas</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg">
              {isLoadingDashboard ? (
                <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
              ) : (
                <Trophy className="h-5 w-5 text-orange-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {isLoadingDashboard ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                dashboardData?.totalRankedTasks || '0'
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-orange-600 font-semibold">Com pontuação</span> ativa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse as principais funcionalidades para gerenciar seu conteúdo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full border-2 hover:border-gray-300">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-xl ${action.color} text-white shadow-md`}>
                        <action.icon className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">{action.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <QuickActions></QuickActions>
    </div>
  );
}

