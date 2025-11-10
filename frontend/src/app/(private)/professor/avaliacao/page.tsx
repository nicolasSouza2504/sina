'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  BookOpen,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Download,
  Loader2,
  RefreshCcw,
  GraduationCap,
  ClipboardList,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ClassSummary, ClassSummaryUser, TaskUserResponseSummary } from "@/lib/interfaces/classSummaryInterfaces";
import { Course } from "@/lib/interfaces/courseInterfaces";
import CourseList from "@/lib/api/course/courseList";
import GetClassSummaryService from "@/lib/api/class/getClassSummary";
import QuickActions from '@/components/admin/quickActions';

export default function AvaliacaoConteudo() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Estados principais
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [classSummary, setClassSummary] = useState<ClassSummary | null>(null);
  
  // Estados de loading e erro
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingClassSummary, setIsLoadingClassSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega cursos ao montar o componente e restaura filtros
  useEffect(() => {
    loadCourses();
    
    // Restaura os filtros salvos (se existirem)
    const savedFilters = sessionStorage.getItem('avaliacao_filters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setSelectedCourseId(filters.selectedCourseId || '');
        setSelectedClassId(filters.selectedClassId || '');
        // Limpa os filtros salvos após restaurar
        sessionStorage.removeItem('avaliacao_filters');
      } catch (error) {
        console.error('Erro ao restaurar filtros:', error);
      }
    }
  }, []);

  // Carrega resumo da turma quando uma turma é selecionada
  useEffect(() => {
    if (selectedClassId) {
      loadClassSummary();
    } else {
      setClassSummary(null);
    }
  }, [selectedClassId]);

  const loadCourses = async () => {
    setIsLoadingCourses(true);
    setError(null);
    
    try {
      const coursesData = await CourseList();
      setCourses(coursesData);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
      setError('Erro ao carregar cursos');
      toast.error('Erro ao carregar cursos');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Handler para redirecionar para tela de avaliação
  const handleOpenEvaluation = (
    task: TaskUserResponseSummary,
    student: ClassSummaryUser
  ) => {
    if (!task.userResponse) return;
    
    // Salva os dados no sessionStorage para a próxima tela
    const evaluationData = {
      userResponse: task.userResponse,
      studentName: student.nome,
      taskId: task.taskId,
      feedback: task.feedback // ✅ Inclui feedback se existir
    };
    
    sessionStorage.setItem(`evaluation_${task.userResponse.id}`, JSON.stringify(evaluationData));
    
    // Salva o estado dos filtros para restaurar ao voltar
    sessionStorage.setItem('avaliacao_filters', JSON.stringify({
      selectedCourseId,
      selectedClassId
    }));
    
    // Redireciona para a tela de avaliação individual
    router.push(`/professor/avaliacao/${task.userResponse.id}`);
  };

  const loadClassSummary = async () => {
    if (!selectedClassId) return;
    
    setIsLoadingClassSummary(true);
    setError(null);
    try {
      const summary = await GetClassSummaryService(parseInt(selectedClassId));
      setClassSummary(summary);
      toast.success('✅ Dados da turma carregados');
    } catch (error) {
      console.error('Erro ao carregar resumo da turma:', error);
      setError('Erro ao carregar dados da turma');
      toast.error('Erro ao carregar dados da turma');
    } finally {
      setIsLoadingClassSummary(false);
    }
  };

  // Filtra turmas pelo curso selecionado
  const availableClasses = courses.flatMap(course => 
    course.classes.map(cls => ({
      ...cls,
      courseName: course.name
    }))
  );

  const filteredClasses = selectedCourseId 
    ? availableClasses.filter(cls => cls.courseId === parseInt(selectedCourseId))
    : availableClasses;

  // Renderiza as tarefas do aluno
  const renderStudentTasks = (student: ClassSummaryUser) => {
    // Filtra apenas tarefas que têm resposta (userResponse !== null)
    const tasksWithResponse = student.taskUser.filter(task => task.userResponse !== null);
    
    if (tasksWithResponse.length === 0) {
      return (
        <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg border border-gray-200">
          <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
          <p className="text-sm sm:text-base text-gray-600">O aluno ainda não entregou nenhuma tarefa</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-3">
        {tasksWithResponse.map((task, index) => {
          const hasFeedback = task.feedback !== undefined && task.feedback !== null;
          
          return (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl transition-colors ${
                hasFeedback 
                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                  : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                  hasFeedback ? 'bg-green-600' : 'bg-orange-600'
                }`}>
                  {hasFeedback ? (
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm sm:text-base ${
                    hasFeedback ? 'text-green-900' : 'text-orange-900'
                  }`}>
                    Tarefa #{task.taskId}
                  </p>
                  <p className={`text-xs sm:text-sm ${
                    hasFeedback ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    Entregue em {new Date(task.userResponse?.createdAt || '').toLocaleDateString('pt-BR')}
                  </p>
                  {task.userResponse?.comment && (
                    <p className={`text-xs sm:text-sm mt-1 line-clamp-2 ${
                      hasFeedback ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      "{task.userResponse.comment}"
                    </p>
                  )}
                  {hasFeedback && task.feedback && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Nota: {task.feedback.grade.toFixed(1)}
                      </Badge>
                      <span className="text-xs text-green-600 truncate">
                        por {task.feedback.teacher.nome}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                <Badge 
                  variant="outline" 
                  className={`text-xs flex-1 sm:flex-none justify-center ${
                    hasFeedback 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-orange-100 text-orange-700 border-orange-200'
                  }`}
                >
                  {hasFeedback ? 'Avaliado' : 'Pendente'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => task.userResponse && handleOpenEvaluation(task, student)}
                  className={`h-8 w-8 p-0 flex-shrink-0 ${
                    hasFeedback 
                      ? 'hover:bg-green-100 text-green-600' 
                      : 'hover:bg-orange-100 text-orange-600'
                  }`}
                  title={hasFeedback ? 'Editar avaliação' : 'Avaliar entrega'}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
            <span className="truncate">Avaliação de Entregas</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Visualize e avalie as tarefas entregues pelos alunos
          </p>
        </div>
        <Button
          onClick={loadCourses}
          variant="outline"
          className="w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 h-10 sm:h-11"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            <span className="truncate">Selecionar Turma</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Curso</label>
              <Select
                value={selectedCourseId}
                onValueChange={(value) => {
                  setSelectedCourseId(value);
                  setSelectedClassId('');
                }}
                disabled={isLoadingCourses}
              >
                <SelectTrigger className="h-11 sm:h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors rounded-lg sm:rounded-xl text-sm sm:text-base">
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent className="max-w-[calc(100vw-2rem)]">
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()} className="text-sm sm:text-base">
                      <span className="block whitespace-normal sm:whitespace-nowrap text-left">{course.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Turma</label>
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
                disabled={!selectedCourseId || isLoadingCourses}
              >
                <SelectTrigger className="h-11 sm:h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors rounded-lg sm:rounded-xl text-sm sm:text-base">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent className="max-w-[calc(100vw-2rem)]">
                  {filteredClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()} className="text-sm sm:text-base">
                      <span className="block whitespace-normal sm:whitespace-nowrap text-left">
                        {cls.nome} {cls.code ? `(${cls.code})` : ''}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedCourseId && courses.length > 0 && (
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-800">
                Selecione um curso para ver as turmas disponíveis
              </p>
            </div>
          )}

          {selectedCourseId && filteredClasses.length === 0 && (
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs sm:text-sm text-orange-600">
                Nenhuma turma vinculada a este curso
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      {isLoadingClassSummary ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 p-4 sm:p-6">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-purple-600 mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600">Carregando dados da turma...</p>
          </CardContent>
        </Card>
      ) : !selectedClassId ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 p-4 sm:p-6">
            <GraduationCap className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Selecione uma turma
            </h3>
            <p className="text-sm sm:text-base text-gray-600 text-center px-4">
              Escolha um curso e uma turma para visualizar as entregas dos alunos
            </p>
          </CardContent>
        </Card>
      ) : classSummary ? (
        <Card className="border-2 border-gray-200">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="text-base sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                <span className="truncate">Alunos e Entregas</span>
              </CardTitle>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs sm:text-sm flex-shrink-0">
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {classSummary.nome} - {classSummary.code}
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {classSummary.users.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 sm:mb-3 text-gray-300" />
                <p className="text-sm sm:text-base text-gray-600">Nenhum aluno matriculado nesta turma</p>
              </div>
            ) : (
              <Accordion type="multiple" className="space-y-3 sm:space-y-4">
                {classSummary.users.map((user) => (
                  <AccordionItem key={user.id} value={user.id.toString()} className="border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4">
                    <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0 pr-2 sm:pr-4">
                        <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1 max-w-full">
                          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                          </div>
                          <div className="text-left min-w-0 flex-1 max-w-full overflow-hidden">
                            <p className="font-semibold text-sm sm:text-base text-gray-900 break-words leading-tight">
                              {user.nome.length > 40 ? (
                                <>
                                  {user.nome.substring(0, 40)}
                                  <wbr />
                                  {user.nome.substring(40)}
                                </>
                              ) : (
                                user.nome
                              )}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 break-all leading-tight mt-0.5">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs flex-1 sm:flex-none justify-center whitespace-nowrap">
                            {(() => {
                              const tasksWithResponse = user.taskUser.filter(task => task.userResponse !== null);
                              const evaluatedTasks = tasksWithResponse.filter(task => task.feedback !== undefined && task.feedback !== null);
                              const pendingTasks = tasksWithResponse.filter(task => task.feedback === undefined || task.feedback === null);
                              return isMobile 
                                ? `${evaluatedTasks.length} aval. • ${pendingTasks.length} pend.`
                                : `${evaluatedTasks.length} avaliadas • ${pendingTasks.length} pendentes`;
                            })()}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                      {renderStudentTasks(user)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-2 border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 p-4 sm:p-6">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar dados
            </h3>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-3 sm:mb-4 px-4">{error}</p>
            <Button
              onClick={loadClassSummary}
              className="bg-red-600 hover:bg-red-700 h-10 sm:h-11 text-sm sm:text-base"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : null}
      
      <QuickActions />
    </div>
  );
}
