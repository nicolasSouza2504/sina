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
import { ClassSummary, ClassSummaryUser, TaskUserWithFeedback } from "@/lib/interfaces/classSummaryInterfaces";
import { Course } from "@/lib/interfaces/courseInterfaces";
import { UserResponseResponse } from "@/lib/interfaces/userResponseInterfaces";
import CourseList from "@/lib/api/course/courseList";
import GetClassSummaryService from "@/lib/api/class/getClassSummary";
import QuickActions from '@/components/admin/quickActions';

export default function AvaliacaoConteudo() {
  const router = useRouter();
  
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
    userResponse: UserResponseResponse,
    student: ClassSummaryUser,
    taskId: number
  ) => {
    // Salva os dados no sessionStorage para a próxima tela
    const evaluationData = {
      userResponse,
      studentName: student.nome,
      taskId
    };
    
    sessionStorage.setItem(`evaluation_${userResponse.id}`, JSON.stringify(evaluationData));
    
    // Salva o estado dos filtros para restaurar ao voltar
    sessionStorage.setItem('avaliacao_filters', JSON.stringify({
      selectedCourseId,
      selectedClassId
    }));
    
    // Redireciona para a tela de avaliação individual
    router.push(`/professor/avaliacao/${userResponse.id}`);
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
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600">O aluno ainda não entregou nenhuma tarefa</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tasksWithResponse.map((task, index) => {
          const hasFeedback = task.userResponse?.feedback !== undefined && task.userResponse?.feedback !== null;
          
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-4 border-2 rounded-xl transition-colors ${
                hasFeedback 
                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                  : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  hasFeedback ? 'bg-green-600' : 'bg-orange-600'
                }`}>
                  {hasFeedback ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <Clock className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${
                    hasFeedback ? 'text-green-900' : 'text-orange-900'
                  }`}>
                    Tarefa #{task.taskId}
                  </p>
                  <p className={`text-sm ${
                    hasFeedback ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    Entregue em {new Date(task.userResponse?.createdAt || '').toLocaleDateString('pt-BR')}
                  </p>
                  {task.userResponse?.comment && (
                    <p className={`text-sm mt-1 ${
                      hasFeedback ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      "{task.userResponse.comment}"
                    </p>
                  )}
                  {hasFeedback && task.userResponse?.feedback && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <Star className="h-3 w-3 mr-1" />
                        Nota: {task.userResponse.feedback.grade.toFixed(1)}
                      </Badge>
                      <span className="text-xs text-green-600">
                        por {task.userResponse.feedback.teacher.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${
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
                  onClick={() => task.userResponse && handleOpenEvaluation(task.userResponse as unknown as UserResponseResponse, student, task.taskId)}
                  className={`h-8 w-8 p-0 ${
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
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-purple-600" />
            Avaliação de Entregas
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize e avalie as tarefas entregues pelos alunos
          </p>
        </div>
        <Button
          onClick={loadCourses}
          variant="outline"
          className="bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
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
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Selecionar Turma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Curso</label>
              <Select
                value={selectedCourseId}
                onValueChange={(value) => {
                  setSelectedCourseId(value);
                  setSelectedClassId('');
                }}
                disabled={isLoadingCourses}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors rounded-xl">
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Turma</label>
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
                disabled={!selectedCourseId || isLoadingCourses}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors rounded-xl">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {filteredClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.nome} {cls.code ? `(${cls.code})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedCourseId && courses.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Selecione um curso para ver as turmas disponíveis
              </p>
            </div>
          )}

          {selectedCourseId && filteredClasses.length === 0 && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-600">
                Nenhuma turma vinculada a este curso
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      {isLoadingClassSummary ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
            <p className="text-gray-600">Carregando dados da turma...</p>
          </CardContent>
        </Card>
      ) : !selectedClassId ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-24 w-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Selecione uma turma
            </h3>
            <p className="text-gray-600 text-center">
              Escolha um curso e uma turma para visualizar as entregas dos alunos
            </p>
          </CardContent>
        </Card>
      ) : classSummary ? (
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Alunos e Entregas
              </CardTitle>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {classSummary.nome} - {classSummary.code}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {classSummary.users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-600">Nenhum aluno matriculado nesta turma</p>
              </div>
            ) : (
              <Accordion type="multiple" className="space-y-4">
                {classSummary.users.map((user) => (
                  <AccordionItem key={user.id} value={user.id.toString()} className="border-2 border-gray-200 rounded-xl px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">{user.nome}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {(() => {
                              const tasksWithResponse = user.taskUser.filter(task => task.userResponse !== null);
                              const evaluatedTasks = tasksWithResponse.filter(task => task.userResponse?.feedback !== undefined && task.userResponse?.feedback !== null);
                              const pendingTasks = tasksWithResponse.filter(task => task.userResponse?.feedback === undefined || task.userResponse?.feedback === null);
                              return `${evaluatedTasks.length} avaliadas • ${pendingTasks.length} pendentes`;
                            })()}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-4">
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
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar dados
            </h3>
            <p className="text-gray-600 text-center mb-4">{error}</p>
            <Button
              onClick={loadClassSummary}
              className="bg-red-600 hover:bg-red-700"
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
