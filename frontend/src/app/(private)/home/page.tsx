"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Play,
  Award,
  Target,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  // Mock data - em produção viria da API
  const studentData = {
    name: 'Aluno',
    currentCourse: 'Análise e Desenvolvimento de Sistemas 2024',
    currentSemester: '2º Semestre',
    overallProgress: 67,
    stats: {
      coursesEnrolled: 2,
      completedTracks: 18,
      totalTracks: 45,
      studyHours: 124,
      certificates: 3
    },
    currentTracks: [
      {
        id: 1,
        title: 'Introdução ao React',
        course: 'ADS 2024',
        semester: '2º Semestre',
        progress: 75,
        timeRemaining: '2 horas',
        difficulty: 'Intermediário',
        status: 'in_progress'
      },
      {
        id: 2,
        title: 'Banco de Dados SQL',
        course: 'ADS 2024',
        semester: '2º Semestre',
        progress: 45,
        timeRemaining: '4 horas',
        difficulty: 'Iniciante',
        status: 'in_progress'
      },
      {
        id: 3,
        title: 'API REST com Node.js',
        course: 'ADS 2024',
        semester: '2º Semestre',
        progress: 0,
        timeRemaining: '6 horas',
        difficulty: 'Avançado',
        status: 'locked'
      }
    ],
    recentAchievements: [
      { id: 1, title: 'Primeira Trilha Concluída', icon: '🎯', date: '2 dias atrás' },
      { id: 2, title: 'Semana Completa de Estudos', icon: '🔥', date: '5 dias atrás' },
      { id: 3, title: '10 Trilhas Concluídas', icon: '⭐', date: '1 semana atrás' }
    ],
    upcomingDeadlines: [
      { id: 1, title: 'Projeto Final - React', date: '15/10/2025', daysLeft: 7 },
      { id: 2, title: 'Avaliação SQL', date: '20/10/2025', daysLeft: 12 }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com Boas-vindas */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta! 👋</h1>
        <p className="text-sky-100 mb-4">
          Continue sua jornada de aprendizado em {studentData.currentCourse}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm font-medium">{studentData.overallProgress}%</span>
            </div>
            <Progress value={studentData.overallProgress} className="h-2 bg-sky-300" />
          </div>
          <Button asChild className="bg-white text-sky-700 hover:bg-sky-50">
            <Link href="/cursos">
              <BookOpen className="h-4 w-4 mr-2" />
              Meus Cursos
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.stats.coursesEnrolled}</div>
            <p className="text-xs text-muted-foreground">Matriculados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trilhas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentData.stats.completedTracks}/{studentData.stats.totalTracks}
            </div>
            <p className="text-xs text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas de Estudo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.stats.studyHours}h</div>
            <p className="text-xs text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.stats.certificates}</div>
            <p className="text-xs text-muted-foreground">Conquistados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.overallProgress}%</div>
            <p className="text-xs text-muted-foreground">Do semestre</p>
          </CardContent>
        </Card>
      </div>

      {/* Trilhas em Andamento */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Continue Aprendendo</CardTitle>
              <CardDescription>Suas trilhas de conhecimento em andamento</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/cursos">Ver Todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentData.currentTracks.map((track) => (
              <Card key={track.id} className={track.status === 'locked' ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{track.title}</h3>
                        <Badge variant="outline" className={getDifficultyColor(track.difficulty)}>
                          {track.difficulty}
                        </Badge>
                        {track.status === 'locked' && (
                          <Badge variant="secondary">Bloqueado</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {track.course} • {track.semester}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progresso</span>
                          <span className="font-medium">{track.progress}%</span>
                        </div>
                        <Progress value={track.progress} className="h-2" />
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{track.timeRemaining} restantes</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {track.status === 'in_progress' ? (
                        <Button asChild>
                          <Link href={`/trilhas/${track.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            Continuar
                          </Link>
                        </Button>
                      ) : (
                        <Button disabled variant="outline">
                          Bloqueado
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conquistas e Prazos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conquistas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Conquistas Recentes</CardTitle>
            <CardDescription>Seus últimos marcos alcançados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentData.recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Prazos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Prazos</CardTitle>
            <CardDescription>Não perca essas datas importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentData.upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center space-x-4">
                  <div className="p-3 bg-sky-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-sm text-gray-600">{deadline.date}</p>
                  </div>
                  <Badge variant={deadline.daysLeft <= 7 ? "destructive" : "secondary"}>
                    {deadline.daysLeft} dias
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}