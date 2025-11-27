'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Play, Trophy, Loader2, GraduationCap, ChevronRight, FileText, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import getUserFromToken from '@/lib/auth/userToken'
import GetUserByIdService from '@/lib/api/user/getUserById'
import GetUserContentSummaryService from '@/lib/api/user/getUserContentSummary'
import { toast } from 'sonner'
import type { UserData } from '@/lib/interfaces/userInterfaces'
import type { CourseContentSummary } from '@/lib/interfaces/courseContentInterfaces'
import QuickActionsAluno from '@/components/admin/quickActionsAluno'

export default function AlunoTrilhasPage() {
  const router = useRouter()

  // Estados principais
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    // Recupera o curso selecionado do sessionStorage ao montar o componente
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('aluno_selected_course_id') || ''
    }
    return ''
  })
  const [courseContent, setCourseContent] = useState<CourseContentSummary | null>(null)
  const [isLoadingContent, setIsLoadingContent] = useState(false)

  // Cursos únicos extraídos das turmas do aluno
  const [availableCourses, setAvailableCourses] = useState<Array<{ id: number; name: string }>>([])

  // Carrega dados do usuário ao montar o componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingUser(true)
        const userFromToken = await getUserFromToken()

        if (!userFromToken?.id) {
          toast.error('Erro ao obter dados do usuário')
          return
        }

        const user = await GetUserByIdService(userFromToken.id)
        setUserData(user)
        setUserId(userFromToken.id)

        // Extrai cursos únicos das turmas do aluno
        if (user.classes && user.classes.length > 0) {
          const coursesMap = new Map<number, string>()

          user.classes.forEach(classItem => {
            if (classItem.course && classItem.course.id && classItem.course.name) {
              coursesMap.set(classItem.course.id, classItem.course.name)
            }
          })

          const uniqueCourses = Array.from(coursesMap.entries()).map(([id, name]) => ({
            id,
            name
          }))

          setAvailableCourses(uniqueCourses)

          // Recupera o curso salvo no sessionStorage ou seleciona o primeiro
          const savedCourseId = sessionStorage.getItem('aluno_selected_course_id')
          if (savedCourseId && uniqueCourses.some(c => c.id.toString() === savedCourseId)) {
            // Se o curso salvo ainda existe na lista, mantém a seleção
            setSelectedCourseId(savedCourseId)
          } else if (uniqueCourses.length > 0) {
            // Caso contrário, seleciona o primeiro curso
            const firstCourseId = uniqueCourses[0].id.toString()
            setSelectedCourseId(firstCourseId)
            sessionStorage.setItem('aluno_selected_course_id', firstCourseId)
          }
        } else {
          toast.info('Você não está vinculado a nenhuma turma ainda')
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        toast.error('Erro ao carregar seus dados')
      } finally {
        setIsLoadingUser(false)
      }
    }

    loadUserData()
  }, [])

  // Salva o curso selecionado no sessionStorage sempre que mudar
  useEffect(() => {
    if (selectedCourseId) {
      sessionStorage.setItem('aluno_selected_course_id', selectedCourseId)
    }
  }, [selectedCourseId])

  // Carrega conteúdo do curso quando selecionado
  useEffect(() => {
    const loadCourseContent = async () => {
      if (!selectedCourseId || !userId) {
        setCourseContent(null)
        return
      }

      setIsLoadingContent(true)
      try {
        console.log('[AlunoTrilhas] Carregando conteúdo personalizado:', { userId, courseId: selectedCourseId })
        const content = await GetUserContentSummaryService(userId, parseInt(selectedCourseId))
        setCourseContent(content)
        console.log('[AlunoTrilhas] Conteúdo carregado com sucesso:', {
          courseName: content.name,
          sectionsCount: content.sections?.length || 0
        })
      } catch (error) {
        console.error('[AlunoTrilhas] Erro ao carregar conteúdo do curso:', error)
        toast.error('Erro ao carregar trilhas do curso')
        setCourseContent(null)
      } finally {
        setIsLoadingContent(false)
      }
    }

    loadCourseContent()
  }, [selectedCourseId, userId])

  const handleEnterTask = (taskId: number) => {
    // Redireciona para a tela de material passando o ID da tarefa
    router.push(`/aluno/material/${taskId}`)
  }

  // Loading inicial
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    )
  }

  // Sem turmas vinculadas
  if (!userData?.classes || userData.classes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <GraduationCap className="h-24 w-24 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma turma encontrada</h2>
            <p className="text-gray-600">Você ainda não está vinculado a nenhuma turma. Entre em contato com a coordenação.</p>
          </div>
          <QuickActionsAluno />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Minhas Trilhas de Conhecimento</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Explore e acompanhe seu progresso nas trilhas de aprendizado</p>
        </div>

        {/* Select de Curso */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Selecionar Curso</Label>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-full sm:max-w-md h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
              <SelectValue placeholder="Selecione um curso" />
            </SelectTrigger>
            <SelectContent className="max-w-[calc(100vw-2rem)]">
              {availableCourses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  <span className="block whitespace-normal sm:whitespace-nowrap text-left">{course.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conteúdo */}
        {!selectedCourseId ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um curso</h3>
            <p className="text-gray-600">Escolha um curso acima para visualizar as trilhas de conhecimento</p>
          </div>
        ) : isLoadingContent ? (
          <div className="text-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando trilhas...</p>
          </div>
        ) : courseContent && courseContent.sections && courseContent.sections.length > 0 ? (
          <div className="space-y-6 mb-8">
            {courseContent.sections.map((section) => (
              <div key={section.id}>
                {/* Header do Semestre */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    {section.name}
                  </h2>
                </div>

                {/* Trilhas do Semestre - Agrupadas em Accordion */}
                <div className="grid grid-cols-1 gap-4">
                  {section.knowledgeTrails && section.knowledgeTrails.length > 0 ? (
                    <Accordion type="multiple" className="space-y-4">
                      {section.knowledgeTrails.map((trail) => (
                        <AccordionItem key={trail.id} value={`trail-${trail.id}`} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all">
                          <AccordionTrigger className="px-6 py-4 bg-white hover:bg-gray-50 transition-colors hover:no-underline">
                            <div className="flex items-center justify-between w-full mr-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                                  <BookOpen className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="text-left">
                                  <h3 className="text-xl font-bold text-gray-900 hover:no-underline">{trail.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {trail.tasks?.length || 0} {trail.tasks?.length === 1 ? 'tarefa' : 'tarefas'}
                                    </Badge>
                                    {trail.ranked && (
                                      <Badge className="bg-yellow-500 text-white">
                                        <Trophy className="h-3 w-3 mr-1" />
                                        Ranqueada
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 bg-white">
                            {/* Lista de Tarefas */}
                            {trail.tasks && trail.tasks.length > 0 ? (
                              <div className="space-y-2 pt-2">
                                {trail.tasks.map((task) => (
                                  <button
                                    key={task.id}
                                    onClick={() => handleEnterTask(task.id)}
                                    className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all group"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors flex-shrink-0">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div className="flex-1 min-w-0 text-left">
                                        <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                                          {task.name}
                                        </p>
                                        {task.description && (
                                          <p className="text-sm text-gray-600 truncate">
                                            {task.description}
                                          </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="outline" className="text-xs bg-white">
                                            {task.contents?.length || 0} {task.contents?.length === 1 ? 'material' : 'materiais'}
                                          </Badge>
                                          {task.difficultyLevel && (
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${task.difficultyLevel === 'FACIL' ? 'bg-green-50 text-green-700 border-green-200' :
                                                task.difficultyLevel === 'MEDIO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                  'bg-red-50 text-red-700 border-red-200'
                                                }`}
                                            >
                                              {task.difficultyLevel === 'FACIL' ? 'Fácil' : task.difficultyLevel === 'MEDIO' ? 'Médio' : 'Difícil'}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600">Nenhuma tarefa disponível nesta trilha</p>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-600">Nenhuma trilha disponível neste semestre</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma trilha encontrada</h3>
            <p className="text-gray-600">Este curso ainda não possui trilhas de conhecimento cadastradas</p>
          </div>
        )}

        <QuickActionsAluno />
      </div>
    </div>
  )
}

