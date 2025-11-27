'use client'

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Play, Trophy, Users, Loader2, GraduationCap, ArrowLeft, AlertCircle, ChevronRight, FileText, ChevronDown, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'
import GetUserByIdService from '@/lib/api/user/getUserById'
import GetRankedKnowledgeTrailsService from '@/lib/api/class/getRankedKnowledgeTrails'
import type { UserData } from '@/lib/interfaces/userInterfaces'
import type { RankedKnowledgeTrail } from '@/lib/interfaces/rankedKnowledgeTrailInterfaces'
import getUserFromToken from '@/lib/auth/userToken'

function AlunoEADContent() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: number; nome: string; code?: string }>>([])
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    // Recupera a turma selecionada do sessionStorage ao montar o componente
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('aluno_selected_class_id') || ''
    }
    return ''
  })
  const [rankedTrails, setRankedTrails] = useState<RankedKnowledgeTrail[]>([])
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [isLoadingTrails, setIsLoadingTrails] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // useEffect para carregar dados do usuário e turmas
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingUserData(true)
        setError(null)
        
        // 1. Busca ID do usuário do token
        const userFromToken = await getUserFromToken()
        if (!userFromToken?.id) {
          throw new Error('Usuário não encontrado no token')
        }
        
        // 2. Busca dados completos do usuário via API
        const user = await GetUserByIdService(userFromToken.id)
        setUserData(user)
        
        // 3. Extrai turmas únicas do usuário
        if (user.classes && user.classes.length > 0) {
          const uniqueClasses = user.classes
            .filter(classItem => classItem && (classItem.Id || classItem.id)) // Filtra turmas válidas
            .map(classItem => ({
              id: classItem.Id || classItem.id!, // Usa Id ou id com fallback
              nome: classItem.nome,
              code: classItem.code
            }))
          setAvailableClasses(uniqueClasses)
          
          // Recupera a turma salva no sessionStorage ou seleciona a primeira
          const savedClassId = sessionStorage.getItem('aluno_selected_class_id')
          if (savedClassId && uniqueClasses.some(c => c.id.toString() === savedClassId)) {
            // Se a turma salva ainda existe na lista, mantém a seleção
            setSelectedClassId(savedClassId)
          } else if (uniqueClasses.length > 0) {
            // Caso contrário, seleciona a primeira turma
            const firstClass = uniqueClasses[0] // Garante que existe
            const firstClassId = firstClass.id.toString()
            setSelectedClassId(firstClassId)
            sessionStorage.setItem('aluno_selected_class_id', firstClassId)
          }
        } else {
          // Usuário não tem turmas vinculadas
          setAvailableClasses([])
          setSelectedClassId('')
        }
      } catch (error) {
        console.error('[AlunoEAD] Erro ao carregar dados do usuário:', error)
        setError(error instanceof Error ? error.message : 'Erro ao carregar dados')
        toast.error('Erro ao carregar seus dados')
      } finally {
        setIsLoadingUserData(false)
      }
    }
    
    loadUserData()
  }, [])
  
  // useEffect para carregar trilhas rankeadas quando turma for selecionada
  useEffect(() => {
    const loadRankedTrails = async () => {
      if (!selectedClassId) {
        setRankedTrails([])
        return
      }
      
      try {
        setIsLoadingTrails(true)
        setError(null)
        
        const trails = await GetRankedKnowledgeTrailsService(parseInt(selectedClassId))
        setRankedTrails(trails)
      } catch (error) {
        console.error('[AlunoEAD] Erro ao carregar trilhas rankeadas:', error)
        setError(error instanceof Error ? error.message : 'Erro ao carregar trilhas')
        toast.error('Erro ao carregar trilhas da turma')
        setRankedTrails([])
      } finally {
        setIsLoadingTrails(false)
      }
    }
    
    loadRankedTrails()
  }, [selectedClassId])
  
  // Salva a turma selecionada no sessionStorage sempre que mudar
  useEffect(() => {
    if (selectedClassId) {
      sessionStorage.setItem('aluno_selected_class_id', selectedClassId)
    }
  }, [selectedClassId])
  
  // Handler para acessar uma atividade
  const handleEnterActivity = (activityId: number, activityName: string) => {
    router.push(`/aluno/material/${activityId}`)
  }
  
  // Handler para mudança de turma
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
  }
  
  // Se está carregando dados do usuário
  if (isLoadingUserData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    )
  }
  
  // Se usuário não tem turmas vinculadas
  if (!userData || availableClasses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              <p className="text-blue-100">Trilhas rankeadas das suas turmas</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16">
            <GraduationCap className="h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhuma turma encontrada</h2>
            <p className="text-gray-500 text-center max-w-md">
              Você ainda não está vinculado a nenhuma turma. 
              Entre em contato com o administrador para ser adicionado a uma turma.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white mb-8">
        <div className="flex flex-col sm:flex-row h-auto sm:h-20 items-start sm:items-center justify-between px-4 md:px-2 lg:px-8 max-w-[95%] mx-auto w-full py-4 sm:py-0 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Atividades EAD</h1>
            <p className="text-sm text-gray-600 hidden sm:block mt-1">Trilhas rankeadas das suas turmas</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/aluno/dashboard')}
              className="text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            {rankedTrails.length > 0 && (
              <Badge className="flex items-center gap-2 bg-blue-100 text-blue-700 border-blue-300 px-3 py-1.5">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline font-semibold">{rankedTrails.length} Trilhas Rankeadas</span>
                <span className="sm:hidden font-semibold">{rankedTrails.length}</span>
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:px-2 lg:px-8 pb-8 space-y-6 max-w-[95%] mx-auto w-full">
        {/* Select de Turmas */}
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Selecionar Turma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium text-gray-700">Turma:</Label>
              <Select
                value={selectedClassId}
                onValueChange={handleClassChange}
                disabled={availableClasses.length === 0}
              >
                <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {availableClasses.map((classItem) => (
                    <SelectItem 
                      key={classItem.id} 
                      value={classItem.id.toString()}
                      className="text-gray-900 focus:bg-blue-50"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {classItem.nome}
                        {classItem.code && (
                          <span className="text-gray-500">({classItem.code})</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* Mensagem de erro */}
        {error && (
          <Card className="border-2 border-red-200 rounded-xl shadow-sm bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Erro ao carregar dados</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Loading de trilhas */}
        {isLoadingTrails && selectedClassId && (
          <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Carregando trilhas rankeadas...</p>
            </CardContent>
          </Card>
        )}
        {/* Sem turma selecionada */}
        {!selectedClassId && !isLoadingTrails && (
          <Card className="border-2 border-dashed border-gray-300 rounded-xl shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecione uma turma</h3>
              <p className="text-gray-500 text-center">
                Escolha uma turma acima para ver as trilhas rankeadas disponíveis.
              </p>
            </CardContent>
          </Card>
        )}
        {/* Sem trilhas encontradas */}
        {!isLoadingTrails && selectedClassId && rankedTrails.length === 0 && !error && (
          <Card className="border-2 border-dashed border-gray-300 rounded-xl shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Trophy className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma trilha rankeada encontrada</h3>
              <p className="text-gray-500 text-center">
                Esta turma ainda não possui trilhas rankeadas disponíveis.
              </p>
            </CardContent>
          </Card>
        )}
        {/* Lista de trilhas rankeadas com accordion */}
        {!isLoadingTrails && rankedTrails.length > 0 && (
          <div className="space-y-4">
            <Accordion type="multiple" className="space-y-4">
              {rankedTrails.map((trail) => (
                <AccordionItem 
                  key={trail.id} 
                  value={`trail-${trail.id}`} 
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all"
                >
                  <AccordionTrigger className="px-6 py-4 bg-white hover:bg-gray-50 transition-colors hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Trophy className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-gray-900 hover:no-underline">{trail.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-yellow-500 text-white">
                              <Trophy className="h-3 w-3 mr-1" />
                              Rankeada
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {trail.tasks.length} {trail.tasks.length === 1 ? 'atividade' : 'atividades'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 bg-white">
                    {/* Lista de atividades da trilha */}
                    {trail.tasks && trail.tasks.length > 0 ? (
                      <div className="space-y-2 pt-2">
                        {trail.tasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => handleEnterActivity(task.id, task.name)}
                            className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all group"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors flex-shrink-0">
                                <BookOpen className="h-4 w-4 text-blue-600" />
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
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    Início: {new Date(task.startDate).toLocaleDateString('pt-BR')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {task.quantitySubmissions} envios
                                  </span>
                                  {task.lastSubmission && (
                                    <span className="flex items-center gap-1">
                                      Último: {new Date(task.lastSubmission).toLocaleDateString('pt-BR')}
                                    </span>
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
                        <p className="text-sm text-gray-600">Nenhuma atividade disponível nesta trilha</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        <QuickActionsAluno />
      </main>
    </div>
  )
}

export default function AlunoEADPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando atividades EAD...</p>
        </div>
      </div>
    }>
      <AlunoEADContent />
    </Suspense>
  )
}

