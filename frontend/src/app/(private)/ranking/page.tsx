"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import getUserFromToken from "@/lib/auth/userToken";
import {
  Trophy,
  Target,
  Search,
  Filter,
  Crown,
  Star,
  AlertCircle
} from 'lucide-react';
import { UserData } from '@/lib/interfaces/userInterfaces';
import GetUserByIdService from '@/lib/api/user/getUserById';
import ClassList from '@/lib/api/class/classList';
import CourseListService from '@/lib/api/course/courseList';
import GetRankedKnowledgeTrailsByClassService, { KnowledgeTrailResponse } from '@/lib/api/knowledgetrail/getRankedKnowledgeTrailsByClass';
import GetRankingByClassService from '@/lib/api/ranking/getRankingByClass';
import { RankingResponseDTO, StudentRankingDTO } from '@/lib/interfaces/rankingInterfaces';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import QuickActions from '@/components/admin/quickActions';
import QuickActionsAluno from '@/components/admin/quickActionsAluno';

export default function RankingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

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
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de controle dos selects
  const [isClassDisabled, setIsClassDisabled] = useState(true);
  const [isTrailDisabled, setIsTrailDisabled] = useState(true);

  // Estado para dados do ranking
  const [rankingData, setRankingData] = useState<RankingResponseDTO[]>([]);
  const [currentRanking, setCurrentRanking] = useState<RankingResponseDTO | null>(null);

  useEffect(() => {
    setUserData();
  }, []);

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

  const loadKnowledgeTrails = async (classId: number) => {
    try {
      setIsLoadingTrails(true);
      console.log('[Ranking] Buscando trilhas ranqueadas para turma:', classId);
      const trailsData = await GetRankedKnowledgeTrailsByClassService(classId);
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
      setUserRole(user.role.name);
    } else {
      // Professor e Aluno: busca dados do próprio usuário
      console.log('[Ranking] Carregando dados para Professor/Aluno');
      try {
        const userData = await GetUserByIdService(user?.id!);
        console.log("[Ranking] User data from API:", userData);
        setUser(userData);
        setUserRole(userData.role.name);

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

    // Carrega trilhas ranqueadas da turma selecionada
    console.log('[Ranking] Carregando trilhas ranqueadas da turma:', classId);
    loadKnowledgeTrails(parseInt(classId));

    console.log('[Ranking] Estados após seleção de turma:', {
      selectedCourseId,
      selectedClassId: classId,
      isTrailDisabled: false
    });
  };

  const handleTrailChange = async (trailId: string) => {
    console.log('[Ranking] handleTrailChange - Trilha selecionada:', trailId);
    setSelectedTrailId(trailId);

    // Carrega os dados do ranking quando todos os filtros estão selecionados
    if (selectedClassId && trailId) {
      await loadRankingData(parseInt(selectedClassId), [parseInt(trailId)]);
    }
  };

  const loadRankingData = async (classId: number, knowledgeTrailIds: number[]) => {
    try {
      setIsLoadingRanking(true);
      setError(null);

      console.log('[Ranking] Carregando dados do ranking:', { classId, knowledgeTrailIds });
      const data = await GetRankingByClassService(classId, knowledgeTrailIds);

      setRankingData(data);

      // Define o ranking atual (primeiro item da lista)
      if (data.length > 0) {
        setCurrentRanking(data[0]);
        console.log('[Ranking] Ranking carregado:', data[0]);
      } else {
        setCurrentRanking(null);
        toast.info('Nenhum dado de ranking encontrado para os filtros selecionados');
      }

    } catch (err) {
      console.error('[Ranking] Erro ao carregar dados do ranking:', err);
      setError('Erro ao carregar dados do ranking');
      setRankingData([]);
      setCurrentRanking(null);
    } finally {
      setIsLoadingRanking(false);
    }
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

  // Filtrar estudantes (só funciona quando há dados de ranking)
  const filteredStudents = currentRanking ? currentRanking.studentsRanking.filter((student: StudentRankingDTO) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) : [];

  // Estatísticas gerais (calculadas dos dados reais do ranking)
  const stats = currentRanking ? {
    totalStudents: currentRanking.studentsRanking.length,
    averageCompletion: Math.round(
      currentRanking.studentsRanking.reduce((acc: number, s: StudentRankingDTO) => acc + (s.conclusionPercent || 0), 0) / currentRanking.studentsRanking.length
    ),
    topPerformer: currentRanking.studentsRanking[0]?.name || 'N/A',
    averageGrade: (() => {
      const studentsWithGrades = currentRanking.studentsRanking.filter((s: StudentRankingDTO) => s.mediumGrade !== null);
      if (studentsWithGrades.length === 0) return 0;
      const sum = studentsWithGrades.reduce((acc: number, s: StudentRankingDTO) => acc + (s.mediumGrade || 0), 0);
      return Math.round((sum / studentsWithGrades.length) * 10) / 10;
    })()
  } : {
    totalStudents: 0,
    averageCompletion: 0,
    topPerformer: 'N/A',
    averageGrade: 0
  };

  // Obter cor da taxa de conclusão
  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Obter cor da nota média
  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-gray-500';
    if (grade >= 8) return 'text-green-600';
    if (grade >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Obter background baseado na posição
  const getRankBackground = (place: number) => {
    if (place === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300';
    if (place === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300';
    if (place === 3) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300';
    return 'bg-white border-2 border-gray-200 hover:border-gray-300';
  };

  // Obter ícone da posição
  const getRankIcon = (place: number) => {
    if (place === 1) return <div className="text-xl md:text-2xl">🥇</div>;
    if (place === 2) return <div className="text-xl md:text-2xl">🥈</div>;
    if (place === 3) return <div className="text-xl md:text-2xl">🥉</div>;
    return (
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs md:text-sm font-bold">
        {place}
      </div>
    );
  };

  // Formatar data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
            <Trophy className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
            <span className="hidden sm:inline">Ranking de Atividades EAD</span>
            <span className="sm:hidden">Ranking EAD</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Acompanhe o desempenho dos alunos
          </p>
        </div>

        {/* Estatísticas Gerais */}
        {!selectedFilters ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
              <Filter className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2 text-center">
                Selecione os Filtros
              </h3>
              <p className="text-xs md:text-sm text-gray-500 text-center max-w-md px-4">
                Escolha um curso, turma e trilha de conhecimento para visualizar as estatísticas do ranking
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Total de Alunos</CardTitle>
                <Trophy className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Participando
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Taxa Média</CardTitle>
                <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{stats.averageCompletion}%</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Conclusão
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Melhor</CardTitle>
                <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-sm md:text-2xl font-bold truncate">{stats.topPerformer}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Líder
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Nota Média</CardTitle>
                <Star className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{stats.averageGrade.toFixed(1)}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Geral
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Filter className="h-4 w-4 md:h-5 md:w-5" />
              Filtros do Ranking
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Selecione curso, turma e trilha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Select de Curso */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-700">
                  Curso {user?.role.name !== 'ADMIN' && <span className="text-red-500">*</span>}
                </label>
                <Select value={selectedCourseId} onValueChange={handleCourseChange} disabled={isLoadingCourses}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 rounded-xl text-sm sm:text-base">
                    {isLoadingCourses ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                        <span className="text-xs md:text-sm">Carregando...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecione um curso" />
                    )}
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

              {/* Select de Turma */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-700">
                  Turma {user?.role.name !== 'ADMIN' && <span className="text-red-500">*</span>}
                </label>
                <Select
                  value={selectedClassId}
                  onValueChange={handleClassChange}
                  disabled={isClassDisabled || isLoadingClasses}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 rounded-xl text-sm sm:text-base">
                    {isLoadingClasses ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                        <span className="text-xs md:text-sm">Carregando...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder={isClassDisabled ? "Selecione um curso primeiro" : "Selecione uma turma"} />
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-w-[calc(100vw-2rem)]">
                    {user?.role.name === 'ADMIN' ? (
                      // Admin: mostra todas as turmas
                      classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id.toString()} className="text-sm sm:text-base">
                          <span className="block whitespace-normal sm:whitespace-nowrap text-left">
                            {classItem.nome} ({classItem.code})
                          </span>
                        </SelectItem>
                      ))
                    ) : (
                      // Professor/Aluno: mostra apenas turmas filtradas pelo curso (se houver seleção)
                      classes
                        .filter(classItem =>
                          !selectedCourseId || classItem.course?.id.toString() === selectedCourseId
                        )
                        .map((classItem) => (
                          <SelectItem key={classItem.id} value={classItem.id.toString()} className="text-sm sm:text-base">
                            <span className="block whitespace-normal sm:whitespace-nowrap text-left">
                              {classItem.nome} ({classItem.code})
                            </span>
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Select de Trilha de Conhecimento */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-700">
                  Trilha de Conhecimento <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedTrailId}
                  onValueChange={handleTrailChange}
                  disabled={isTrailDisabled || isLoadingTrails}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 rounded-xl text-sm sm:text-base">
                    {isLoadingTrails ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                        <span className="text-xs md:text-sm">Carregando...</span>
                      </div>
                    ) : isTrailDisabled ? (
                      <SelectValue placeholder="Selecione uma turma primeiro" />
                    ) : (
                      <SelectValue placeholder="Selecione uma trilha" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-w-[calc(100vw-2rem)]">
                    {knowledgeTrails.map((trail) => (
                      <SelectItem key={trail.id} value={trail.id.toString()} className="text-sm sm:text-base">
                        <span className="block whitespace-normal sm:whitespace-nowrap text-left">{trail.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Informações de Seleção */}
            {selectedCourseId && selectedClassId && selectedTrailId && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-start gap-2 md:gap-3">
                  <Filter className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-semibold text-blue-900 mb-2">
                      Filtros Aplicados:
                    </p>
                    <div className="space-y-1.5 md:space-y-2">
                      {/* Curso */}
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] md:text-xs font-medium text-blue-700 flex-shrink-0 mt-0.5">
                          Curso:
                        </span>
                        <span className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-blue-100 text-blue-800 break-words">
                          {courses.find(c => c.id.toString() === selectedCourseId)?.name}
                        </span>
                      </div>

                      {/* Turma */}
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] md:text-xs font-medium text-green-700 flex-shrink-0 mt-0.5">
                          Turma:
                        </span>
                        <span className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-green-100 text-green-800 break-words">
                          {classes.find(c => c.id.toString() === selectedClassId)?.nome}
                        </span>
                      </div>

                      {/* Trilha */}
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] md:text-xs font-medium text-purple-700 flex-shrink-0 mt-0.5">
                          Trilha:
                        </span>
                        <span className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-purple-100 text-purple-800 break-words">
                          {knowledgeTrails.find(t => t.id.toString() === selectedTrailId)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Busca */}
        {selectedTrailId && (
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!selectedTrailId}
                  className="pl-9 md:pl-10 h-10 md:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-sm md:text-base"
                />
                {!selectedTrailId && (
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">Selecione uma trilha para habilitar a busca</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ranking Completo */}
        {!selectedTrailId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
              <Trophy className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2 text-center">
                Nenhuma Trilha Selecionada
              </h3>
              <p className="text-xs md:text-sm text-gray-500 text-center max-w-md px-4">
                Selecione uma trilha de conhecimento nos filtros acima para visualizar o ranking dos alunos
              </p>
            </CardContent>
          </Card>
        ) : isLoadingRanking ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
              <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin text-blue-600 mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2 text-center">
                Carregando Ranking
              </h3>
              <p className="text-xs md:text-sm text-gray-500 text-center max-w-md px-4">
                Buscando dados do ranking para os filtros selecionados...
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
              <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-red-500 mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-red-700 mb-2 text-center">
                Erro ao Carregar Ranking
              </h3>
              <p className="text-xs md:text-sm text-red-600 text-center max-w-md mb-4 px-4">
                {error}
              </p>
              <Button
                onClick={() => {
                  if (selectedClassId && selectedTrailId) {
                    loadRankingData(parseInt(selectedClassId), [parseInt(selectedTrailId)]);
                  }
                }}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 text-sm md:text-base h-9 md:h-10"
              >
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        ) : !currentRanking ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
              <Trophy className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2 text-center">
                Nenhum Dado Encontrado
              </h3>
              <p className="text-xs md:text-sm text-gray-500 text-center max-w-md px-4">
                Não há dados de ranking disponíveis para a trilha selecionada
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Ranking - {currentRanking.name}</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                {filteredStudents.length} aluno(s) encontrado(s)
                {selectedFilters && (
                  <span className="ml-2 text-blue-600">
                    • {selectedFilters.className}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                {filteredStudents.map((student: StudentRankingDTO) => (
                  <div
                    key={student.place}
                    className={`flex items-center gap-2 md:gap-4 p-2 md:p-4 rounded-lg border-2 transition-all ${getRankBackground(student.place)}`}
                  >
                    {/* Posição/Medalha */}
                    <div className="flex items-center justify-center min-w-[35px] md:min-w-[50px]">
                      {getRankIcon(student.place)}
                    </div>

                    {/* Avatar - Oculto em mobile */}
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm md:text-base font-bold shadow-md">
                      {student.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>

                    {/* Informações do Aluno */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                        <p className="font-bold text-sm md:text-lg text-gray-900 truncate">
                          {student.name}
                        </p>
                        {student.pointsEarned > 0 && (
                          <Badge variant="outline" className="hidden sm:inline-flex bg-green-50 text-green-700 border-green-200 text-[10px] md:text-xs">
                            ⭐ {student.pointsEarned} pts
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] md:text-sm text-gray-600">
                        {student.tasksSent}/{student.totalTasks} atividades
                      </p>
                    </div>

                    {/* Estatísticas Desktop */}
                    <div className="hidden lg:flex items-center gap-6">
                      {/* Taxa de Conclusão */}
                      <div className="flex flex-col items-center">
                        <Badge
                          variant="outline"
                          className={`text-sm font-bold border-2 ${getCompletionColor(student.conclusionPercent)} mb-1`}
                        >
                          {Math.round(student.conclusionPercent)}%
                        </Badge>
                        <span className="text-xs text-gray-500">Conclusão</span>
                      </div>

                      {/* Nota Média */}
                      <div className="flex flex-col items-center">
                        <div className={`text-lg font-bold mb-1 ${getGradeColor(student.mediumGrade)}`}>
                          {student.mediumGrade?.toFixed(1) || '-'}
                        </div>
                        <span className="text-xs text-gray-500">Nota Média</span>
                      </div>

                      {/* Pontos */}
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-bold text-blue-600 mb-1">
                          {student.pointsEarned}
                        </div>
                        <span className="text-xs text-gray-500">Pontos</span>
                      </div>
                    </div>

                    {/* Estatísticas Mobile/Tablet */}
                    <div className="lg:hidden flex flex-col items-end gap-0.5 md:gap-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] md:text-xs font-semibold ${getCompletionColor(student.conclusionPercent)}`}
                      >
                        {Math.round(student.conclusionPercent)}%
                      </Badge>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] md:text-xs text-gray-600 font-medium">
                          {student.mediumGrade?.toFixed(1) || '-'}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-400">•</span>
                        <span className="text-[10px] md:text-xs text-blue-600 font-semibold">
                          {student.pointsEarned} pts
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 md:py-12 text-gray-500">
                    <Trophy className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-base md:text-lg font-medium">Nenhum aluno encontrado</p>
                    <p className="text-xs md:text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-green-100 border-2 border-green-200 flex-shrink-0"></div>
                <span className="truncate">≥ 80% - Excelente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-yellow-100 border-2 border-yellow-200 flex-shrink-0"></div>
                <span className="truncate">60-79% - Bom</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-100 border-2 border-red-200 flex-shrink-0"></div>
                <span className="truncate">&lt; 60% - Melhorar</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {userRole === 'STUDENT' ? (
          <QuickActionsAluno />
        ) : (
          <QuickActions />
        )}
      </div>
    </div>
  );
}

