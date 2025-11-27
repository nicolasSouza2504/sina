'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Trophy, FileText, Calendar, CheckCircle, AlertCircle, TrendingUp, Award, Target, ArrowRight, Star, Zap, Play, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'

export default function AlunoDashboard() {
  const router = useRouter();
  
  const handleActivityClick = (atividade: any) => {
    router.push(`/aluno/ead?activity=${atividade.id}`);
  };

  const handleTrailClick = (trilha: any) => {
    router.push('/aluno/trilhas');
  };

  const mockData = {
    progress: {
      trilhasCompletas: 3,
      atividadesTotal: 45,
      atividadesCompletas: 28,
      porcentagem: 62
    },
    entregas: {
      pendentes: 5,
      avaliadas: 12,
      atrasadas: 2
    },
    proximasAtividades: [
      {
        id: 1,
        titulo: "Projeto React - Componentes",
        disciplina: "Desenvolvimento Web",
        prazo: "2024-01-15",
        status: "pendente"
      },
      {
        id: 2,
        titulo: "API REST - Implementação",
        disciplina: "Arquitetura de Software",
        prazo: "2024-01-22",
        status: "pendente"
      }
    ],
    ultimasNotas: [
      {
        atividade: "Trabalho de Banco de Dados",
        nota: 9.5,
        feedback: "Excelente trabalho! Muito bem estruturado.",
        professor: "Prof. Silva",
        data: "2024-01-10"
      },
      {
        atividade: "Prova de Algoritmos",
        nota: 8.0,
        feedback: "Bom desenvolvimento, mas pode melhorar na documentação.",
        professor: "Prof. Costa",
        data: "2024-01-05"
      }
    ],
    conquistas: [
      { titulo: "Primeira Trilha", descricao: "Completou sua primeira trilha de aprendizado", icone: "🎯" },
      { titulo: "Consistência", descricao: "5 entregas em sequência no prazo", icone: "🔥" },
      { titulo: "Excelência", descricao: "Nota 9+ em 3 atividades", icone: "⭐" }
    ],
    trilhasEmAndamento: [
      {
        id: 1,
        titulo: "Desenvolvimento Web Frontend",
        descricao: "Aprenda React, TypeScript e Next.js",
        progresso: 65,
        proximaAtividade: "Criar componente de formulário",
        status: "em-andamento",
        duracao: "8 semanas",
        nivel: "Intermediário",
        atividadesCompletas: 13,
        totalAtividades: 20
      },
      {
        id: 2,
        titulo: "Fundamentos de Programação",
        descricao: "Lógica de programação e algoritmos",
        progresso: 30,
        proximaAtividade: "Estruturas de repetição",
        status: "em-andamento",
        duracao: "6 semanas",
        nivel: "Iniciante",
        atividadesCompletas: 6,
        totalAtividades: 20
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard do Aluno</h1>
                <p className="text-blue-100">Acompanhe seu progresso e atividades</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-blue-200">Nível</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                  <Trophy className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">XP Total</span>
                  <span className="text-sm font-medium">2.450 XP</span>
                </div>
                <Progress value={65} className="h-2 bg-blue-400" />
              </div>
              <div className="px-4 py-2 bg-blue-500 rounded-lg">
                <span className="text-sm font-medium">Próximo: 3.000 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progresso Geral</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{mockData.progress.porcentagem}%</p>
                  <p className="text-sm text-gray-500 mt-1">
                    de {mockData.progress.atividadesTotal} atividades
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+12% este mês</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entregas Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{mockData.entregas.pendentes}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {mockData.entregas.avaliadas} já avaliadas
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-orange-600">
                <Zap className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Ação necessária</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entregas Atrasadas</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{mockData.entregas.atrasadas}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Atenção necessária
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-red-600">
                <Target className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Prioridade alta</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trilhas Concluídas</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{mockData.progress.trilhasCompletas}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {mockData.progress.atividadesCompletas} atividades concluídas
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-purple-600">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Continue assim!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Próximas Atividades EAD */}
          <Card className="bg-white border border-gray-200 lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Próximas Atividades EAD</CardTitle>
                  <CardDescription className="text-gray-600">Atividades de ensino a distância com prazo próximo</CardDescription>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.proximasAtividades.map((atividade) => (
                <div
                  key={atividade.id} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                  onClick={() => handleActivityClick(atividade)}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {atividade.titulo}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">{atividade.disciplina}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <Badge variant={atividade.status === 'pendente' ? 'destructive' : 'default'} className="px-3 py-1">
                      {atividade.status === 'pendente' ? 'Pendente' : 'Em Andamento'}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(atividade.prazo).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivityClick(atividade);
                      }}
                      className="ml-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trilhas em Andamento */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Trilhas em Andamento</CardTitle>
                  <CardDescription className="text-gray-600">Continue sua jornada de aprendizado</CardDescription>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.trilhasEmAndamento.map((trilha) => (
                <div 
                  key={trilha.id} 
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-green-300"
                  onClick={() => handleTrailClick(trilha)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors">
                          {trilha.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{trilha.descricao}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {trilha.nivel}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Progresso</span>
                        <span className="text-sm font-bold text-gray-800">{trilha.progresso}%</span>
                      </div>
                      <Progress value={trilha.progresso} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{trilha.atividadesCompletas} de {trilha.totalAtividades} atividades</span>
                        <span>{trilha.duracao}</span>
                      </div>
                    </div>

                    {trilha.proximaAtividade && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-800">Próxima Atividade:</span>
                        </div>
                        <p className="text-sm text-gray-600">{trilha.proximaAtividade}</p>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrailClick(trilha);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continuar Trilha
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Últimas Notas */}
        <Card className="bg-white border border-gray-200 mt-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Últimas Notas</CardTitle>
                <CardDescription className="text-gray-600">Avaliações e feedbacks recentes</CardDescription>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.ultimasNotas.map((nota, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">
                      {nota.atividade}
                    </h4>
                    <Badge 
                      variant={nota.nota >= 8 ? 'default' : nota.nota >= 6 ? 'secondary' : 'destructive'}
                      className="text-sm font-bold"
                    >
                      {nota.nota.toFixed(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{nota.feedback}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{nota.professor}</span>
                    <span>{new Date(nota.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <QuickActionsAluno />
      </div>
    </div>
  )
}

