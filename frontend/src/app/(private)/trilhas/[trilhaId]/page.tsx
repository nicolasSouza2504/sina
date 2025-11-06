"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Code, FileText, Database, BarChart3, Video } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import React, { use } from "react"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'

// Dados mocados das trilhas
const mockTrilhas = {
  "1": {
    id: "1",
    title: "Desenvolvimento Web - Fundamentos",
    description: "Aprenda os fundamentos essenciais para se tornar um desenvolvedor web, desde HTML e CSS até JavaScript básico.",
    progress: 75,
    totalActivities: 3,
    completedActivities: 2,
    estimatedTime: "35-45 horas",
    difficulty: "Iniciante",
    activities: [
      {
        id: "1-1",
        title: "Introdução ao HTML e CSS",
        description: "Aprenda os fundamentos do HTML e CSS para criar páginas web estruturadas e estilizadas.",
        icon: <Code className="w-5 h-5" />,
        completed: true,
        progress: 100,
        type: "teórica",
        duration: "8-10 horas",
        difficulty: "Iniciante"
      },
      {
        id: "1-2",
        title: "JavaScript Básico",
        description: "Domine os conceitos fundamentais do JavaScript para adicionar interatividade às suas páginas web.",
        icon: <Code className="w-5 h-5" />,
        completed: true,
        progress: 100,
        type: "prática",
        duration: "12-15 horas",
        difficulty: "Iniciante"
      },
      {
        id: "1-3",
        title: "Projeto Prático - Landing Page",
        description: "Aplique todos os conceitos aprendidos criando uma landing page completa e responsiva.",
        icon: <FileText className="w-5 h-5" />,
        completed: false,
        progress: 0,
        type: "projeto",
        duration: "15-20 horas",
        difficulty: "Intermediário"
      }
    ]
  },
  "2": {
    id: "2",
    title: "Banco de Dados e SQL",
    description: "Domine os conceitos de banco de dados relacionais e a linguagem SQL para manipulação de dados.",
    progress: 100,
    totalActivities: 3,
    completedActivities: 3,
    estimatedTime: "25-30 horas",
    difficulty: "Iniciante",
    activities: [
      {
        id: "2-1",
        title: "Fundamentos de Banco de Dados",
        description: "Conceitos básicos de bancos de dados relacionais, normalização e modelagem.",
        icon: <Database className="w-5 h-5" />,
        completed: true,
        progress: 100,
        type: "teórica",
        duration: "6-8 horas",
        difficulty: "Iniciante"
      },
      {
        id: "2-2",
        title: "Consultas SQL Avançadas",
        description: "Aprenda consultas complexas, joins, subconsultas e funções agregadas.",
        icon: <Database className="w-5 h-5" />,
        completed: true,
        progress: 100,
        type: "prática",
        duration: "10-12 horas",
        difficulty: "Intermediário"
      },
      {
        id: "2-3",
        title: "Modelagem de Dados",
        description: "Técnicas avançadas de modelagem e otimização de banco de dados.",
        icon: <BarChart3 className="w-5 h-5" />,
        completed: true,
        progress: 100,
        type: "projeto",
        duration: "8-10 horas",
        difficulty: "Intermediário"
      }
    ]
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Iniciante": return "bg-green-100 text-green-800"
    case "Intermediário": return "bg-yellow-100 text-yellow-800"
    case "Avançado": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "teórica": return "bg-blue-100 text-blue-800"
    case "prática": return "bg-purple-100 text-purple-800"
    case "projeto": return "bg-orange-100 text-orange-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

interface TrilhaPageProps {
  params: Promise<{
    trilhaId: string
  }>
}

export default function TrilhaPage({ params }: TrilhaPageProps) {
  const resolvedParams = use(params)
  const trilha = mockTrilhas[resolvedParams.trilhaId as keyof typeof mockTrilhas]
  
  if (!trilha) {
    notFound()
  }

  const nextActivity = trilha.activities.find(activity => !activity.completed)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header com navegação */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/cursos/ads-2024/semestre/semester-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Semestre
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/cursos" className="hover:underline">Cursos</Link>
            <span>/</span>
            <Link href="/cursos/ads-2024" className="hover:underline">ADS 2024</Link>
            <span>/</span>
            <Link href="/cursos/ads-2024/semestre/semester-1" className="hover:underline">1º Semestre</Link>
            <span>/</span>
            <span className="font-medium">{trilha.title}</span>
          </div>
        </div>

        {/* Card principal da trilha */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{trilha.title}</CardTitle>
                <p className="text-muted-foreground mb-4 text-lg">{trilha.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getDifficultyColor(trilha.difficulty)}>
                    {trilha.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {trilha.estimatedTime}
                  </Badge>
                  <Badge variant="outline">
                    {trilha.totalActivities} atividades
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{trilha.progress}%</div>
                <div className="text-sm text-muted-foreground">Concluído</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso Geral</span>
                <span className="text-sm text-muted-foreground">
                  {trilha.completedActivities} de {trilha.totalActivities} atividades
                </span>
              </div>
              <Progress value={trilha.progress} className="h-3" />
            </div>
            
            <div className="flex gap-3">
              {nextActivity ? (
                <Button asChild className="flex items-center gap-2">
                  <Link href={`/trilhas/${resolvedParams.trilhaId}/atividade/${nextActivity.id}`}>
                    <Play className="w-4 h-4" />
                    Continuar Trilha
                  </Link>
                </Button>
              ) : (
                <Button className="flex items-center gap-2" disabled>
                  <CheckCircle className="w-4 h-4" />
                  Trilha Concluída
                </Button>
              )}
              
            </div>
          </CardContent>
        </Card>

        {/* Lista de atividades */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades da Trilha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trilha.activities.map((activity, index) => (
                <div key={activity.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                        {activity.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{activity.title}</h3>
                          {activity.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {activity.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {activity.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {activity.progress > 0 && (
                        <div className="text-right">
                          <div className="text-sm font-medium">{activity.progress}%</div>
                          <Progress value={activity.progress} className="w-20 h-2" />
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/trilhas/${resolvedParams.trilhaId}/atividade/${activity.id}`}>
                            {activity.completed ? "Ver Material" : "Ver Material"}
                          </Link>
                        </Button>
                        {!activity.completed && (
                          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Link href={`/trilhas/${resolvedParams.trilhaId}/atividade/${activity.id}#entregar`}>
                              Entregar
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActionsAluno />
      </div>
    </div>
  )
}
