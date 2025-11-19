"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import QuickActionsAluno from '@/components/admin/quickActionsAluno';
import getUserFromToken from "@/lib/auth/userToken";
import {
  Trophy,
  Medal,
  Award,
  Target,
  Search,
  Filter,
  Clock,
  Crown,
  Star
} from 'lucide-react';
import { UserData, UserFromToken } from '@/lib/interfaces/userInterfaces';
import GetUserByIdService from '@/lib/api/user/getUserById';
import ClassList from '@/lib/api/class/classList';
import CourseListService from '@/lib/api/course/courseList';
import GetRankedKnowledgeTrailsByCourseService, { KnowledgeTrailResponse } from '@/lib/api/knowledgetrail/getRankedKnowledgeTrailsByCourse';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface StudentRanking {
  id: number;
  studentName: string;
  studentAvatar: string;
  class: string;
  tasksCompleted: number;
  totalTasks: number;
  completionRate: number;
  lastSubmission: string;
  averageGrade: number;
  streak: number; // dias consecutivos com entregas
}

export default function RankingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [user, setUser] = useState<UserData | null>(null);

  // Estados dos selects
  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [knowledgeTrails, setKnowledgeTrails] = useState<KnowledgeTrailResponse[]>([]);

  // Estados de seleção
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedTrailId, setSelectedTrailId] = useState<string>('');

  // Estados de loading
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingTrails, setIsLoadingTrails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de controle dos selects
  const [isClassDisabled, setIsClassDisabled] = useState(true);
  const [isTrailDisabled, setIsTrailDisabled] = useState(true);


  useEffect(() => {
    setUserData();
  }, []);

  // Mock de dados expandido - em produção viria da API
  const allStudents: StudentRanking[] = [
    {
      id: 1,
      studentName: 'Maria Silva',
      studentAvatar: 'MS',
      class: 'ADS 2º Semestre',
      tasksCompleted: 45,
      totalTasks: 50,
      completionRate: 90,
      lastSubmission: '2h atrás',
      averageGrade: 9.5,
      streak: 15
    },
    {
      id: 2,
      studentName: 'João Santos',
      studentAvatar: 'JS',
      class: 'ADS 3º Semestre',
      tasksCompleted: 42,
      totalTasks: 50,
      completionRate: 84,
      lastSubmission: '5h atrás',
      averageGrade: 8.8,
      streak: 12
    },
    {
      id: 3,
      studentName: 'Ana Costa',
      studentAvatar: 'AC',
      class: 'ADS 2º Semestre',
      tasksCompleted: 40,
      totalTasks: 50,
      completionRate: 80,
      lastSubmission: '1 dia atrás',
      averageGrade: 8.5,
      streak: 10
    },
    {
      id: 4,
      studentName: 'Pedro Oliveira',
      studentAvatar: 'PO',
      class: 'ADS 4º Semestre',
      tasksCompleted: 38,
      totalTasks: 50,
      completionRate: 76,
      lastSubmission: '1 dia atrás',
      averageGrade: 8.2,
      streak: 8
    },
    {
      id: 5,
      studentName: 'Carla Mendes',
      studentAvatar: 'CM',
      class: 'ADS 3º Semestre',
      tasksCompleted: 35,
      totalTasks: 50,
      completionRate: 70,
      lastSubmission: '2 dias atrás',
      averageGrade: 7.8,
      streak: 6
    },
    {
      id: 6,
      studentName: 'Lucas Ferreira',
      studentAvatar: 'LF',
      class: 'ADS 2º Semestre',
      tasksCompleted: 33,
      totalTasks: 50,
      completionRate: 66,
      lastSubmission: '3 dias atrás',
      averageGrade: 7.5,
      streak: 5
    },
    {
      id: 7,
      studentName: 'Julia Rocha',
      studentAvatar: 'JR',
      class: 'ADS 4º Semestre',
      tasksCompleted: 30,
      totalTasks: 50,
      completionRate: 60,
      lastSubmission: '3 dias atrás',
      averageGrade: 7.2,
      streak: 4
    },
    {
      id: 8,
      studentName: 'Rafael Lima',
      studentAvatar: 'RL',
      class: 'ADS 3º Semestre',
      tasksCompleted: 28,
      totalTasks: 50,
      completionRate: 56,
      lastSubmission: '4 dias atrás',
      averageGrade: 6.8,
      streak: 3
    },
    {
      id: 9,
      studentName: 'Beatriz Alves',
      studentAvatar: 'BA',
      class: 'ADS 2º Semestre',
      tasksCompleted: 25,
      totalTasks: 50,
      completionRate: 50,
      lastSubmission: '5 dias atrás',
      averageGrade: 6.5,
      streak: 2
    },
    {
      id: 10,
      studentName: 'Gabriel Souza',
      studentAvatar: 'GS',
      class: 'ADS 4º Semestre',
      tasksCompleted: 22,
      totalTasks: 50,
      completionRate: 44,
      lastSubmission: '1 semana atrás',
      averageGrade: 6.0,
      streak: 1
    }
  ];



  const userDecoded = async () => {
    return await getUserFromToken();
  };

  const loadCourses = async () => {
    setIsLoadingCourses(true);
    setError(null);

    try {
      const coursesData = await CourseListService();
      setCourses(coursesData);
      console.log('[Ranking] Cursos carregados:', coursesData);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
      setError('Erro ao carregar cursos');
      toast.error('Erro ao carregar cursos');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const classesData = await ClassList();
      setClasses(classesData);
      console.log('[Ranking] Turmas carregadas:', classesData);
    } catch (err) {
      console.error("Error loading classes:", err);
      toast.error("Erro ao carregar turmas");
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const loadKnowledgeTrails = async (courseId: number) => {
    try {
      setIsLoadingTrails(true);
      const trailsData = await GetRankedKnowledgeTrailsByCourseService(courseId);
      setKnowledgeTrails(trailsData);
      console.log('[Ranking] Trilhas carregadas:', trailsData);
    } catch (err) {
      console.error('Erro ao carregar trilhas:', err);
      toast.error('Erro ao carregar trilhas de conhecimento');
      setKnowledgeTrails([]);
    } finally {
      setIsLoadingTrails(false);
    }
  };

  const loadUserClasses = async (userData: UserData) => {
    if (userData.classes && userData.classes.length > 0) {
      // Garante que todas as turmas tenham os campos necessários
      const normalizedClasses = userData.classes.map(classItem => ({
        ...classItem,
        id: classItem.Id || classItem.id, // Normaliza para usar 'id' consistentemente
        courseId: classItem.course?.id || classItem.courseId
      }));
      
      setClasses(normalizedClasses);
      console.log('[Ranking] Turmas do usuário carregadas:', normalizedClasses);
    } else {
      console.log('[Ranking] Usuário não possui turmas vinculadas');
      setClasses([]);
    }
  };

  const setUserData = async () => {
    const user = await userDecoded();

    console.log('[Ranking] Usuário do token:', user);
    console.log('[Ranking] Role do usuário:', user?.role?.name);
    
    if (user?.role.name === "ADMIN") {
      // Admin pode ver todos os cursos e turmas
      console.log('[Ranking] Carregando dados para ADMIN');
      await Promise.all([
        loadCourses(),
        loadClasses()
      ]);
      setUser(user);
    } else {
      // Professor e Aluno: busca dados do próprio usuário
      console.log('[Ranking] Carregando dados para Professor/Aluno');
      try {
        const userData = await GetUserByIdService(user?.id!);
        console.log("[Ranking] User data from API:", userData);
        setUser(userData);

        // Extrai cursos únicos das turmas do usuário
        if (userData.classes && userData.classes.length > 0) {
          console.log('[Ranking] Classes encontradas:', userData.classes.length);
          
          const coursesMap = new Map<number, string>();
          userData.classes.forEach(classItem => {
            console.log('[Ranking] Processando classe:', classItem);
            if (classItem.course && classItem.course.id) {
              console.log('[Ranking] Adicionando curso:', classItem.course.id, classItem.course.name);
              coursesMap.set(classItem.course.id, classItem.course.name);
            }
          });
          
          const uniqueCourses = Array.from(coursesMap.entries()).map(([id, name]) => ({
            id,
            name
          }));
          
          setCourses(uniqueCourses);
          console.log('[Ranking] Cursos únicos extraídos:', uniqueCourses);
          
          // Carrega turmas do usuário
          await loadUserClasses(userData);
        } else {
          console.log('[Ranking] Usuário não possui turmas vinculadas');
          toast.info('Você não está vinculado a nenhuma turma');
          setCourses([]);
          setClasses([]);
        }
      } catch (err) {
        console.error("[Ranking] Error loading user data:", err);
        toast.error("Erro ao carregar dados do usuário");
      }
    }
  };

  // Handlers de mudança dos selects
  const handleCourseChange = (courseId: string) => {
    console.log('[Ranking] handleCourseChange - Curso selecionado:', courseId);
    setSelectedCourseId(courseId);
    setSelectedClassId('');
    setSelectedTrailId('');
    setIsClassDisabled(false);
    setIsTrailDisabled(true);
    setKnowledgeTrails([]);
    
    console.log('[Ranking] Estados após seleção de curso:', {
      selectedCourseId: courseId,
      isClassDisabled: false,
      isTrailDisabled: true
    });
  };

  const handleClassChange = (classId: string) => {
    console.log('[Ranking] handleClassChange - Turma selecionada:', classId);
    setSelectedClassId(classId);
    setSelectedTrailId('');
    setIsTrailDisabled(false);
    setKnowledgeTrails([]);
    
    // Carrega trilhas do curso selecionado
    if (selectedCourseId) {
      console.log('[Ranking] Carregando trilhas do curso:', selectedCourseId);
      loadKnowledgeTrails(parseInt(selectedCourseId));
    }
    
    console.log('[Ranking] Estados após seleção de turma:', {
      selectedCourseId,
      selectedClassId: classId,
      isTrailDisabled: false
    });
  };

  const handleTrailChange = (trailId: string) => {
    console.log('[Ranking] handleTrailChange - Trilha selecionada:', trailId);
    setSelectedTrailId(trailId);
    console.log('[Ranking] Trilha selecionada:', trailId);
    
    // Aqui será a próxima integração para carregar os dados do ranking
    // TODO: Implementar carga dos dados do ranking com os filtros selecionados
  };

  useEffect(() => {
    setUserData();
  }, []);

  // Estado para guardar todos os dados dos selects (para próxima integração)
  const [selectedFilters, setSelectedFilters] = useState<{
    courseId: string;
    className: string;
    classId: string;
    trailId: string;
    trailName: string;
  } | null>(null);

  // Atualiza selectedFilters quando todos os selects estão preenchidos
  useEffect(() => {
    if (selectedCourseId && selectedClassId && selectedTrailId) {
      const course = courses.find(c => c.id.toString() === selectedCourseId);
      const classItem = classes.find(c => c.id.toString() === selectedClassId);
      const trail = knowledgeTrails.find(t => t.id.toString() === selectedTrailId);

      if (course && classItem && trail) {
        setSelectedFilters({
          courseId: selectedCourseId,
          className: classItem.nome,
          classId: selectedClassId,
          trailId: selectedTrailId,
          trailName: trail.name
        });

        console.log('[Ranking] Filtros completos selecionados:', {
          course: course.name,
          class: classItem.nome,
          trail: trail.name,
          courseId: selectedCourseId,
          classId: selectedClassId,
          trailId: selectedTrailId
        });
      }
    } else {
      setSelectedFilters(null);
    }
  }, [selectedCourseId, selectedClassId, selectedTrailId, courses, classes, knowledgeTrails]);

  // Filtrar estudantes (só funciona quando trilha está selecionada)
  const filteredStudents = selectedTrailId ? allStudents.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch; // Removido filtro de turma pois agora usa selects específicos
  }) : [];

  // Estatísticas gerais (só calcula quando há filtros selecionados)
  const stats = selectedFilters ? {
    totalStudents: allStudents.length,
    averageCompletion: Math.round(allStudents.reduce((acc, s) => acc + s.completionRate, 0) / allStudents.length),
    topPerformer: allStudents[0]?.studentName || 'N/A',
    averageGrade: (allStudents.reduce((acc, s) => acc + s.averageGrade, 0) / allStudents.length).toFixed(1)
  } : {
    totalStudents: 0,
    averageCompletion: 0,
    topPerformer: 'N/A',
    averageGrade: '0.0'
  };

  // Obter cor da taxa de conclusão
  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Obter cor da nota média
  const getGradeColor = (grade: number) => {
    if (grade >= 8.5) return 'text-green-600';
    if (grade >= 7.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Obter ícone de medalha baseado na posição
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{position}</span>;
    }
  };

  // Obter cor de fundo baseado na posição
  const getRankBackground = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-md';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-sm';
      case 3: return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 shadow-sm';
      default: return 'bg-white border-gray-200 hover:bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Ranking de Atividades EAD
          </h1>
          <p className="text-gray-600 mt-2">
            Acompanhe o desempenho dos alunos nas atividades à distância
          </p>
        </div>

        {/* Estatísticas Gerais */}
        {!selectedFilters ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Filter className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Selecione os Filtros
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Escolha um curso, turma e trilha de conhecimento para visualizar as estatísticas do ranking
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Participando do ranking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa Média de Conclusão</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageCompletion}%</div>
                <p className="text-xs text-muted-foreground">
                  De todas as atividades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Melhor Desempenho</CardTitle>
                <Crown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">{stats.topPerformer}</div>
                <p className="text-xs text-muted-foreground">
                  Líder do ranking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nota Média Geral</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageGrade}</div>
                <p className="text-xs text-muted-foreground">
                  De todas as atividades
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros do Ranking
            </CardTitle>
            <CardDescription>
              Selecione curso, turma e trilha para visualizar o ranking específico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Select de Curso */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Curso {user?.role.name !== 'ADMIN' && <span className="text-red-500">*</span>}
                </label>
                <Select value={selectedCourseId} onValueChange={handleCourseChange} disabled={isLoadingCourses}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    {isLoadingCourses ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Carregando...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecione um curso" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()} className="py-3">
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select de Turma */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Turma {user?.role.name !== 'ADMIN' && <span className="text-red-500">*</span>}
                </label>
                <Select
                  value={selectedClassId}
                  onValueChange={handleClassChange}
                  disabled={isClassDisabled || isLoadingClasses}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    {isLoadingClasses ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Carregando...</span>
                      </div>
                    ) : isClassDisabled ? (
                      <SelectValue placeholder="Selecione um curso primeiro" />
                    ) : (
                      <SelectValue placeholder="Selecione uma turma" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {user?.role.name === 'ADMIN' ? (
                      // Admin: mostra todas as turmas
                      classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id.toString()} className="py-3">
                          {classItem.nome} ({classItem.code})
                        </SelectItem>
                      ))
                    ) : (
                      // Professor/Aluno: mostra apenas turmas filtradas pelo curso (se houver seleção)
                      classes
                        .filter(classItem => 
                          !selectedCourseId || classItem.course?.id.toString() === selectedCourseId
                        )
                        .map((classItem) => (
                          <SelectItem key={classItem.id} value={classItem.id.toString()} className="py-3">
                            {classItem.nome} ({classItem.code})
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Select de Trilha de Conhecimento */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Trilha de Conhecimento <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedTrailId}
                  onValueChange={handleTrailChange}
                  disabled={isTrailDisabled || isLoadingTrails}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    {isLoadingTrails ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Carregando...</span>
                      </div>
                    ) : isTrailDisabled ? (
                      <SelectValue placeholder="Selecione uma turma primeiro" />
                    ) : (
                      <SelectValue placeholder="Selecione uma trilha" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeTrails.map((trail) => (
                      <SelectItem key={trail.id} value={trail.id.toString()} className="py-3">
                        {trail.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Informações de Seleção */}
            {selectedCourseId && selectedClassId && selectedTrailId && (
              <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Filtros Selecionados</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Curso:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {courses.find(c => c.id.toString() === selectedCourseId)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Turma:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {classes.find(c => c.id.toString() === selectedClassId)?.nome}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Trilha:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {knowledgeTrails.find(t => t.id.toString() === selectedTrailId)?.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Barra de Busca e Filtros Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Busca Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome do aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                    disabled={!selectedTrailId}
                  />
                </div>
                {!selectedTrailId && (
                  <p className="text-xs text-gray-500 mt-1">Selecione uma trilha para habilitar a busca</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ranking Completo */}
        {!selectedTrailId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhuma Trilha Selecionada
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Selecione uma trilha de conhecimento nos filtros acima para visualizar o ranking dos alunos
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Ranking Completo</CardTitle>
              <CardDescription>
                {filteredStudents.length} aluno(s) encontrado(s)
                {selectedFilters && (
                  <span className="ml-2 text-blue-600">
                    • {selectedFilters.className} • {selectedFilters.trailName}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${getRankBackground(index + 1)}`}
                  >
                    {/* Posição/Medalha */}
                    <div className="flex items-center justify-center min-w-[50px]">
                      {getRankIcon(index + 1)}
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-md">
                      {student.studentAvatar}
                    </div>

                    {/* Informações do Aluno */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-lg text-gray-900 truncate">
                          {student.studentName}
                        </p>
                        {student.streak >= 7 && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                            🔥 {student.streak} dias
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {student.class}
                      </p>
                    </div>

                    {/* Estatísticas */}
                    <div className="hidden md:flex items-center gap-6">
                      {/* Atividades */}
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            {student.tasksCompleted}/{student.totalTasks}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Atividades</span>
                      </div>

                      {/* Taxa de Conclusão */}
                      <div className="flex flex-col items-center">
                        <Badge
                          variant="outline"
                          className={`text-sm font-bold border-2 ${getCompletionColor(student.completionRate)} mb-1`}
                        >
                          {student.completionRate}%
                        </Badge>
                        <span className="text-xs text-gray-500">Conclusão</span>
                      </div>

                      {/* Nota Média */}
                      <div className="flex flex-col items-center">
                        <div className={`text-lg font-bold mb-1 ${getGradeColor(student.averageGrade)}`}>
                          {student.averageGrade.toFixed(1)}
                        </div>
                        <span className="text-xs text-gray-500">Nota Média</span>
                      </div>

                      {/* Última Entrega */}
                      <div className="flex flex-col items-center min-w-[100px]">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-xs font-medium text-gray-700">
                            {student.lastSubmission}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Última entrega</span>
                      </div>
                    </div>

                    {/* Estatísticas Mobile */}
                    <div className="md:hidden flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold ${getCompletionColor(student.completionRate)}`}
                      >
                        {student.completionRate}%
                      </Badge>
                      <span className="text-xs text-gray-600">
                        {student.tasksCompleted}/{student.totalTasks}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredStudents.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Nenhum aluno encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-200"></div>
                <span>≥ 80% - Excelente desempenho</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-200"></div>
                <span>60-79% - Bom desempenho</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-200"></div>
                <span>&lt; 60% - Precisa melhorar</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActionsAluno />
      </div>
    </div>
  );
}

