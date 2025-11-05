'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, Play, Lock, CheckCircle, Clock, ArrowRight, Video, FileText, Code, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import QuickActions from '@/components/admin/quickActions'

export default function AlunoTrilhasPage() {
  const router = useRouter()
  const [selectedTrail, setSelectedTrail] = useState<any>(null)
  const [isTrailModalOpen, setIsTrailModalOpen] = useState(false)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  const mockTrilhas = [
    {
      id: 1,
      titulo: "Desenvolvimento Web Frontend",
      descricao: "Aprenda React, TypeScript e Next.js para criar aplicações web modernas",
      progresso: 65,
      status: "em-andamento",
      nivel: "Intermediário",
      duracao: "8 semanas",
      atividadesCompletas: 13,
      totalAtividades: 20,
      proximaAtividade: {
        id: "1-14",
        titulo: "Criar componente de formulário",
        tipo: "projeto"
      },
      atividades: [
        { id: "1-1", titulo: "Introdução ao React", tipo: "video", status: "concluida" },
        { id: "1-2", titulo: "Componentes Funcionais", tipo: "video", status: "concluida" },
        { id: "1-14", titulo: "Criar componente de formulário", tipo: "projeto", status: "pendente" },
        { id: "1-15", titulo: "Hooks Avançados", tipo: "video", status: "bloqueada" }
      ]
    },
    {
      id: 2,
      titulo: "Fundamentos de Programação",
      descricao: "Lógica de programação e algoritmos essenciais",
      progresso: 30,
      status: "em-andamento",
      nivel: "Iniciante",
      duracao: "6 semanas",
      atividadesCompletas: 6,
      totalAtividades: 20,
      proximaAtividade: {
        id: "2-7",
        titulo: "Estruturas de repetição",
        tipo: "video"
      },
      atividades: [
        { id: "2-1", titulo: "Variáveis e Tipos", tipo: "video", status: "concluida" },
        { id: "2-7", titulo: "Estruturas de repetição", tipo: "video", status: "pendente" },
        { id: "2-8", titulo: "Funções", tipo: "video", status: "bloqueada" }
      ]
    },
    {
      id: 3,
      titulo: "Banco de Dados SQL",
      descricao: "Aprenda a modelar e consultar bancos de dados relacionais",
      progresso: 100,
      status: "concluida",
      nivel: "Intermediário",
      duracao: "6 semanas",
      atividadesCompletas: 15,
      totalAtividades: 15,
      atividades: [
        { id: "3-1", titulo: "Modelagem de Dados", tipo: "video", status: "concluida" },
        { id: "3-2", titulo: "Consultas SELECT", tipo: "video", status: "concluida" }
      ]
    }
  ]

  const handleEnterTrail = (trilha: any) => {
    setSelectedTrail(trilha)
    setIsTrailModalOpen(true)
  }

  const handleViewActivity = (activity: any) => {
    setSelectedActivity(activity)
    setIsActivityModalOpen(true)
  }

  const handleSubmitMaterial = () => {
    router.push(`/aluno/material/${selectedActivity?.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Suas Trilhas de Aprendizado</h1>
            <p className="text-blue-100">Continue sua jornada de desenvolvimento profissional</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-200">Trilhas Concluídas</p>
                <p className="text-2xl font-bold">{mockTrilhas.filter(t => t.status === 'concluida').length}</p>
              </div>
              <div className="bg-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-200">Em Andamento</p>
                <p className="text-2xl font-bold">{mockTrilhas.filter(t => t.status === 'em-andamento').length}</p>
              </div>
              <div className="bg-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-200">Progresso Médio</p>
                <p className="text-2xl font-bold">
                  {Math.round(mockTrilhas.reduce((acc, t) => acc + t.progresso, 0) / mockTrilhas.length)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {mockTrilhas.map((trilha) => (
            <Card key={trilha.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{trilha.titulo}</h2>
                      {trilha.status === 'concluida' && (
                        <Badge className="bg-gray-600 text-white">Trilha Concluída</Badge>
                      )}
                      {trilha.status === 'em-andamento' && (
                        <Badge className="bg-blue-600 text-white">Em Andamento</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{trilha.descricao}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">{trilha.nivel}</Badge>
                      <span className="text-sm text-gray-600">{trilha.duracao}</span>
                      <span className="text-sm text-gray-600">
                        {trilha.atividadesCompletas} de {trilha.totalAtividades} atividades
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Progresso</span>
                        <span className="text-sm font-bold text-gray-800">{trilha.progresso}%</span>
                      </div>
                      <Progress value={trilha.progresso} className="h-2" />
                    </div>

                    {trilha.proximaAtividade && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-800">Próxima Atividade:</span>
                        </div>
                        <p className="text-sm text-gray-600">{trilha.proximaAtividade.titulo}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {trilha.status === 'concluida' ? (
                    <Button className="bg-gray-600 hover:bg-gray-700 text-white" disabled>
                      Trilha Concluída
                    </Button>
                  ) : (
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleEnterTrail(trilha)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Entrar na Trilha
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <QuickActions />
      </div>

      {/* Modal de Trilha */}
      <Dialog open={isTrailModalOpen} onOpenChange={setIsTrailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTrail?.titulo}</DialogTitle>
            <DialogDescription>{selectedTrail?.descricao}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedTrail?.atividades.map((atividade: any) => (
              <div
                key={atividade.id}
                className={`p-4 border rounded-lg ${
                  atividade.status === 'concluida' 
                    ? 'bg-green-50 border-green-200' 
                    : atividade.status === 'bloqueada'
                    ? 'bg-gray-100 border-gray-200 opacity-60'
                    : 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {atividade.status === 'concluida' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : atividade.status === 'bloqueada' ? (
                      <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{atividade.titulo}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {atividade.tipo === 'video' && <Video className="w-4 h-4 text-gray-500" />}
                        {atividade.tipo === 'projeto' && <Code className="w-4 h-4 text-gray-500" />}
                        {atividade.tipo === 'material' && <FileText className="w-4 h-4 text-gray-500" />}
                        <span className="text-sm text-gray-500 capitalize">{atividade.tipo}</span>
                      </div>
                    </div>
                  </div>
                  {atividade.status === 'pendente' && (
                    <Button
                      size="sm"
                      onClick={() => handleViewActivity(atividade)}
                    >
                      Ver Material
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Atividade */}
      <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedActivity?.titulo}</DialogTitle>
            <DialogDescription>Visualize o material e faça sua entrega</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Clique no botão abaixo para visualizar o material completo e fazer sua entrega.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={handleSubmitMaterial}
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Material e Entregar
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsActivityModalOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

