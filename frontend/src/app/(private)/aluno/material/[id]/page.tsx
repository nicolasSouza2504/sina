'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Video, Download, Upload, Loader2, Eye, BookOpen, AlertCircle } from "lucide-react"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'
import ViewTaskContentModal from '@/components/KnowledgeTrail/ViewTaskContentModal'
import SubmitTaskModal from '@/components/aluno/SubmitTaskModal'
import getUserFromToken from '@/lib/auth/userToken'
import GetUserByIdService from '@/lib/api/user/getUserById'
import CourseContentSummaryService from '@/lib/api/course/courseContentSummary'
import GetTaskUserByUserAndTaskService from '@/lib/api/task-user/getTaskUserByUserAndTask'
import { toast } from 'sonner'
import type { TaskSummary, TaskContentSummary } from '@/lib/interfaces/courseContentInterfaces'
import type { TaskUserResponse } from '@/lib/interfaces/taskUserInterfaces'

export default function AlunoMaterialPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  // Estados
  const [task, setTask] = useState<TaskSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados do TaskUser
  const [taskUserData, setTaskUserData] = useState<TaskUserResponse | null>(null)
  const [taskUserId, setTaskUserId] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [isLoadingTaskUser, setIsLoadingTaskUser] = useState(false)
  
  // Modal de visualização de conteúdo
  const [isViewContentModalOpen, setIsViewContentModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<TaskContentSummary | null>(null)
  
  // Modal de submissão de atividade
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  // Função para carregar dados do TaskUser
  const loadTaskUserData = async (userId: number, taskId: number) => {
    try {
      setIsLoadingTaskUser(true)
      console.log('[AlunoMaterial] Buscando TaskUser:', { userId, taskId })
      
      const taskUserResponse = await GetTaskUserByUserAndTaskService(userId, taskId)
      
      console.log('[AlunoMaterial] TaskUser encontrado:', {
        taskUserId: taskUserResponse.id,
        hasUserResponse: !!taskUserResponse.userResponse,
        userResponseId: taskUserResponse.userResponse?.id
      })
      
      setTaskUserData(taskUserResponse)
      setTaskUserId(taskUserResponse.id)
      
      if (taskUserResponse.userResponse) {
        console.log('[AlunoMaterial] Aluno já possui resposta enviada:', {
          responseId: taskUserResponse.userResponse.id,
          comment: taskUserResponse.userResponse.comment,
          contentsCount: taskUserResponse.userResponse.contents?.length || 0
        })
      } else {
        console.log('[AlunoMaterial] Aluno ainda não enviou resposta para esta tarefa')
      }
    } catch (err) {
      console.error('[AlunoMaterial] Erro ao buscar TaskUser:', err)
      // Não mostra toast de erro aqui pois o TaskUser pode não existir ainda
      // (aluno pode estar acessando a tarefa pela primeira vez)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados da tarefa'
      if (errorMessage.includes('não encontrado')) {
        console.log('[AlunoMaterial] TaskUser não existe ainda - primeira vez que aluno acessa esta tarefa')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsLoadingTaskUser(false)
    }
  }

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
        setUserId(userFromToken.id)

        // 5. Busca dados do TaskUser (relação entre usuário e tarefa)
        await loadTaskUserData(userFromToken.id, parseInt(taskId))
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

  const handleOpenSubmitModal = () => {
    // Verifica se já existe resposta enviada
    if (taskUserData?.userResponse) {
      toast.info('Você já enviou uma resposta para esta atividade', {
        description: 'Não é possível enviar novamente'
      })
      return
    }

    // Verifica se tem taskUserId
    if (!taskUserId) {
      toast.error('Erro ao identificar a tarefa', {
        description: 'Recarregue a página e tente novamente'
      })
      return
    }

    setIsSubmitModalOpen(true)
  }

  const handleSubmitSuccess = async () => {
    // Recarrega os dados do TaskUser após submissão bem-sucedida
    if (userId && taskId) {
      await loadTaskUserData(userId, parseInt(taskId))
    }
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

            {/* Card de Entrega */}
            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center justify-between">
                  <span>Entrega da Atividade</span>
                  {isLoadingTaskUser && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status da Entrega */}
                {taskUserData && (
                  <div className={`p-3 rounded-lg border-2 ${
                    taskUserData.userResponse 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      {taskUserData.userResponse ? (
                        <>
                          <div className="p-1 bg-green-600 rounded-full flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-900">
                              Atividade já enviada
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              TaskUser ID: {taskUserId}
                            </p>
                            {taskUserData.userResponse.comment && (
                              <p className="text-xs text-green-700 mt-1">
                                Comentário: {taskUserData.userResponse.comment}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-1 bg-blue-600 rounded-full flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-900">
                              Atividade pendente
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              TaskUser ID: {taskUserId} - Envie sua resposta abaixo
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {!taskUserData && !isLoadingTaskUser && (
                  <div className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-yellow-600 rounded-full flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-yellow-900">
                          Primeira vez acessando esta tarefa
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          O sistema criará seu registro ao enviar a primeira resposta
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleOpenSubmitModal}
                    disabled={!!taskUserData?.userResponse || isLoadingTaskUser}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {taskUserData?.userResponse ? 'Atividade Já Enviada' : 'Enviar Atividade'}
                  </Button>
                  {taskUserData?.userResponse && (
                    <p className="text-xs text-gray-500 text-center">
                      Você já enviou uma resposta para esta atividade
                    </p>
                  )}
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

      {/* Modal de Submissão de Atividade */}
      {task && (
        <SubmitTaskModal
          open={isSubmitModalOpen}
          onOpenChange={setIsSubmitModalOpen}
          taskName={task.name}
          taskUserId={taskUserId}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  )
}

