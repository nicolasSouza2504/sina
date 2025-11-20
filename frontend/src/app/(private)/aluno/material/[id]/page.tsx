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
import ViewSubmittedContentModal from '@/components/aluno/ViewSubmittedContentModal'
import getUserFromToken from '@/lib/auth/userToken'
import GetUserByIdService from '@/lib/api/user/getUserById'
import CourseContentSummaryService from '@/lib/api/course/courseContentSummary'
import GetTaskUserByUserAndTaskService from '@/lib/api/task-user/getTaskUserByUserAndTask'
import CreateTaskUserService from '@/lib/api/task-user/createTaskUser'
import { toast } from 'sonner'
import type { TaskSummary, TaskContentSummary } from '@/lib/interfaces/courseContentInterfaces'
import type { TaskUserResponse } from '@/lib/interfaces/taskUserInterfaces'
import type { FeedbackResponse } from '@/lib/interfaces/userResponseInterfaces'

export default function AlunoMaterialPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = (params?.id as string) || ''

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
  
  // Modal de visualização de conteúdo enviado
  const [isViewSubmittedModalOpen, setIsViewSubmittedModalOpen] = useState(false)
  const [selectedSubmittedContent, setSelectedSubmittedContent] = useState<any>(null)

  // Função para carregar dados do TaskUser
  const loadTaskUserData = async (userId: number, taskId: number) => {
    try {
      setIsLoadingTaskUser(true)
      console.log('[AlunoMaterial] Buscando TaskUser:', { userId, taskId })
      
      try {
        // Tenta buscar TaskUser existente
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
            contentsCount: taskUserResponse.userResponse.contents?.length || 0,
            contents: taskUserResponse.userResponse.contents
          })
        } else {
          console.log('[AlunoMaterial] Aluno ainda não enviou resposta para esta tarefa')
        }
        
        // Verifica feedback (vem no nível raiz do TaskUserResponse)
        if (taskUserResponse.feedback) {
          console.log('[AlunoMaterial] Feedback do professor encontrado:', {
            feedbackId: taskUserResponse.feedback.id,
            grade: taskUserResponse.feedback.grade,
            comment: taskUserResponse.feedback.comment,
            teacher: taskUserResponse.feedback.teacher.nome
          })
        } else {
          console.log('[AlunoMaterial] Atividade ainda não foi avaliada pelo professor')
        }
      } catch (err) {
        // Se TaskUser não existe (404), cria automaticamente
        const errorMessage = err instanceof Error ? err.message : ''
        
        if (errorMessage.includes('não encontrado') || errorMessage.includes('not found')) {
          console.log('[AlunoMaterial] TaskUser não existe - criando automaticamente...')
          
          try {
            // Cria o TaskUser
            const newTaskUser = await CreateTaskUserService({
              userId: userId,
              taskId: taskId
            })
            
            console.log('[AlunoMaterial] TaskUser criado com sucesso:', {
              taskUserId: newTaskUser.id,
              userId: newTaskUser.userId,
              taskId: newTaskUser.taskId
            })
            
            // Busca novamente para obter a estrutura completa com userResponse
            const taskUserResponse = await GetTaskUserByUserAndTaskService(userId, taskId)
            
            setTaskUserData(taskUserResponse)
            setTaskUserId(taskUserResponse.id)
            
            toast.success('Registro criado com sucesso!', {
              description: 'Você pode agora enviar sua atividade'
            })
          } catch (createErr) {
            console.error('[AlunoMaterial] Erro ao criar TaskUser:', createErr)
            const createErrorMessage = createErr instanceof Error ? createErr.message : 'Erro ao criar registro'
            toast.error('Erro ao criar registro da tarefa', {
              description: createErrorMessage
            })
          }
        } else {
          // Outro tipo de erro
          console.error('[AlunoMaterial] Erro ao buscar TaskUser:', err)
          toast.error('Erro ao buscar dados da tarefa', {
            description: errorMessage
          })
        }
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

  const handleViewSubmittedContent = (content: any) => {
    console.log('[AlunoMaterial] Abrindo modal de visualização de conteúdo enviado:', {
      content: content,
      contentName: content.name,
      contentType: content.taskContentType,
      contentUrl: content.url
    })
    setSelectedSubmittedContent(content)
    setIsViewSubmittedModalOpen(true)
    console.log('[AlunoMaterial] Estados atualizados:', {
      selectedSubmittedContent: content,
      isViewSubmittedModalOpen: true
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                          <div className={`p-1 rounded-full flex-shrink-0 mt-0.5 ${
                            taskUserData.feedback ? 'bg-yellow-500' : 'bg-green-600'
                          }`}>
                            {taskUserData.feedback ? (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${
                              taskUserData.feedback ? 'text-yellow-900' : 'text-green-900'
                            }`}>
                              {taskUserData.feedback ? 'Atividade avaliada' : 'Atividade já enviada'}
                            </p>
                            <p className={`text-xs mt-1 ${
                              taskUserData.feedback ? 'text-yellow-700' : 'text-green-700'
                            }`}>
                              TaskUser ID: {taskUserId}
                              {taskUserData.feedback && (
                                <>
                                  {' • Nota: '}
                                  <span className="font-bold">
                                    {taskUserData.feedback.grade.toFixed(1)}
                                  </span>
                                </>
                              )}
                            </p>
                            {taskUserData.userResponse.comment && (
                              <p className={`text-xs mt-1 ${
                                taskUserData.feedback ? 'text-yellow-600' : 'text-green-600'
                              }`}>
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
                  <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-red-600 rounded-full flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900">
                          Erro ao carregar registro
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          Não foi possível criar ou carregar o registro da tarefa. Recarregue a página.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Seção de Arquivos Enviados - Mostrar se já existe userResponse */}
                {taskUserData?.userResponse && taskUserData.userResponse.contents && taskUserData.userResponse.contents.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Arquivos Enviados ({taskUserData.userResponse.contents.length})
                      </h4>
                      <Badge className="bg-green-100 text-green-700 border-2 border-green-200">
                        ✓ Enviado
                      </Badge>
                    </div>
                    
                    {/* Comentário do aluno */}
                    {taskUserData.userResponse.comment && (
                      <div className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Seu comentário:</p>
                        <p className="text-sm text-gray-800">{taskUserData.userResponse.comment}</p>
                      </div>
                    )}

                    {/* Feedback do Professor */}
                    {taskUserData.feedback && (
                      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-green-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-green-900">
                              Avaliação do Professor
                            </h4>
                            <p className="text-xs text-green-700">
                              por {taskUserData.feedback.teacher.nome}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-lg font-bold text-green-900">
                                {taskUserData.feedback.grade.toFixed(1)}
                              </span>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Nota Final
                            </Badge>
                          </div>
                          
                          {taskUserData.feedback.comment && (
                            <div>
                              <p className="text-xs font-semibold text-green-800 mb-1">Comentário do professor:</p>
                              <p className="text-sm text-green-900 bg-white p-3 rounded-lg border border-green-200">
                                {taskUserData.feedback.comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Lista de arquivos enviados */}
                    <div className="space-y-2">
                      {taskUserData.userResponse.contents.map((content: any, index: number) => (
                        <div
                          key={content.id || index}
                          className="flex items-center justify-between p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {content.taskContentType === 'PDF' && <FileText className="w-5 h-5 text-red-600 flex-shrink-0" />}
                            {(content.taskContentType === 'VIDEO' || content.taskContentType === 'MP4') && <Video className="w-5 h-5 text-purple-600 flex-shrink-0" />}
                            {(content.taskContentType === 'JPG' || content.taskContentType === 'PNG') && <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                            {!['PDF', 'VIDEO', 'MP4', 'JPG', 'PNG'].includes(content.taskContentType) && <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />}
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {content.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {content.taskContentType}
                              </p>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewSubmittedContent(content)}
                            className="flex-shrink-0 h-8 px-3 hover:bg-blue-100 group-hover:bg-blue-100"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                        </div>
                      ))}
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

      {/* Modal de Visualização de Conteúdo Enviado */}
      <ViewSubmittedContentModal
        open={isViewSubmittedModalOpen && !!selectedSubmittedContent}
        onOpenChange={(open) => {
          setIsViewSubmittedModalOpen(open)
          if (!open) {
            setSelectedSubmittedContent(null)
          }
        }}
        contentName={selectedSubmittedContent?.name || ''}
        contentType={selectedSubmittedContent?.taskContentType || 'PDF'}
        contentUrl={selectedSubmittedContent?.url || ''}
      />
    </div>
  )
}

