"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Search, Plus, Edit, Trash2, Users, GraduationCap, Filter, X, RefreshCcw, Rotate3d, Eye, Mail, Calendar, User, FileText} from "lucide-react"
import React, {useEffect, useState} from "react"
import {StudentFormModal} from "@/components/admin/students/StudentFormModal";
import {UserData} from "@/lib/interfaces/userInterfaces";
import { EditStudentModal } from "@/components/admin/students/EditStudentModal";
import UserListService from "@/lib/api/user/userListService";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {EditStudentSituationModal} from "@/components/admin/students/EditStudentSituationModal";
import QuickActions from "@/components/admin/quickActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
    const [selectedClassFilter, setSelectedClassFilter] = useState<{
        id: number
        code: string | null
        name: string
        startDate: string | null
        endDate: string | null
        semester: number | null
        courseId: number |null
        imgClass: string | null
    } | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    useEffect(() => {
        getStudents();
    }, []);

    const getStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const studentsData = await UserListService(null, 3);

            const mappedStudents = studentsData.data?.map((cls: any) => ({
                id: cls.id,
                nome: cls.nome,
                email: cls.email,
                role: cls.role,
                institutionName: cls.institutionName,
                cpf: cls.cpf,
                status: cls.status,
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

        // const matchesClass = selectedClassFilter === null || student.classId === selectedClassFilter.id
        return matchesSearch && matchesStatus;
        // return matchesSearch && matchesClass
    })

    const getSelectedClassName = () => {
        return selectedClassFilter?.name || null
    }

    const clearClassFilter = () => {
        setSelectedClassFilter(null)
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
        <div className="min-h-screen bg-background">
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

            <header className="border-b bg-card mb-6">
                <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 max-w-[95%] mx-auto w-full">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Gerenciamento de Alunos</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Universidade de Tecnologia - Sistema de Gestão</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">{students.length} Alunos Cadastrados</span>
                            <span className="sm:hidden">{students.length}</span>
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="md:px-6 lg:px-8 pb-8 space-y-6 max-w-[95%] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{students.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Cadastrados no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                            <GraduationCap className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{students.filter((s) => s.status === "ATIVO").length}</div>
                            <p className="text-xs text-muted-foreground">
                                Status ativo no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Alunos Inativos</CardTitle>
                            <Users className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{students.filter((s) => s.status === "INATIVO").length}</div>
                            <p className="text-xs text-muted-foreground">
                                Status inativo no sistema
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <CardTitle>Lista de Alunos</CardTitle>
                                    <CardDescription>Gerencie os alunos cadastrados no sistema</CardDescription>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                    <Button onClick={getStudents} className="flex items-center justify-center gap-2 bg-gray-500 w-full sm:w-auto">
                                        <RefreshCcw className="h-4 w-4" />
                                        <span className="hidden sm:inline">Recarregar Alunos</span>
                                        <span className="sm:hidden">Recarregar</span>
                                    </Button>
                                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Novo Aluno
                                    </Button>
                                </div>
                            </div>

                            {(selectedClassFilter !== null || statusFilter !== null) && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                                    {selectedClassFilter !== null && (
                                        <Badge variant="default" className="flex items-center gap-2">
                                            {getSelectedClassName()}
                                            <button
                                                onClick={clearClassFilter}
                                                className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
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

                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nome, email ou CPF..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={statusFilter === "ATIVO" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter(statusFilter === "ATIVO" ? null : "ATIVO")}
                                        className="flex items-center gap-2"
                                    >
                                        <Filter className="h-4 w-4" />
                                        Ativos
                                    </Button>
                                    <Button
                                        variant={statusFilter === "INATIVO" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter(statusFilter === "INATIVO" ? null : "INATIVO")}
                                        className="flex items-center gap-2"
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
                                            {/*<TableHead>Turma</TableHead>*/}
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
                                                    {/*<TableCell>*/}
                                                    {/*    <div className="flex items-center gap-2">*/}
                                                    {/*        <Avatar className="h-6 w-6">*/}
                                                    {/*            <AvatarImage src={studentClass?.imgClass || "/placeholder.svg"} />*/}
                                                    {/*            <AvatarFallback>{studentClass?.nome.substring(0, 2).toUpperCase()}</AvatarFallback>*/}
                                                    {/*        </Avatar>*/}
                                                    {/*        <span className="text-sm">{studentClass?.nome || "Sem turma"}</span>*/}
                                                    {/*    </div>*/}
                                                    {/*</TableCell>*/}
                                                        <TableCell>
                                                            <Badge variant={student?.role.name === "STUDENT" ? "default" : "secondary"}>
                                                                {student?.role.name === "STUDENT" ? "Aluno" : student?.role.name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={student?.status === "ATIVO" ? "default" : "destructive"}>
                                                                {student?.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleViewDetails(student)}>
                                                                                <Eye className="size-6" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Ver Detalhes</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleEdit(student)}>
                                                                                <Edit className="size-6" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Editar Dados do Aluno</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="sm" className="text-blue-600"
                                                                            onClick={() => handleStudentSituationEdit(student)}>
                                                                                <Rotate3d className="size-6" />
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
                                            <CardContent className="p-4">
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
                                                        <Badge variant={student?.role.name === "STUDENT" ? "default" : "secondary"} className="mt-1">
                                                            {student?.role.name === "STUDENT" ? "Aluno" : student?.role.name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">Email:</span>
                                                        <div className="flex-1 overflow-x-auto">
                                                            <span className="text-sm whitespace-nowrap">{student?.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">CPF:</span>
                                                        <span className="text-sm">{formatCPF(student?.cpf)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">Status:</span>
                                                        <Badge variant={student?.status === "ATIVO" ? "default" : "destructive"} className="text-xs">
                                                            {student?.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-3 border-t">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(student)}
                                                        className="flex-1 flex items-center justify-center gap-2"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(student)}
                                                        className="flex-1 flex items-center justify-center gap-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStudentSituationEdit(student)}
                                                        className="flex-1 flex items-center justify-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
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

            {/* Modal de Detalhes do Aluno */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Detalhes do Aluno
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedUser && (
                        <div className="space-y-6">
                            {/* Informações Pessoais */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
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
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Informações de Contato
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                                            <p className="text-sm font-medium">{selectedUser.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CPF</label>
                                            <p className="text-sm font-medium">{formatCPF(selectedUser.cpf)}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Informações do Sistema
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                                            <Badge variant={selectedUser.status === "ATIVO" ? "default" : "destructive"}>
                                                {selectedUser.status === "ATIVO" ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Instituição</label>
                                            <p className="text-sm font-medium">{selectedUser.institutionName || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Informações Acadêmicas */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        Informações Acadêmicas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">0</div>
                                            <div className="text-xs text-blue-600">Cursos Matriculados</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">0</div>
                                            <div className="text-xs text-green-600">Trilhas Concluídas</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">0</div>
                                            <div className="text-xs text-purple-600">Materiais Estudados</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ações */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button 
                                    className="flex-1" 
                                    variant="outline"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        handleEdit(selectedUser);
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar Aluno
                                </Button>
                                <Button 
                                    className="flex-1" 
                                    variant="outline"
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
                </DialogContent>
            </Dialog>
        </div>
    )
}
