'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Video, Download, Upload, Loader2, Eye, BookOpen, AlertCircle } from "lucide-react"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'
import ViewTaskContentModal from '@/components/KnowledgeTrail/ViewTaskContentModal'
import getUserFromToken from '@/lib/auth/userToken'
import GetUserByIdService from '@/lib/api/user/getUserById'
import CourseContentSummaryService from '@/lib/api/course/courseContentSummary'
import { toast } from 'sonner'
import type { TaskSummary, TaskContentSummary } from '@/lib/interfaces/courseContentInterfaces'

export default function AlunoMaterialPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  // Estados
  const [task, setTask] = useState<TaskSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  
  // Modal de visualização de conteúdo
  const [isViewContentModalOpen, setIsViewContentModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<TaskContentSummary | null>(null)

  // Carrega a tarefa ao montar o componente
  useEffect(() => {
    const loadTask = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // 1. Busca dados do usuário
        const userFromToken = await getUserFromToken()
        if (!userFromToken?.id) {
          throw new Error('Usuário não autenticado')
        }

        const user = await GetUserByIdService(userFromToken.id)
        
        // 2. Busca todos os cursos do aluno
        if (!user.classes || user.classes.length === 0) {
          throw new Error('Você não está vinculado a nenhuma turma')
        }

        // 3. Extrai cursos únicos
        const coursesMap = new Map<number, string>()
        user.classes.forEach(classItem => {
          if (classItem.course) {
            coursesMap.set(classItem.course.id, classItem.course.name)
          }
        })

        // 4. Busca conteúdo de todos os cursos até encontrar a tarefa
        let foundTask: TaskSummary | null = null
        
        for (const [courseId] of coursesMap.entries()) {
          try {
            const courseContent = await CourseContentSummaryService(courseId)
            
            // Procura a tarefa em todas as sections e trails
            for (const section of courseContent.sections) {
              for (const trail of section.knowledgeTrails) {
                const taskFound = trail.tasks.find(t => t.id === parseInt(taskId))
                if (taskFound) {
                  foundTask = taskFound
                  break
                }
              }
              if (foundTask) break
            }
            if (foundTask) break
          } catch (err) {
            console.error(`Erro ao buscar curso ${courseId}:`, err)
            // Continua para o próximo curso
          }
        }

        if (!foundTask) {
          throw new Error('Tarefa não encontrada')
        }

        console.log('[AlunoMaterial] Tarefa encontrada:', {
          taskId: foundTask.id,
          taskName: foundTask.name,
          contentsCount: foundTask.contents?.length || 0,
          contents: foundTask.contents?.map(c => ({
            id: c.id,
            name: c.name,
            type: c.contentType,
            url: c.contentUrl
          }))
        })

        setTask(foundTask)
      } catch (err) {
        console.error('Erro ao carregar tarefa:', err)
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tarefa'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadTask()
  }, [taskId])

  const handleViewContent = (content: TaskContentSummary) => {
    console.log('[AlunoMaterial] Abrindo modal de visualização:', {
      contentName: content.name,
      contentType: content.contentType,
      contentUrl: content.contentUrl
    })
    setSelectedContent(content)
    setIsViewContentModalOpen(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSubmissionFile(file)
    }
  }

  const handleSubmit = () => {
    if (!submissionFile) {
      return
    }
    console.log('Enviando arquivo:', submissionFile.name)
    router.push('/aluno/ead')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando tarefa...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-center py-16">
            <AlertCircle className="h-24 w-24 mx-auto mb-4 text-red-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar tarefa</h2>
            <p className="text-gray-600">{error || 'Tarefa não encontrada'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações da Tarefa */}
            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {task.name}
                    </CardTitle>
                    {task.description && (
                      <p className="text-gray-600 mt-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {task.contents?.length || 0} {task.contents?.length === 1 ? 'material' : 'materiais'}
                      </Badge>
                      {task.difficultyLevel && (
                        <Badge 
                          variant="outline" 
                          className={`${
                            task.difficultyLevel === 'FACIL' ? 'bg-green-50 text-green-700 border-green-200' :
                            task.difficultyLevel === 'MEDIO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {task.difficultyLevel === 'FACIL' ? 'Fácil' : task.difficultyLevel === 'MEDIO' ? 'Médio' : 'Difícil'}
                        </Badge>
                      )}
                      {task.dueDate && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            {/* Card de Materiais */}
            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Materiais de Estudo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {task.contents && task.contents.length > 0 ? (
                  <div className="space-y-3">
                    {task.contents.map((content) => (
                      <div
                        key={content.id}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors flex-shrink-0">
                            {content.contentType === 'PDF' && <FileText className="h-5 w-5 text-red-600" />}
                            {(content.contentType === 'VIDEO' || content.contentType === 'MP4') && <Video className="h-5 w-5 text-purple-600" />}
                            {(content.contentType === 'JPG' || content.contentType === 'PNG') && <FileText className="h-5 w-5 text-blue-600" />}
                            {content.contentType === 'LINK' && <FileText className="h-5 w-5 text-indigo-600" />}
                            {!['PDF', 'VIDEO', 'MP4', 'JPG', 'PNG', 'LINK'].includes(content.contentType) && <FileText className="h-5 w-5 text-gray-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                              {content.name}
                            </p>
                            <Badge 
                              variant="outline" 
                              className="text-xs mt-1 bg-white"
                            >
                              {content.contentType}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContent(content)}
                          className="flex-shrink-0 hover:bg-purple-100"
                        >
                          <Eye className="h-4 w-4 text-purple-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-600">Nenhum material disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card de Entrega (TODO: Implementar integração com API) */}
            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Entrega da Atividade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Enviar arquivo da atividade
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf,.zip,.doc,.docx"
                      onChange={handleFileUpload}
                      className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {submissionFile && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{submissionFile.name}</span>
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-semibold"
                    onClick={handleSubmit}
                    disabled={!submissionFile}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Atividade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Informações da Tarefa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ordem</p>
                  <p className="text-gray-900">Tarefa #{task.taskOrder}</p>
                </div>
                {task.difficultyLevel && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dificuldade</p>
                    <Badge 
                      className={`mt-1 ${
                        task.difficultyLevel === 'FACIL' ? 'bg-green-100 text-green-700' :
                        task.difficultyLevel === 'MEDIO' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {task.difficultyLevel === 'FACIL' ? 'Fácil' : task.difficultyLevel === 'MEDIO' ? 'Médio' : 'Difícil'}
                    </Badge>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Prazo de Entrega</p>
                    <p className="text-gray-900">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Materiais</p>
                  <p className="text-gray-900">{task.contents?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActionsAluno />
      </div>

      {/* Modal de Visualização de Conteúdo */}
      {selectedContent && (
        <ViewTaskContentModal
          open={isViewContentModalOpen}
          onOpenChange={(open) => {
            setIsViewContentModalOpen(open)
            if (!open) {
              setSelectedContent(null)
            }
          }}
          contentName={selectedContent.name}
          contentType={selectedContent.contentType}
          contentUrl={selectedContent.contentUrl}
        />
      )}
    </div>
  )
}

