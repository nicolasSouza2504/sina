"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Users,
    GraduationCap,
    AlertCircle,
    Code,
    Database,
    Monitor,
    Loader2,
    BookOpen,
    RefreshCcw,
    Trophy,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import QuickActions from "@/components/admin/quickActions";
import { Class } from "@/lib/interfaces/classInterfaces";
import { CourseContentSummary } from "@/lib/interfaces/courseContentInterfaces";
import { UserData } from "@/lib/interfaces/userInterfaces";
import { RankedKnowledgeTrail } from "@/lib/interfaces/rankedKnowledgeTrailInterfaces";
import ClassList from "@/lib/api/class/classList";
import CourseContentSummaryService from "@/lib/api/course/courseContentSummary";
import UserListService from "@/lib/api/user/userListService";
import GetRankedKnowledgeTrailsService from "@/lib/api/class/getRankedKnowledgeTrails";
import { toast } from "sonner";
import RankedActivitiesModal from "@/components/admin/RankedActivitiesModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MobileScrollButtons } from "@/components/ui/mobile-scroll-buttons";
import { GetDashboardAdmGeneralInfoService } from "@/lib/api/dashboard";
import { DashboardAdmGeneralInfo } from "@/lib/interfaces/dashboardInterfaces";



export default function DashboardAdmin() {

    // Estados para dados do dashboard
    const [dashboardData, setDashboardData] = useState<DashboardAdmGeneralInfo | null>(null);
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

    // Estados para integração com API
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);
    const [selectedClassData, setSelectedClassData] = useState<Class | null>(null);
    const [selectedCourseData, setSelectedCourseData] = useState<CourseContentSummary | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
    const [isLoadingCourseContent, setIsLoadingCourseContent] = useState(false);

    // Estados para atividades ranqueadas
    const [rankedTrails, setRankedTrails] = useState<RankedKnowledgeTrail[]>([]);
    const [isLoadingRankedTrails, setIsLoadingRankedTrails] = useState(false);
    const [selectedRankedTrail, setSelectedRankedTrail] = useState<RankedKnowledgeTrail | null>(null);
    const [isRankedModalOpen, setIsRankedModalOpen] = useState(false);

    // Estados para professores
    const [teachers, setTeachers] = useState<UserData[]>([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    // Refs para os containers de scroll
    const rankedTrailsRef = useRef<HTMLDivElement>(null);
    const teachersRef = useRef<HTMLDivElement>(null);

    // Carrega turmas, professores e dados do dashboard ao montar o componente
    useEffect(() => {
        loadClasses();
        loadTeachers();
        loadDashboardData();
    }, []);

    // Função para carregar dados do dashboard
    const loadDashboardData = async () => {
        setIsLoadingDashboard(true);
        try {
            const data = await GetDashboardAdmGeneralInfoService();
            setDashboardData(data);
            console.log('[DashboardAdmin] Dados carregados:', data);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            toast.error('Erro ao carregar estatísticas gerais');
        } finally {
            setIsLoadingDashboard(false);
        }
    };

    // Atualiza dados da turma e carrega conteúdo do curso
    useEffect(() => {
        if (selectedClassId && selectedClassId !== "all") {
            const classData = classes.find(c => c.id.toString() === selectedClassId);
            setSelectedClassData(classData || null);

            if (classData?.courseId) {
                // Guarda o courseId da turma selecionada
                setSelectedCourseId(classData.courseId);
                loadCourseContent(classData.courseId);
                // Recarrega professores filtrados pela turma
                loadTeachers(Number(selectedClassId));
                // Carrega atividades ranqueadas
                loadRankedTrails(Number(selectedClassId));
            } else {
                setSelectedCourseData(null);
                setSelectedCourseId(null);
                setRankedTrails([]);
            }
        } else {
            setSelectedClassData(null);
            setSelectedCourseData(null);
            setSelectedCourseId(null);
            setRankedTrails([]);
            // Recarrega todos os professores quando "Todas as turmas" está selecionado
            loadTeachers();
        }
    }, [selectedClassId, classes]);

    const loadClasses = async () => {
        setIsLoadingClasses(true);
        try {
            const classesData = await ClassList();
            setClasses(classesData);
        } catch (error) {
            console.error('Erro ao carregar turmas:', error);
            toast.error('Erro ao carregar turmas');
        } finally {
            setIsLoadingClasses(false);
        }
    };

    const loadCourseContent = async (courseId: number) => {
        setIsLoadingCourseContent(true);
        try {
            const courseContent = await CourseContentSummaryService(courseId);
            setSelectedCourseData(courseContent);
        } catch (error) {
            console.error('Erro ao carregar conteúdo do curso:', error);
            toast.error('Erro ao carregar conteúdo do curso');
            setSelectedCourseData(null);
        } finally {
            setIsLoadingCourseContent(false);
        }
    };

    const loadTeachers = async (classId?: number) => {
        setIsLoadingTeachers(true);
        try {
            const response = await UserListService(
                null, // nameFilter
                2,    // roleFilter (2 = professor)
                null, // courseIdFilter
                classId || null // classIdFilter
            );
            setTeachers(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar professores:', error);
            toast.error('Erro ao carregar professores');
            setTeachers([]);
        } finally {
            setIsLoadingTeachers(false);
        }
    };

    const loadRankedTrails = async (classId: number) => {
        setIsLoadingRankedTrails(true);
        try {
            const trails = await GetRankedKnowledgeTrailsService(classId);
            setRankedTrails(trails);
        } catch (error) {
            console.error('Erro ao carregar atividades ranqueadas:', error);
            // Não mostra toast de erro se não houver atividades ranqueadas
            const errorMessage = error instanceof Error ? error.message : '';
            if (!errorMessage.includes('Não encontradas')) {
                toast.error('Erro ao carregar atividades ranqueadas');
            }
            setRankedTrails([]);
        } finally {
            setIsLoadingRankedTrails(false);
        }
    };

    const handleOpenSemesterModal = (semester: number) => {
        setSelectedSemester(semester);
        setIsModalOpen(true);
    };

    const handleOpenRankedModal = (trail: RankedKnowledgeTrail) => {
        setSelectedRankedTrail(trail);
        setIsRankedModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Cabeçalho */}
            <header className="border-b bg-white">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Universidade Tecnológica - Admin
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Gestão de Tecnologia e Ciência da Computação
                        </p>
                    </div>
                    <Avatar>
                        <AvatarImage src="/admin-avatar.png" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Alunos Ativos
                            </CardTitle>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                {isLoadingDashboard ? (
                                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                                ) : (
                                    <Users className="h-5 w-5 text-blue-600" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {isLoadingDashboard ? (
                                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                                ) : (
                                    dashboardData?.totalActiveUsers.toLocaleString('pt-BR') || '0'
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-green-600 font-semibold">Ativos</span> na plataforma
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Cursos</CardTitle>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                {isLoadingDashboard ? (
                                    <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
                                ) : (
                                    <Code className="h-5 w-5 text-purple-600" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {isLoadingDashboard ? (
                                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                                ) : (
                                    dashboardData?.totalCourses || '0'
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-blue-600 font-semibold">Cursos</span> cadastrados
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Professores
                            </CardTitle>
                            <div className="p-2 bg-green-50 rounded-lg">
                                {isLoadingDashboard ? (
                                    <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
                                ) : (
                                    <GraduationCap className="h-5 w-5 text-green-600" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {isLoadingDashboard ? (
                                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                                ) : (
                                    dashboardData?.totalTeachers || '0'
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-green-600 font-semibold">Docentes</span> ativos
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Total de Tarefas</CardTitle>
                            <div className="p-2 bg-amber-50 rounded-lg">
                                {isLoadingDashboard ? (
                                    <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
                                ) : (
                                    <Monitor className="h-5 w-5 text-amber-600" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {isLoadingDashboard ? (
                                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                                ) : (
                                    dashboardData?.totalTasks || '0'
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-gray-600 font-semibold">Todas</span> as tarefas
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Tarefas Ranqueadas</CardTitle>
                            <div className="p-2 bg-orange-50 rounded-lg">
                                {isLoadingDashboard ? (
                                    <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
                                ) : (
                                    <Trophy className="h-5 w-5 text-orange-600" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {isLoadingDashboard ? (
                                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                                ) : (
                                    dashboardData?.totalRankedTasks || '0'
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-orange-600 font-semibold">Com pontuação</span> ativa
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Seção de Filtros */}
                <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                            <span className="truncate">Selecionar Turma</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-gray-700">Turma</label>
                                <Select
                                    value={selectedClassId}
                                    onValueChange={setSelectedClassId}
                                    disabled={isLoadingClasses}
                                >
                                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 rounded-xl text-sm sm:text-base">
                                        <SelectValue placeholder={isLoadingClasses ? "Carregando turmas..." : "Selecione uma turma"} />
                                    </SelectTrigger>
                                    <SelectContent className="max-w-[calc(100vw-2rem)]">
                                        <SelectItem value="all" className="text-sm sm:text-base">
                                            <span className="block whitespace-normal sm:whitespace-nowrap text-left font-semibold">
                                                Todas as turmas
                                            </span>
                                        </SelectItem>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id.toString()} className="text-sm sm:text-base">
                                                <span className="block whitespace-normal sm:whitespace-nowrap text-left">
                                                    {cls.nome} {cls.code ? `(${cls.code})` : ''}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                onClick={loadClasses}
                                variant="outline"
                                className="h-12 sm:mt-7 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
                            >
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Atualizar
                            </Button>
                        </div>

                        {(!selectedClassId || selectedClassId === "all") && classes.length > 0 && (
                            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs sm:text-sm text-blue-800">
                                    Selecione uma turma para visualizar os semestres do curso ou "Todas as turmas" para ver todos os professores
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Atividades Ranqueadas e Professores */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <Database className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                                        Atividades Ranqueadas
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm text-gray-600">
                                        Trilhas de conhecimento com atividades ranqueadas da turma
                                    </CardDescription>
                                </div>
                                <Link href="/professor/conteudo">
                                    <Button
                                        size="sm"
                                        className="w-full sm:w-auto h-9 sm:h-8 px-3 sm:px-4 bg-yellow-600 hover:bg-yellow-700 text-white text-xs sm:text-sm transition-colors flex items-center justify-center"
                                    >
                                        <span className="hidden sm:inline">Gerenciamento de Conteúdo</span>
                                        <span className="sm:hidden">Conteúdo</span>
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoadingRankedTrails ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : rankedTrails.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                    <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm text-gray-600">
                                        {selectedClassId && selectedClassId !== "all"
                                            ? "Nenhuma atividade ranqueada encontrada para esta turma"
                                            : "Selecione uma turma para visualizar as atividades ranqueadas"}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div 
                                        ref={rankedTrailsRef}
                                        className={`${rankedTrails.length > 5 ? 'max-h-[400px] overflow-y-auto' : ''} space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400`}
                                    >
                                        {rankedTrails.map((trail) => (
                                        <div
                                            key={trail.id}
                                            onClick={() => handleOpenRankedModal(trail)}
                                            className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border-2 border-yellow-200 hover:border-yellow-400 rounded-lg transition-all group cursor-pointer"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors truncate">
                                                    {trail.name}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {trail.tasks.length} {trail.tasks.length === 1 ? 'atividade' : 'atividades'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                                    Ranqueada
                                                </Badge>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                    <MobileScrollButtons 
                                        containerRef={rankedTrailsRef}
                                        itemCount={rankedTrails.length}
                                        threshold={5}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                        Professores de Tecnologia
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm text-gray-600">
                                        Especializações do corpo docente e carga de cursos
                                    </CardDescription>
                                </div>
                                <Link href="/admin/teachers">
                                    <Button
                                        size="sm"
                                        className="w-full sm:w-auto h-9 sm:h-8 px-3 sm:px-4 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm transition-colors flex items-center justify-center"
                                    >
                                        <span className="hidden sm:inline">Gerenciar Professores</span>
                                        <span className="sm:hidden">Professores</span>
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoadingTeachers ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : teachers.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                    <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm text-gray-600">Nenhum professor encontrado</p>
                                </div>
                            ) : (
                                <>
                                    <div 
                                        ref={teachersRef}
                                        className={`${teachers.length > 5 ? 'max-h-[400px] overflow-y-auto' : ''} space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400`}
                                    >
                                        {teachers.map((professor) => (
                                        <div
                                            key={professor.id}
                                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-all group"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                    <AvatarFallback className="text-xs font-semibold bg-green-100 text-green-700">
                                                        {professor.nome
                                                            ?.split(" ")
                                                            .map((n: string) => n[0])
                                                            .join("") || "PR"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                                                        {professor.nome}
                                                    </p>
                                                    <p className="text-xs text-gray-600 truncate">
                                                        {professor.email || 'Email não informado'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ID: {professor.id}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {professor.role?.id === 2 ? 'Professor' : 'Usuário'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                    <MobileScrollButtons 
                                        containerRef={teachersRef}
                                        itemCount={teachers.length}
                                        threshold={5}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Semestres do Curso */}
                {selectedCourseData ? (
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                        Dados do Curso
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm text-gray-600">
                                        Estrutura e organização do curso selecionado
                                    </CardDescription>
                                </div>
                                <Link href="/professor/cursos">
                                    <Button
                                        size="sm"
                                        className="w-full sm:w-auto h-9 sm:h-8 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm transition-colors flex items-center justify-center"
                                    >
                                        <span className="hidden sm:inline">Gerenciar Cursos</span>
                                        <span className="sm:hidden">Cursos</span>
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                {Array.from({ length: selectedCourseData.quantitySemester || 0 }, (_, index) => index + 1).map((semester) => (
                                    <Button
                                        key={semester}
                                        onClick={() => handleOpenSemesterModal(semester)}
                                        className="h-24 sm:h-28 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 text-blue-900 hover:text-blue-950 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                                    >
                                        <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                        <div className="text-center">
                                            <p className="text-xs sm:text-sm font-semibold">Semestre</p>
                                            <p className="text-lg sm:text-2xl font-bold">{semester}</p>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 p-4 sm:p-6">
                            <BookOpen className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mb-3 sm:mb-4" />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                {selectedClassId === "all" ? "Todas as turmas selecionadas" : "Selecione uma turma"}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 text-center px-4">
                                {selectedClassId === "all"
                                    ? "Para visualizar os semestres, selecione uma turma específica"
                                    : "Escolha uma turma para visualizar os semestres do curso"
                                }
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Modal de Atividades Ranqueadas */}
                <RankedActivitiesModal
                    open={isRankedModalOpen}
                    onOpenChange={setIsRankedModalOpen}
                    trail={selectedRankedTrail}
                />

                {/* Modal de Trilhas do Semestre */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                Trilhas de Conhecimento - Semestre {selectedSemester}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            {selectedCourseData?.sections
                                ?.filter(section => section.semester === selectedSemester)
                                .map((section) => (
                                    <div key={section.id} className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {section.name}
                                        </h3>
                                        {section.knowledgeTrails && section.knowledgeTrails.length > 0 ? (
                                            <div className="space-y-2">
                                                {section.knowledgeTrails.map((trail) => (
                                                    <div
                                                        key={trail.id}
                                                        className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-blue-600 rounded-lg">
                                                                    <BookOpen className="h-4 w-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">{trail.name}</p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {trail.tasks?.length || 0} tarefas
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                                                                Trilha {trail.id}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                                                <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                                <p className="text-sm text-gray-600">Nenhuma trilha cadastrada nesta seção</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            {(!selectedCourseData?.sections ||
                                selectedCourseData.sections.filter(s => s.semester === selectedSemester).length === 0) && (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-base text-gray-600">Nenhuma seção cadastrada para este semestre</p>
                                    </div>
                                )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Ações Rápidas */}
                <div className="mt-8">
                    <QuickActions />
                </div>
            </main>
        </div>
    );
}