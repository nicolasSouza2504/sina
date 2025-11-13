'use client'

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, CheckCircle, AlertCircle, FileText, Upload, ArrowLeft, BookOpen, Link as LinkIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'
import Link from "next/link"

function AlunoEADContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [highlightedActivityId, setHighlightedActivityId] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false)
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [submissionComment, setSubmissionComment] = useState('')

  const mockActivities = [
    {
      id: 1,
      titulo: "Projeto React - Componentes",
      disciplina: "Desenvolvimento Web",
      prazo: "2024-01-15",
      status: "pendente",
      descricao: "Crie componentes React reutilizáveis seguindo as melhores práticas",
      instrucoes: "Desenvolva pelo menos 3 componentes funcionais com TypeScript. Envie o código e um PDF com screenshots.",
      tipoArquivo: ".zip, .pdf, .doc"
    },
    {
      id: 2,
      titulo: "API REST - Implementação",
      disciplina: "Arquitetura de Software",
      prazo: "2024-01-22",
      status: "pendente",
      descricao: "Implemente uma API REST completa com CRUD",
      instrucoes: "Crie endpoints para todas as operações CRUD. Inclua validação e tratamento de erros.",
      tipoArquivo: ".zip, .pdf"
    },
    {
      id: 3,
      titulo: "Banco de Dados - Modelagem",
      disciplina: "Banco de Dados",
      prazo: "2024-01-10",
      status: "entregue",
      nota: 9.5,
      feedback: "Excelente trabalho! A modelagem está muito bem estruturada.",
      professor: "Prof. Silva",
      dataEntrega: "2024-01-08"
    },
    {
      id: 4,
      titulo: "Algoritmos - Análise de Complexidade",
      disciplina: "Algoritmos e Estruturas de Dados",
      prazo: "2024-01-05",
      status: "avaliado",
      nota: 8.0,
      feedback: "Bom desenvolvimento, mas pode melhorar na documentação dos algoritmos.",
      professor: "Prof. Costa",
      dataEntrega: "2024-01-03"
    }
  ]

  useEffect(() => {
    if (!searchParams) return
    const activityId = searchParams.get('activity')
    if (activityId) {
      setHighlightedActivityId(activityId)
      const activity = mockActivities.find(a => a.id.toString() === activityId)
      if (activity && activity.status === 'pendente') {
        setSelectedActivity(activity)
        setIsSubmissionModalOpen(true)
      }
    }
  }, [searchParams])

  const handleSubmitActivity = () => {
    if (!submissionFile && !submissionComment.trim()) {
      return
    }
    
    console.log('Submetendo atividade:', {
      activityId: selectedActivity.id,
      file: submissionFile?.name,
      comment: submissionComment
    })
    
    setIsSubmissionModalOpen(false)
    setSubmissionFile(null)
    setSubmissionComment('')
    setSelectedActivity(null)
  }

  const getStatusBadge = (activity: any) => {
    switch (activity.status) {
      case 'pendente':
        return <Badge variant="destructive">Pendente</Badge>
      case 'entregue':
        return <Badge variant="default">Entregue</Badge>
      case 'avaliado':
        return <Badge variant="default" className="bg-green-600">Avaliado</Badge>
      default:
        return <Badge variant="secondary">{activity.status}</Badge>
    }
  }

  const isActivityHighlighted = (activityId: number) => {
    return highlightedActivityId === activityId.toString()
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/aluno/dashboard')}
                className="text-white hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">Atividades EAD</h1>
            <p className="text-blue-100">Gerencie suas atividades de ensino a distância</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-200">Pendentes</p>
                <p className="text-2xl font-bold">
                  {mockActivities.filter(a => a.status === 'pendente').length}
                </p>
              </div>
              <div className="bg-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-200">Entregues</p>
                <p className="text-2xl font-bold">
                  {mockActivities.filter(a => a.status === 'entregue').length}
                </p>
              </div>
              <div className="bg-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-200">Avaliadas</p>
                <p className="text-2xl font-bold">
                  {mockActivities.filter(a => a.status === 'avaliado').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {mockActivities.map((activity) => {
            const daysUntil = getDaysUntilDeadline(activity.prazo)
            const isHighlighted = isActivityHighlighted(activity.id)
            
            return (
              <Card
                key={activity.id}
                className={`bg-white border-2 ${
                  isHighlighted
                    ? 'border-blue-500 ring-4 ring-blue-200 bg-blue-50'
                    : 'border-gray-200 hover:shadow-lg'
                } transition-all`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          {activity.titulo}
                          {isHighlighted && (
                            <Badge className="ml-2 bg-blue-600 text-white">Destacada</Badge>
                          )}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-gray-600">
                        {activity.disciplina}
                      </CardDescription>
                    </div>
                    {getStatusBadge(activity)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activity.descricao && (
                    <p className="text-gray-700">{activity.descricao}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Prazo: {new Date(activity.prazo).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {daysUntil >= 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className={daysUntil <= 3 ? 'text-red-600 font-semibold' : ''}>
                          {daysUntil === 0 ? 'Vence hoje' : `${daysUntil} dias restantes`}
                        </span>
                      </div>
                    )}
                    {daysUntil < 0 && (
                      <Badge variant="destructive">Atrasada</Badge>
                    )}
                  </div>

                  {activity.status === 'avaliado' && activity.nota && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-green-900">Avaliação Recebida</p>
                          <p className="text-sm text-green-700">Por {activity.professor}</p>
                        </div>
                        <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                          {activity.nota.toFixed(1)}
                        </Badge>
                      </div>
                      {activity.feedback && (
                        <p className="text-sm text-gray-700 mt-2">{activity.feedback}</p>
                      )}
                      {activity.dataEntrega && (
                        <p className="text-xs text-gray-600 mt-2">
                          Entregue em: {new Date(activity.dataEntrega).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  )}

                  {activity.status === 'entregue' && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-blue-900">
                          Atividade entregue em {new Date(activity.dataEntrega || activity.prazo).toLocaleDateString('pt-BR')}. 
                          Aguardando avaliação.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {activity.status === 'pendente' && (
                      <Button
                        className={`${
                          isHighlighted
                            ? 'bg-blue-600 hover:bg-blue-700 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                        onClick={() => {
                          setSelectedActivity(activity)
                          setIsSubmissionModalOpen(true)
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isHighlighted ? 'Entregar Agora' : 'Entregar'}
                      </Button>
                    )}
                    {activity.status === 'avaliado' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedActivity(activity)
                          setIsSubmissionModalOpen(true)
                        }}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <QuickActionsAluno />
      </div>

      {/* Modal de Entrega */}
      <Dialog open={isSubmissionModalOpen} onOpenChange={setIsSubmissionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedActivity?.status === 'avaliado' ? 'Detalhes da Atividade' : 'Entregar Atividade'}
            </DialogTitle>
            <DialogDescription>
              {selectedActivity?.titulo}
            </DialogDescription>
          </DialogHeader>
          {selectedActivity?.status === 'avaliado' ? (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-green-900">Nota</p>
                  <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                    {selectedActivity.nota?.toFixed(1)}
                  </Badge>
                </div>
                {selectedActivity.feedback && (
                  <p className="text-sm text-gray-700 mt-2">{selectedActivity.feedback}</p>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  Avaliado por {selectedActivity.professor}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {selectedActivity?.instrucoes && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Instruções</h4>
                  <p className="text-sm text-gray-700">{selectedActivity.instrucoes}</p>
                  {selectedActivity.tipoArquivo && (
                    <p className="text-xs text-gray-600 mt-2">
                      Formatos aceitos: {selectedActivity.tipoArquivo}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Comentários (opcional)</label>
                <Textarea
                  placeholder="Adicione algum comentário sobre sua entrega..."
                  value={submissionComment}
                  onChange={(e) => setSubmissionComment(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Arquivo</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf,.zip,.doc,.docx"
                    onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {selectedActivity?.tipoArquivo && (
                  <p className="text-xs text-gray-500">
                    Formatos: {selectedActivity.tipoArquivo}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSubmitActivity}
                  disabled={!submissionFile && !submissionComment.trim()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Entrega
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmissionModalOpen(false)
                    setSubmissionFile(null)
                    setSubmissionComment('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AlunoEADPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando atividades...</p>
        </div>
      </div>
    }>
      <AlunoEADContent />
    </Suspense>
  )
}

