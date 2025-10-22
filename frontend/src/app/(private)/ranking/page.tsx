"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import QuickActions from '@/components/admin/quickActions';
import { 
  Trophy,
  Medal,
  Award,
  Target,
  Search,
  Filter,
  Clock,
  Crown,
  Star
} from 'lucide-react';

interface StudentRanking {
  id: number;
  studentName: string;
  studentAvatar: string;
  class: string;
  tasksCompleted: number;
  totalTasks: number;
  completionRate: number;
  lastSubmission: string;
  averageGrade: number;
  streak: number; // dias consecutivos com entregas
}

export default function RankingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  // Mock de dados expandido - em produção viria da API
  const allStudents: StudentRanking[] = [
    { 
      id: 1, 
      studentName: 'Maria Silva', 
      studentAvatar: 'MS',
      class: 'ADS 2º Semestre',
      tasksCompleted: 45, 
      totalTasks: 50,
      completionRate: 90,
      lastSubmission: '2h atrás',
      averageGrade: 9.5,
      streak: 15
    },
    { 
      id: 2, 
      studentName: 'João Santos', 
      studentAvatar: 'JS',
      class: 'ADS 3º Semestre',
      tasksCompleted: 42, 
      totalTasks: 50,
      completionRate: 84,
      lastSubmission: '5h atrás',
      averageGrade: 8.8,
      streak: 12
    },
    { 
      id: 3, 
      studentName: 'Ana Costa', 
      studentAvatar: 'AC',
      class: 'ADS 2º Semestre',
      tasksCompleted: 40, 
      totalTasks: 50,
      completionRate: 80,
      lastSubmission: '1 dia atrás',
      averageGrade: 8.5,
      streak: 10
    },
    { 
      id: 4, 
      studentName: 'Pedro Oliveira', 
      studentAvatar: 'PO',
      class: 'ADS 4º Semestre',
      tasksCompleted: 38, 
      totalTasks: 50,
      completionRate: 76,
      lastSubmission: '1 dia atrás',
      averageGrade: 8.2,
      streak: 8
    },
    { 
      id: 5, 
      studentName: 'Carla Mendes', 
      studentAvatar: 'CM',
      class: 'ADS 3º Semestre',
      tasksCompleted: 35, 
      totalTasks: 50,
      completionRate: 70,
      lastSubmission: '2 dias atrás',
      averageGrade: 7.8,
      streak: 6
    },
    { 
      id: 6, 
      studentName: 'Lucas Ferreira', 
      studentAvatar: 'LF',
      class: 'ADS 2º Semestre',
      tasksCompleted: 33, 
      totalTasks: 50,
      completionRate: 66,
      lastSubmission: '3 dias atrás',
      averageGrade: 7.5,
      streak: 5
    },
    { 
      id: 7, 
      studentName: 'Julia Rocha', 
      studentAvatar: 'JR',
      class: 'ADS 4º Semestre',
      tasksCompleted: 30, 
      totalTasks: 50,
      completionRate: 60,
      lastSubmission: '3 dias atrás',
      averageGrade: 7.2,
      streak: 4
    },
    { 
      id: 8, 
      studentName: 'Rafael Lima', 
      studentAvatar: 'RL',
      class: 'ADS 3º Semestre',
      tasksCompleted: 28, 
      totalTasks: 50,
      completionRate: 56,
      lastSubmission: '4 dias atrás',
      averageGrade: 6.8,
      streak: 3
    },
    { 
      id: 9, 
      studentName: 'Beatriz Alves', 
      studentAvatar: 'BA',
      class: 'ADS 2º Semestre',
      tasksCompleted: 25, 
      totalTasks: 50,
      completionRate: 50,
      lastSubmission: '5 dias atrás',
      averageGrade: 6.5,
      streak: 2
    },
    { 
      id: 10, 
      studentName: 'Gabriel Souza', 
      studentAvatar: 'GS',
      class: 'ADS 4º Semestre',
      tasksCompleted: 22, 
      totalTasks: 50,
      completionRate: 44,
      lastSubmission: '1 semana atrás',
      averageGrade: 6.0,
      streak: 1
    }
  ];

  const availableClasses = [
    'ADS 2º Semestre',
    'ADS 3º Semestre',
    'ADS 4º Semestre',
    'Desenvolvimento Web',
    'Backend Avançado'
  ];

  // Filtrar estudantes
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Estatísticas gerais
  const stats = {
    totalStudents: allStudents.length,
    averageCompletion: Math.round(allStudents.reduce((acc, s) => acc + s.completionRate, 0) / allStudents.length),
    topPerformer: allStudents[0].studentName,
    averageGrade: (allStudents.reduce((acc, s) => acc + s.averageGrade, 0) / allStudents.length).toFixed(1)
  };

  // Obter cor da taxa de conclusão
  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Obter cor da nota média
  const getGradeColor = (grade: number) => {
    if (grade >= 8.5) return 'text-green-600';
    if (grade >= 7.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Obter ícone de medalha baseado na posição
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{position}</span>;
    }
  };

  // Obter cor de fundo baseado na posição
  const getRankBackground = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-md';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-sm';
      case 3: return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 shadow-sm';
      default: return 'bg-white border-gray-200 hover:bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Ranking de Atividades EAD
        </h1>
        <p className="text-gray-600 mt-2">
          Acompanhe o desempenho dos alunos nas atividades à distância
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Participando do ranking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Média de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCompletion}%</div>
            <p className="text-xs text-muted-foreground">
              De todas as atividades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Desempenho</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats.topPerformer}</div>
            <p className="text-xs text-muted-foreground">
              Líder do ranking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nota Média Geral</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGrade}</div>
            <p className="text-xs text-muted-foreground">
              De todas as atividades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome do aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as Turmas</option>
                {availableClasses.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Completo */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Completo</CardTitle>
          <CardDescription>
            {filteredStudents.length} aluno(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map((student, index) => (
              <div
                key={student.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${getRankBackground(index + 1)}`}
              >
                {/* Posição/Medalha */}
                <div className="flex items-center justify-center min-w-[50px]">
                  {getRankIcon(index + 1)}
                </div>

                {/* Avatar */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-md">
                  {student.studentAvatar}
                </div>

                {/* Informações do Aluno */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-lg text-gray-900 truncate">
                      {student.studentName}
                    </p>
                    {student.streak >= 7 && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                        🔥 {student.streak} dias
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {student.class}
                  </p>
                </div>

                {/* Estatísticas */}
                <div className="hidden md:flex items-center gap-6">
                  {/* Atividades */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        {student.tasksCompleted}/{student.totalTasks}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Atividades</span>
                  </div>

                  {/* Taxa de Conclusão */}
                  <div className="flex flex-col items-center">
                    <Badge 
                      variant="outline" 
                      className={`text-sm font-bold border-2 ${getCompletionColor(student.completionRate)} mb-1`}
                    >
                      {student.completionRate}%
                    </Badge>
                    <span className="text-xs text-gray-500">Conclusão</span>
                  </div>

                  {/* Nota Média */}
                  <div className="flex flex-col items-center">
                    <div className={`text-lg font-bold mb-1 ${getGradeColor(student.averageGrade)}`}>
                      {student.averageGrade.toFixed(1)}
                    </div>
                    <span className="text-xs text-gray-500">Nota Média</span>
                  </div>

                  {/* Última Entrega */}
                  <div className="flex flex-col items-center min-w-[100px]">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">
                        {student.lastSubmission}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Última entrega</span>
                  </div>
                </div>

                {/* Estatísticas Mobile */}
                <div className="md:hidden flex flex-col items-end gap-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-semibold ${getCompletionColor(student.completionRate)}`}
                  >
                    {student.completionRate}%
                  </Badge>
                  <span className="text-xs text-gray-600">
                    {student.tasksCompleted}/{student.totalTasks}
                  </span>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Nenhum aluno encontrado</p>
                <p className="text-sm">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-200"></div>
              <span>≥ 80% - Excelente desempenho</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-200"></div>
              <span>60-79% - Bom desempenho</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-200"></div>
              <span>&lt; 60% - Precisa melhorar</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}

