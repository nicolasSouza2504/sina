"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {Search, Plus, Edit, Trash2, Users, GraduationCap, Filter, X, RefreshCcw, Rotate3d, Eye, Copy} from "lucide-react"
import React, {useEffect, useState} from "react"
import {TeacherFormModal} from "@/components/admin/teachers/TeacherFormModal";
import {UserData} from "@/lib/interfaces/userInterfaces";
import { EditTeacherModal } from "@/components/admin/teachers/EditTeacherModal";
import { TeacherClassesModal } from "@/components/admin/teachers/TeacherClassesModal";
import { TeacherDetailsModal } from "@/components/admin/teachers/TeacherDetailsModal";
import UserListService from "@/lib/api/user/userListService";
import ClassList from "@/lib/api/class/classList";
import { Class } from "@/lib/interfaces/classInterfaces";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {EditTeacherSituationModal} from "@/components/admin/teachers/EditTeacherSituationModal";
import QuickActions from "@/components/admin/quickActions";
import { toast } from "sonner"

export default function TeachersManagement() {
    const [teachers, setTeachers] = useState<UserData[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isEditSituationModalOpen, setIsEditSituationModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedClassFilter, setSelectedClassFilter] = useState<Class | null>(null)
    const [availableClasses, setAvailableClasses] = useState<Class[]>([])
    const [isLoadingClasses, setIsLoadingClasses] = useState(false)
    const [showOnlyWithoutClass, setShowOnlyWithoutClass] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isClassesModalOpen, setIsClassesModalOpen] = useState(false)
    const [selectedTeacherForClasses, setSelectedTeacherForClasses] = useState<UserData | null>(null)

    useEffect(() => {
        const init = async () => {
            await loadClasses();
            await getTeachers();
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getTeachers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClassFilter, showOnlyWithoutClass]);

    const loadClasses = async () => {
        try {
            setIsLoadingClasses(true);
            const classes = await ClassList();
            setAvailableClasses(classes);
        } catch (err) {
            console.error("Error loading classes:", err);
            toast.error("Erro ao carregar turmas");
        } finally {
            setIsLoadingClasses(false);
        }
    };

    const getTeachers = async () => {
        try {
            setLoading(true);
            setError(null);
            // Role 2 = TEACHER
            const classIdFilter = showOnlyWithoutClass ? null : (selectedClassFilter?.id || null);
            console.log('[getTeachers] Fetching with classId:', classIdFilter);
            console.log('[getTeachers] showOnlyWithoutClass:', showOnlyWithoutClass);
            const teachersData = await UserListService(null, 2, null, classIdFilter);
            console.log('[getTeachers] Response:', teachersData);

            const mappedTeachers = teachersData.data?.map((cls: any) => ({
                id: cls.id,
                nome: cls.nome,
                email: cls.email,
                role: cls.role,
                institutionName: cls.institutionName,
                cpf: cls.cpf,
                status: cls.status,
                classes: cls.classes || [],
            })) || [];

            console.log(mappedTeachers)
            setTeachers(mappedTeachers);
        } catch (err) {
            console.error("Error fetching teachers:", err);
            const message =
                err instanceof Error
                    ? err.message
                    : "Erro desconhecido ao buscar professores.";
            setError(message);

            setTeachers([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch =
            (teacher.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (teacher.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (teacher.cpf || "").includes(searchTerm)

        const matchesStatus = statusFilter === null || teacher.status === statusFilter

        const matchesClassFilter = !showOnlyWithoutClass || (teacher.classes?.length === 0)

        return matchesSearch && matchesStatus && matchesClassFilter;
    })

    const getSelectedClassName = () => {
        if (showOnlyWithoutClass) {
            return "Sem turma"
        }
        return selectedClassFilter?.nome || null
    }

    const clearClassFilter = () => {
        setSelectedClassFilter(null)
        setShowOnlyWithoutClass(false)
    }

    const handleClassFilterChange = (classId: string) => {
        console.log('[ClassFilter] Selected classId:', classId);
        
        if (classId !== "all" && classId !== "no-class") {
            setShowOnlyWithoutClass(false);
        }
        
        if (classId === "all") {
            console.log('[ClassFilter] Clearing filter');
            setSelectedClassFilter(null);
            setShowOnlyWithoutClass(false);
        } else if (classId === "no-class") {
            console.log('[ClassFilter] Showing only teachers without class');
            setSelectedClassFilter(null);
            setShowOnlyWithoutClass(true);
        } else {
            const selectedClass = availableClasses.find(c => c.id === parseInt(classId));
            console.log('[ClassFilter] Selected class:', selectedClass);
            setSelectedClassFilter(selectedClass || null);
            setShowOnlyWithoutClass(false);
        }
    }

    const getStatusFilterLabel = () => {
        return statusFilter === "ATIVO" ? "Ativos" : statusFilter === "INATIVO" ? "Inativos" : null
    }

    const clearStatusFilter = () => {
        setStatusFilter(null)
    }

    const handleSubmit = async () => {
        await getTeachers();
        setIsModalOpen(false)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR")
    }

    const formatCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }

    const closeError = () => {
        setError(null);
    };

    const handleSuccess = async () => {
        await getTeachers();
    }

    const handleEdit = (teacher: UserData) => {
        setSelectedUser(teacher)
        setIsEditModalOpen(true)
    }

    const handleTeacherSituationEdit = (teacher: UserData) => {
        setSelectedUser(teacher)
        setIsEditSituationModalOpen(true)
    }

    const handleViewDetails = (teacher: UserData) => {
        setSelectedUser(teacher)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetails = () => {
        setSelectedUser(null)
        setIsDetailModalOpen(false)
    }

    const handleViewClasses = (teacher: UserData) => {
        setSelectedTeacherForClasses(teacher)
        setIsClassesModalOpen(true)
    }

    const handleCloseClasses = () => {
        setSelectedTeacherForClasses(null)
        setIsClassesModalOpen(false)
    }

    const handleEditSuccess = async () => {
        await getTeachers()
        setIsEditModalOpen(false)
        setSelectedUser(null)
    }
    
    const handleEditSituationSuccess = async () => {
        await getTeachers()
        setIsEditSituationModalOpen(false)
        setSelectedUser(null)
    }
    
    const handleEditModalClose = () => {
        setIsEditModalOpen(false)
        setSelectedUser(null)
    }
    
    const handleEditSituationModalClose = () => {
        setIsEditSituationModalOpen(false)
        setSelectedUser(null)
    }

    return (
        <div className="min-h-screen bg-background w-full">
            {error && (
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 w-11/12 md:w-1/2 lg:w-1/3">
                    <Alert
                        variant="destructive"
                        className="relative pr-12 backdrop-blur-2xl text-md py-5 gap-1"
                    >
                        <AlertTitle className="font-bold text-1xl">Erro</AlertTitle>
                        <AlertDescription className="text-md ">{error}</AlertDescription>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={closeError}
                            className="absolute  top-2 right-2 h-6 w-6 p-0 hover:bg-destructive-foreground/10 hover:cursor-pointer"
                        >
                            <X className="size-5 hover:cursor-pointer"/>
                        </Button>
                    </Alert>
                </div>
            )}

            <header className="border-b bg-white mb-8">
                <div className="flex flex-col sm:flex-row h-auto sm:h-20 items-start sm:items-center justify-between px-4 md:px-2 lg:px-8 max-w-[95%] mx-auto w-full py-4 sm:py-0 gap-4 sm:gap-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciamento de Professores</h1>
                        <p className="text-sm text-gray-600 hidden sm:block mt-1">Universidade de Tecnologia - Sistema de Gestão</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="flex items-center gap-2 bg-blue-100 text-blue-700 border-blue-300 px-3 py-1.5">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline font-semibold">{teachers.length} Professores Cadastrados</span>
                            <span className="sm:hidden font-semibold">{teachers.length}</span>
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="md:px-2 lg:px-8 pb-8 space-y-6 max-w-[95%] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Total de Professores</CardTitle>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{teachers.length}</div>
                            <p className="text-xs text-gray-600 mt-1">
                                Cadastrados no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Professores Ativos</CardTitle>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{teachers.filter((s) => s.status === "ATIVO").length}</div>
                            <p className="text-xs text-gray-600 mt-1">
                                Status ativo no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Professores Inativos</CardTitle>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <Users className="h-5 w-5 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">{teachers.filter((s) => s.status === "INATIVO").length}</div>
                            <p className="text-xs text-gray-600 mt-1">
                                Status inativo no sistema
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-2 border-gray-200 rounded-xl">
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">Lista de Professores</CardTitle>
                                    <CardDescription className="text-gray-600 mt-1">Gerencie os professores cadastrados no sistema</CardDescription>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <Button onClick={getTeachers} className="flex items-center justify-center gap-2 h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                                        <RefreshCcw className="h-4 w-4" />
                                        <span className="hidden sm:inline">Recarregar Professores</span>
                                        <span className="sm:hidden">Recarregar</span>
                                    </Button>
                                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Novo Professor
                                    </Button>
                                </div>
                            </div>

                            {(selectedClassFilter !== null || showOnlyWithoutClass || statusFilter !== null) && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                                    {(selectedClassFilter !== null || showOnlyWithoutClass) && (
                                        <Badge variant="default" className="flex items-center gap-2 max-w-full sm:max-w-[240px] overflow-hidden">
                                            <span className="truncate text-sm">
                                                {(() => {
                                                    const label = getSelectedClassName() ?? "";
                                                    return label.length > 25 ? `${label.substring(0, 25)}...` : label;
                                                })()}
                                            </span>
                                            <button
                                                onClick={clearClassFilter}
                                                className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 flex-shrink-0"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                    {statusFilter !== null && (
                                        <Badge variant="secondary" className="flex items-center gap-2">
                                            {getStatusFilterLabel()}
                                            <button
                                                onClick={clearStatusFilter}
                                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <div className="relative flex-1 min-w-0">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar por nome, email ou CPF..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                                    {/* Class Filter Select */}
                                    <div className="w-full sm:w-[220px] flex-shrink-0">
                                        <Select
                                            value={
                                                showOnlyWithoutClass 
                                                    ? "no-class" 
                                                    : selectedClassFilter?.id.toString() || "all"
                                            }
                                            onValueChange={handleClassFilterChange}
                                            disabled={isLoadingClasses}
                                        >
                                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl overflow-hidden">
                                                <span className="text-sm truncate block w-full">
                                                    {showOnlyWithoutClass 
                                                        ? "Sem turma"
                                                        : selectedClassFilter 
                                                            ? (() => {
                                                                const fullText = selectedClassFilter?.code
                                                                    ? `${selectedClassFilter.code} - ${selectedClassFilter.nome}`
                                                                    : selectedClassFilter.nome;
                                                                return fullText.length > 25 ? `${fullText.substring(0, 25)}...` : fullText;
                                                              })()
                                                            : "Filtrar por turma"
                                                    }
                                                </span>
                                            </SelectTrigger>
                                        <SelectContent className="w-[calc(100vw-2rem)] sm:w-[280px] max-h-[300px]">
                                            <SelectItem value="all" className="truncate">
                                                Todas as turmas
                                            </SelectItem>
                                            <SelectItem value="no-class" className="truncate">
                                                Sem turma
                                            </SelectItem>
                                            {availableClasses.map((cls) => (
                                                <SelectItem
                                                    key={cls.id}
                                                    value={cls.id.toString()}
                                                    className="truncate max-w-[calc(100vw-4rem)] sm:max-w-none sm:overflow-visible"
                                                >
                                                    <span className="block truncate sm:overflow-visible sm:whitespace-normal sm:[text-overflow:clip]">
                                                        {cls.code ? `${cls.code} - ${cls.nome}` : cls.nome}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    </div>

                                    {/* Status Filters */}
                                    <Button
                                        onClick={() => setStatusFilter(statusFilter === "ATIVO" ? null : "ATIVO")}
                                        className={`flex items-center gap-2 h-12 font-semibold rounded-xl transition-all w-full sm:w-auto ${
                                            statusFilter === "ATIVO"
                                                ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                                                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50"
                                        }`}
                                    >
                                        <Filter className="h-4 w-4" />
                                        Ativos
                                    </Button>
                                    <Button
                                        onClick={() => setStatusFilter(statusFilter === "INATIVO" ? null : "INATIVO")}
                                        className={`flex items-center gap-2 h-12 font-semibold rounded-xl transition-all w-full sm:w-auto ${
                                            statusFilter === "INATIVO"
                                                ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                                                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50"
                                        }`}
                                    >
                                        <Filter className="h-4 w-4" />
                                        Inativos
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="text-lg font-medium">Carregando Professores...</div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        Por favor, aguarde
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View - Hidden on Mobile */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Professor</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>CPF</TableHead>
                                                <TableHead>Turmas</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTeachers.map((teacher) => {
                                                return (
                                                    <TableRow key={teacher?.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarFallback>
                                                                        {teacher.nome
                                                                            ?.split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")
                                                                            .substring(0, 2)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium">{teacher?.nome}</p>
                                                                    <p className="text-sm text-muted-foreground">ID: {teacher?.id}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{teacher?.email}</TableCell>
                                                        <TableCell>{formatCPF(teacher?.cpf)}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewClasses(teacher)}
                                                                className="flex items-center gap-2 h-8"
                                                            >
                                                                <GraduationCap className="h-4 w-4" />
                                                                <Badge variant="secondary">
                                                                    {teacher?.classes?.length || 0}
                                                                </Badge>
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${
                                                                teacher?.role.name === "TEACHER" 
                                                                    ? "bg-purple-100 text-purple-700 border border-purple-300" 
                                                                    : "bg-gray-100 text-gray-700 border border-gray-300"
                                                            } font-semibold`}>
                                                                {teacher?.role.name === "TEACHER" ? "Professor" : teacher?.role.name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${
                                                                teacher?.status === "ATIVO" 
                                                                    ? "bg-green-100 text-green-700 border border-green-300" 
                                                                    : "bg-red-100 text-red-700 border border-red-300"
                                                            } font-semibold`}>
                                                                {teacher?.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => handleViewDetails(teacher)}
                                                                                className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg transition-colors">
                                                                                <Eye className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Ver Detalhes</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => handleEdit(teacher)}
                                                                                className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg transition-colors">
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Editar Dados do Professor</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button size="sm" 
                                                                            onClick={() => handleTeacherSituationEdit(teacher)}
                                                                            className="h-9 w-9 p-0 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded-lg transition-colors">
                                                                                <Rotate3d className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Alterar Situação</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View - Hidden on Desktop */}
                                <div className="md:hidden space-y-4">
                                    {filteredTeachers.map((teacher) => (
                                        <Card key={teacher?.id} className="overflow-hidden">
                                            <CardContent>
                                                <div className="flex items-start gap-3 mb-3">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback>
                                                            {teacher.nome
                                                                ?.split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-base truncate">{teacher?.nome}</p>
                                                        <p className="text-sm text-muted-foreground">ID: {teacher?.id}</p>
                                                        <Badge className={`mt-1 ${
                                                            teacher?.role.name === "TEACHER" 
                                                                ? "bg-purple-100 text-purple-700 border border-purple-300" 
                                                                : "bg-gray-100 text-gray-700 border border-gray-300"
                                                        } font-semibold`}>
                                                            {teacher?.role.name === "TEACHER" ? "Professor" : teacher?.role.name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">Email:</span>
                                                        <div className="flex-1 flex items-center gap-2 overflow-x-auto">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-6 w-6 p-0 flex-shrink-0"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(teacher?.email || '');
                                                                    toast.success('Email copiado para a área de transferência');
                                                                }}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                            <span className="text-sm whitespace-nowrap">{teacher?.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">CPF:</span>
                                                        <span className="text-sm">{formatCPF(teacher?.cpf)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">Status:</span>
                                                        <Badge className={`text-xs font-semibold ${
                                                            teacher?.status === "ATIVO" 
                                                                ? "bg-green-100 text-green-700 border border-green-300" 
                                                                : "bg-red-100 text-red-700 border border-red-300"
                                                        }`}>
                                                            {teacher?.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">Turmas:</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewClasses(teacher)}
                                                            className="h-7 px-2 flex items-center gap-2"
                                                        >
                                                            <GraduationCap className="h-4 w-4" />
                                                            <Badge variant="secondary" className="text-xs">
                                                                {teacher?.classes?.length || 0}
                                                            </Badge>
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-3 border-t">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleViewDetails(teacher)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-semibold rounded-lg transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleEdit(teacher)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-semibold rounded-lg transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleTeacherSituationEdit(teacher)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 font-semibold rounded-lg transition-colors"
                                                    >
                                                        <Rotate3d className="h-4 w-4" />
                                                        Situação
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {filteredTeachers.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">
                                            {statusFilter || selectedClassFilter || searchTerm
                                                ? "Nenhum professor encontrado com os filtros aplicados."
                                                : "Nenhum professor cadastrado no sistema."}
                                        </p>
                                        {(statusFilter || selectedClassFilter || searchTerm) && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Tente remover alguns filtros ou alterar os critérios de busca.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {<QuickActions></QuickActions>}
            </main>

            <TeacherFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />

            <EditTeacherModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                onSuccess={handleEditSuccess}
                user={selectedUser}
            />

            <EditTeacherSituationModal
                isOpen={isEditSituationModalOpen}
                onClose={handleEditSituationModalClose}
                onSuccess={handleEditSituationSuccess}
                user={selectedUser}
            />

            <TeacherClassesModal
                isOpen={isClassesModalOpen}
                onClose={handleCloseClasses}
                teacher={selectedTeacherForClasses}
            />

            <TeacherDetailsModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetails}
                teacher={selectedUser}
                onEdit={handleEdit}
                onChangeSituation={handleTeacherSituationEdit}
            />
        </div>
    )
}
