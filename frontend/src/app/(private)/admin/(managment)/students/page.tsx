"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {Search, Plus, Edit, Trash2, Users, GraduationCap, Filter, X, RefreshCcw, Rotate3d, Eye, Copy, Mail, Calendar, User, FileText} from "lucide-react"
import React, {useEffect, useState} from "react"
import {StudentFormModal} from "@/components/admin/students/StudentFormModal";
import {UserData} from "@/lib/interfaces/userInterfaces";
import { EditStudentModal } from "@/components/admin/students/EditStudentModal";
import { StudentClassesModal } from "@/components/admin/students/StudentClassesModal";
import UserListService from "@/lib/api/user/userListService";
import ClassList from "@/lib/api/class/classList";
import { Class } from "@/lib/interfaces/classInterfaces";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {EditStudentSituationModal} from "@/components/admin/students/EditStudentSituationModal";
import QuickActions from "@/components/admin/quickActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner"

export default function StudentsManagement() {
    const [students, setStudents] = useState<UserData[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isEditSituationModalOpen, setIsEditSituationModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    // const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedClassFilter, setSelectedClassFilter] = useState<Class | null>(null)
    const [availableClasses, setAvailableClasses] = useState<Class[]>([])
    const [isLoadingClasses, setIsLoadingClasses] = useState(false)
    const [showOnlyWithoutClass, setShowOnlyWithoutClass] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isClassesModalOpen, setIsClassesModalOpen] = useState(false)
    const [selectedStudentForClasses, setSelectedStudentForClasses] = useState<UserData | null>(null)

    useEffect(() => {
        const init = async () => {
            await loadClasses();
            await getStudents();
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getStudents();
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

    const getStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            // Se o filtro "Sem turma" estiver ativo, não envia filtro de turma para a API
            // Isso traz todos os alunos e filtra no frontend
            const classIdFilter = showOnlyWithoutClass ? null : (selectedClassFilter?.id || null);
            console.log('[getStudents] Fetching with classId:', classIdFilter);
            console.log('[getStudents] showOnlyWithoutClass:', showOnlyWithoutClass);
            const studentsData = await UserListService(null, 3, null, classIdFilter);
            console.log('[getStudents] Response:', studentsData);

            const mappedStudents = studentsData.data?.map((cls: any) => ({
                id: cls.id,
                nome: cls.nome,
                email: cls.email,
                role: cls.role,
                institutionName: cls.institutionName,
                cpf: cls.cpf,
                status: cls.status,
                classes: cls.classes || [],
            })) || [];

            console.log(mappedStudents)
            setStudents(mappedStudents);
        } catch (err) {
            console.error("Error fetching classes:", err);
            const message =
                err instanceof Error
                    ? err.message
                    : "Erro desconhecido ao buscar turmas.";
            setError(message);

            setStudents([]);
        } finally {
            setLoading(false);
        }
    };


    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            (student.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.cpf || "").includes(searchTerm)

        const matchesStatus = statusFilter === null || student.status === statusFilter

        // Filtro de "Sem turma" - verifica se o aluno não tem turmas vinculadas
        const matchesClassFilter = !showOnlyWithoutClass || (student.classes?.length === 0)

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
        
        // Desativa o filtro "Sem turma" quando seleciona uma turma específica
        if (classId !== "all" && classId !== "no-class") {
            setShowOnlyWithoutClass(false);
        }
        
        if (classId === "all") {
            console.log('[ClassFilter] Clearing filter');
            setSelectedClassFilter(null);
            setShowOnlyWithoutClass(false);
        } else if (classId === "no-class") {
            console.log('[ClassFilter] Showing only students without class');
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
        await getStudents();
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
        await getStudents();
    }

    const handleEdit = (student: UserData) => {
        setSelectedUser(student)
        setIsEditModalOpen(true)
    }

    const handleStudentSituationEdit = (student: UserData) => {
        setSelectedUser(student)
        setIsEditSituationModalOpen(true)
    }

    const handleViewDetails = (student: UserData) => {
        setSelectedUser(student)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetails = () => {
        setSelectedUser(null)
        setIsDetailModalOpen(false)
    }

    const handleViewClasses = (student: UserData) => {
        setSelectedStudentForClasses(student)
        setIsClassesModalOpen(true)
    }

    const handleCloseClasses = () => {
        setSelectedStudentForClasses(null)
        setIsClassesModalOpen(false)
    }

    const handleEditSuccess = async () => {
        await getStudents()
        setIsEditModalOpen(false)
        setSelectedUser(null) // Limpa o usuário selecionado
    }
    
    const handleEditSituationSuccess = async () => {
        await getStudents()
        setIsEditSituationModalOpen(false)
        setSelectedUser(null) // Limpa o usuário selecionado
    }
    
    const handleEditModalClose = () => {
        setIsEditModalOpen(false)
        setSelectedUser(null) // Limpa o usuário selecionado ao cancelar
    }
    
    const handleEditSituationModalClose = () => {
        setIsEditSituationModalOpen(false)
        setSelectedUser(null) // Limpa o usuário selecionado ao cancelar
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciamento de Alunos</h1>
                        <p className="text-sm text-gray-600 hidden sm:block mt-1">Universidade de Tecnologia - Sistema de Gestão</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="flex items-center gap-2 bg-blue-100 text-blue-700 border-blue-300 px-3 py-1.5">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline font-semibold">{students.length} Alunos Cadastrados</span>
                            <span className="sm:hidden font-semibold">{students.length}</span>
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="md:px-2 lg:px-8 pb-8 space-y-6 max-w-[95%] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Total de Alunos</CardTitle>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{students.length}</div>
                            <p className="text-xs text-gray-600 mt-1">
                                Cadastrados no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Alunos Ativos</CardTitle>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{students.filter((s) => s.status === "ATIVO").length}</div>
                            <p className="text-xs text-gray-600 mt-1">
                                Status ativo no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Alunos Inativos</CardTitle>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <Users className="h-5 w-5 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">{students.filter((s) => s.status === "INATIVO").length}</div>
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
                                    <CardTitle className="text-xl font-bold text-gray-900">Lista de Alunos</CardTitle>
                                    <CardDescription className="text-gray-600 mt-1">Gerencie os alunos cadastrados no sistema</CardDescription>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <Button onClick={getStudents} className="flex items-center justify-center gap-2 h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                                        <RefreshCcw className="h-4 w-4" />
                                        <span className="hidden sm:inline">Recarregar Alunos</span>
                                        <span className="sm:hidden">Recarregar</span>
                                    </Button>
                                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Novo Aluno
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
                                    <div className="text-lg font-medium">Carregando Alunos...</div>
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
                  <TableHead>Aluno</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Tipo</TableHead>
                                                <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                                            {filteredStudents.map((student) => {
                                            // const studentClass = getClassById(student.classId)
                                                return (
                                                    <TableRow key={student?.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                                                                        {student.nome
                                                                            ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                                                                    <p className="font-medium">{student?.nome}</p>
                                                                    <p className="text-sm text-muted-foreground">ID: {student?.id}</p>
                        </div>
                      </div>
                    </TableCell>
                                                        <TableCell>{student?.email}</TableCell>
                                                        <TableCell>{formatCPF(student?.cpf)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClasses(student)}
                        className="flex items-center gap-2 h-8"
                      >
                        <GraduationCap className="h-4 w-4" />
                        <Badge variant="secondary">
                          {student?.classes?.length || 0}
                        </Badge>
                      </Button>
                    </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${
                                                                student?.role.name === "STUDENT" 
                                                                    ? "bg-blue-100 text-blue-700 border border-blue-300" 
                                                                    : "bg-gray-100 text-gray-700 border border-gray-300"
                                                            } font-semibold`}>
                                                                {student?.role.name === "STUDENT" ? "Aluno" : student?.role.name}
                                                            </Badge>
                                                        </TableCell>
                    <TableCell>
                                                            <Badge className={`${
                                                                student?.status === "ATIVO" 
                                                                    ? "bg-green-100 text-green-700 border border-green-300" 
                                                                    : "bg-red-100 text-red-700 border border-red-300"
                                                            } font-semibold`}>
                                                                {student?.status === "ATIVO" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => handleViewDetails(student)}
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
                                                                                onClick={() => handleEdit(student)}
                                                                                className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg transition-colors">
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Editar Dados do Aluno</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button size="sm" 
                                                                            onClick={() => handleStudentSituationEdit(student)}
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
                                    {filteredStudents.map((student) => (
                                        <Card key={student?.id} className="overflow-hidden">
                                            <CardContent>
                                                <div className="flex items-start gap-3 mb-3">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback>
                                                            {student.nome
                                                                ?.split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-base truncate">{student?.nome}</p>
                                                        <p className="text-sm text-muted-foreground">ID: {student?.id}</p>
                                                        <Badge className={`mt-1 ${
                                                            student?.role.name === "STUDENT" 
                                                                ? "bg-blue-100 text-blue-700 border border-blue-300" 
                                                                : "bg-gray-100 text-gray-700 border border-gray-300"
                                                        } font-semibold`}>
                                                            {student?.role.name === "STUDENT" ? "Aluno" : student?.role.name}
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
                                                                    navigator.clipboard.writeText(student?.email || '');
                                                                    toast.success('Email copiado para a área de transferência');
                                                                }}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                            <span className="text-sm whitespace-nowrap">{student?.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">CPF:</span>
                                                        <span className="text-sm">{formatCPF(student?.cpf)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">Status:</span>
                                                        <Badge className={`text-xs font-semibold ${
                                                            student?.status === "ATIVO" 
                                                                ? "bg-green-100 text-green-700 border border-green-300" 
                                                                : "bg-red-100 text-red-700 border border-red-300"
                                                        }`}>
                                                            {student?.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">Turmas:</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewClasses(student)}
                                                            className="h-7 px-2 flex items-center gap-2"
                                                        >
                                                            <GraduationCap className="h-4 w-4" />
                                                            <Badge variant="secondary" className="text-xs">
                                                                {student?.classes?.length || 0}
                                                            </Badge>
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-3 border-t">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleViewDetails(student)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-semibold rounded-lg transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleEdit(student)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-semibold rounded-lg transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleStudentSituationEdit(student)}
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

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                                            {statusFilter || selectedClassFilter || searchTerm
                                                ? "Nenhum aluno encontrado com os filtros aplicados."
                                                : "Nenhum aluno cadastrado no sistema."}
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

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />

            <EditStudentModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                onSuccess={handleEditSuccess}
                user={selectedUser}
            />

            <EditStudentSituationModal
                isOpen={isEditSituationModalOpen}
                onClose={handleEditSituationModalClose}
                onSuccess={handleEditSituationSuccess}
                user={selectedUser}
            />

            <StudentClassesModal
                isOpen={isClassesModalOpen}
                onClose={handleCloseClasses}
                student={selectedStudentForClasses}
            />

            {/* Modal de Detalhes do Aluno */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="relative">
                        <DialogHeader className="pb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-blue-600 rounded-xl">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">
                                        Detalhes do Aluno
                                    </DialogTitle>
                                    <p className="text-sm text-gray-600 mt-1">Informações completas do aluno</p>
                                </div>
                            </div>
                        </DialogHeader>
                        
                        {selectedUser && (
                            <div className="space-y-6">
                                {/* Informações Pessoais */}
                                <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">
                                        {selectedUser.nome
                                            ?.split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.nome}</h3>
                                    <p className="text-sm text-gray-600">ID: {selectedUser.id}</p>
                                    <Badge className="mt-2">
                                        {selectedUser.role.name === "STUDENT" ? "Aluno" : selectedUser.role.name}
                                    </Badge>
                                </div>
                            </div>

                                {/* Informações de Contato */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="border-2 border-gray-200 rounded-xl">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-blue-600" />
                                                Informações de Contato
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                                                <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CPF</label>
                                                <p className="text-sm font-medium text-gray-900">{formatCPF(selectedUser.cpf)}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-2 border-gray-200 rounded-xl">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                                Informações do Sistema
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                                                <Badge variant={selectedUser.status === "ATIVO" ? "default" : "destructive"} className="bg-blue-600 hover:bg-blue-700">
                                                    {selectedUser.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Instituição</label>
                                                <p className="text-sm font-medium text-gray-900">{selectedUser.institutionName || 'N/A'}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Informações Acadêmicas */}
                                <Card className="border-2 border-gray-200 rounded-xl">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4 text-blue-600" />
                                            Informações Acadêmicas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                                <div className="text-2xl font-bold text-blue-600">0</div>
                                                <div className="text-xs text-blue-600 font-medium">Cursos Matriculados</div>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-xl">
                                                <div className="text-2xl font-bold text-green-600">0</div>
                                                <div className="text-xs text-green-600 font-medium">Trilhas Concluídas</div>
                                            </div>
                                            <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-xl">
                                                <div className="text-2xl font-bold text-purple-600">0</div>
                                                <div className="text-xs text-purple-600 font-medium">Materiais Estudados</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Ações */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-gray-100 mt-6">
                                    <Button 
                                        className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl" 
                                        variant="outline"
                                        onClick={() => setIsDetailModalOpen(false)}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Fechar
                                    </Button>
                                    <Button 
                                        className="flex-1 h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors rounded-xl" 
                                        variant="outline"
                                        onClick={() => {
                                            setIsDetailModalOpen(false);
                                            handleEdit(selectedUser);
                                        }}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>
                                    <Button 
                                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                        onClick={() => {
                                            setIsDetailModalOpen(false);
                                            handleStudentSituationEdit(selectedUser);
                                        }}
                                    >
                                        <Rotate3d className="h-4 w-4 mr-2" />
                                        Alterar Situação
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
    </div>
    )
}
