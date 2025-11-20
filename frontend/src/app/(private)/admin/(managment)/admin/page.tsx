"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Search, Plus, Edit, Users, Shield, Filter, X, RefreshCcw, Rotate3d, Eye, Copy, CheckCircle2, XCircle} from "lucide-react"
import React, {useEffect, useState} from "react"
import {AdminFormModal} from "@/components/admin/admin/AdminFormModal";
import {UserData} from "@/lib/interfaces/userInterfaces";
import { EditAdminModal } from "@/components/admin/admin/EditAdminModal";
import { AdminDetailsModal } from "@/components/admin/admin/AdminDetailsModal";
import UserListService from "@/lib/api/user/userListService";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {EditAdminSituationModal} from "@/components/admin/admin/EditAdminSituationModal";
import QuickActions from "@/components/admin/quickActions";
import { toast } from "sonner"

export default function AdminsManagement() {
    const [admins, setAdmins] = useState<UserData[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isEditSituationModalOpen, setIsEditSituationModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    useEffect(() => {
        getAdmins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAdmins = async () => {
        try {
            setLoading(true);
            setError(null);
            // Role 1 = ADMIN
            console.log('[getAdmins] Fetching admins');
            const adminsData = await UserListService(null, 1, null, null);
            console.log('[getAdmins] Response:', adminsData);

            const mappedAdmins = adminsData.data?.map((user: any) => ({
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                institutionName: user.institutionName,
                cpf: user.cpf,
                status: user.status,
            })) || [];

            console.log(mappedAdmins)
            setAdmins(mappedAdmins);
        } catch (err) {
            console.error("Error fetching admins:", err);
            const message =
                err instanceof Error
                    ? err.message
                    : "Erro desconhecido ao buscar administradores.";
            setError(message);

            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAdmins = admins.filter((admin) => {
        const matchesSearch =
            (admin.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (admin.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (admin.cpf || "").includes(searchTerm)

        const matchesStatus = statusFilter === null || admin.status === statusFilter

        return matchesSearch && matchesStatus;
    })

    const getStatusFilterLabel = () => {
        return statusFilter === "ATIVO" ? "Ativos" : statusFilter === "INATIVO" ? "Inativos" : null
    }

    const clearStatusFilter = () => {
        setStatusFilter(null)
    }

    const handleSubmit = async () => {
        await getAdmins();
        setIsModalOpen(false)
    }

    const formatCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }

    const closeError = () => {
        setError(null);
    };

    const handleSuccess = async () => {
        await getAdmins();
    }

    const handleEdit = (admin: UserData) => {
        setSelectedUser(admin)
        setIsEditModalOpen(true)
    }

    const handleAdminSituationEdit = (admin: UserData) => {
        setSelectedUser(admin)
        setIsEditSituationModalOpen(true)
    }

    const handleViewDetails = (admin: UserData) => {
        setSelectedUser(admin)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetails = () => {
        setSelectedUser(null)
        setIsDetailModalOpen(false)
    }

    const handleEditSuccess = async () => {
        await getAdmins()
        setIsEditModalOpen(false)
        setSelectedUser(null)
    }
    
    const handleEditSituationSuccess = async () => {
        await getAdmins()
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
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

            <header className="bg-white border-b">
                <div className="flex flex-col sm:flex-row h-auto sm:h-20 items-start sm:items-center justify-between px-4 md:px-2 lg:px-8 max-w-[95%] mx-auto w-full py-4 sm:py-0 gap-4 sm:gap-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciamento de Administradores</h1>
                        <p className="text-sm text-gray-600 hidden sm:block">Universidade de Tecnologia - Sistema de Gestão</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="flex items-center gap-2 bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1.5">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline font-semibold">{admins.length} Administradores</span>
                            <span className="sm:hidden font-semibold">{admins.length}</span>
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="md:px-2 lg:px-8 pb-8 space-y-6 max-w-[95%] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Total de Administradores</CardTitle>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{admins.length}</div>
                            <p className="text-xs text-gray-600 mt-1">
                                Cadastrados no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Administradores Ativos</CardTitle>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{admins.filter((a) => a.status === "ATIVO").length}</div>
                            <p className="text-xs text-gray-600 mt-1">
                                Status ativo no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Administradores Inativos</CardTitle>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <Users className="h-5 w-5 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">{admins.filter((a) => a.status === "INATIVO").length}</div>
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
                                    <CardTitle className="text-xl font-bold text-gray-900">Lista de Administradores</CardTitle>
                                    <CardDescription className="text-gray-600 mt-1">Gerencie os administradores cadastrados no sistema</CardDescription>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <Button onClick={getAdmins} className="flex items-center justify-center gap-2 h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                                        <RefreshCcw className="h-4 w-4" />
                                        <span className="hidden sm:inline">Recarregar</span>
                                        <span className="sm:hidden">Recarregar</span>
                                    </Button>
                                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Novo Administrador
                                    </Button>
                                </div>
                            </div>

                            {statusFilter !== null && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                                    <Badge variant="secondary" className="flex items-center gap-2">
                                        {getStatusFilterLabel()}
                                        <button
                                            onClick={clearStatusFilter}
                                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
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
                                    <Button
                                        onClick={() => setStatusFilter(statusFilter === "ATIVO" ? null : "ATIVO")}
                                        className={`flex items-center gap-2 h-12 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto ${
                                            statusFilter === "ATIVO"
                                                ? "bg-green-600 hover:bg-green-700 text-white"
                                                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50"
                                        }`}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Ativos
                                    </Button>
                                    <Button
                                        onClick={() => setStatusFilter(statusFilter === "INATIVO" ? null : "INATIVO")}
                                        className={`flex items-center gap-2 h-12 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto ${
                                            statusFilter === "INATIVO"
                                                ? "bg-red-600 hover:bg-red-700 text-white"
                                                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50"
                                        }`}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Inativos
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center space-y-3">
                                    <div className="flex justify-center">
                                        <RefreshCcw className="h-8 w-8 text-blue-600 animate-spin" />
                                    </div>
                                    <div className="text-lg font-medium text-gray-900">Carregando administradores...</div>
                                    <div className="text-sm text-gray-600">
                                        Por favor, aguarde um momento
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
                                                <TableHead>Administrador</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>CPF</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAdmins.map((admin) => {
                                                return (
                                                    <TableRow key={admin?.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarFallback>
                                                                        {admin.nome
                                                                            ?.split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")
                                                                            .substring(0, 2)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium">{admin?.nome}</p>
                                                                    <p className="text-sm text-muted-foreground">ID: {admin?.id}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{admin?.email}</TableCell>
                                                        <TableCell>{formatCPF(admin?.cpf)}</TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-300 font-semibold">
                                                                Administrador
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${
                                                                admin?.status === "ATIVO" 
                                                                    ? "bg-green-100 text-green-700 border border-green-300" 
                                                                    : "bg-red-100 text-red-700 border border-red-300"
                                                            } font-semibold`}>
                                                                {admin?.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => handleViewDetails(admin)}
                                                                                className="h-9 w-9 p-0 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-lg transition-colors"
                                                                                title="Ver Detalhes"
                                                                            >
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
                                                                                onClick={() => handleEdit(admin)}
                                                                                className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg transition-colors"
                                                                                title="Editar Dados do Administrador"
                                                                            >
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Editar Dados do Administrador</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button size="sm" 
                                                                            onClick={() => handleAdminSituationEdit(admin)}
                                                                            className="h-9 w-9 p-0 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded-lg transition-colors"
                                                                            title="Alterar Situação">
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
                                    {filteredAdmins.map((admin) => (
                                        <Card key={admin?.id} className="overflow-hidden">
                                            <CardContent>
                                                <div className="flex items-start gap-3 mb-3">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback>
                                                            {admin.nome
                                                                ?.split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-base truncate">{admin?.nome}</p>
                                                        <p className="text-sm text-muted-foreground">ID: {admin?.id}</p>
                                                        <Badge className="mt-1 bg-indigo-100 text-indigo-700 border border-indigo-300 font-semibold">
                                                            Administrador
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
                                                                    navigator.clipboard.writeText(admin?.email || '');
                                                                    toast.success('Email copiado para a área de transferência');
                                                                }}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                            <span className="text-sm whitespace-nowrap">{admin?.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">CPF:</span>
                                                        <span className="text-sm">{formatCPF(admin?.cpf)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-[60px] flex-shrink-0">Status:</span>
                                                        <Badge className={`text-xs font-semibold ${
                                                            admin?.status === "ATIVO" 
                                                                ? "bg-green-100 text-green-700 border border-green-300" 
                                                                : "bg-red-100 text-red-700 border border-red-300"
                                                        }`}>
                                                            {admin?.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-3 border-t">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleViewDetails(admin)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 font-semibold rounded-lg transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleEdit(admin)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-semibold rounded-lg transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAdminSituationEdit(admin)}
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

                                {filteredAdmins.length === 0 && (
                                    <div className="text-center py-12 space-y-4">
                                        <div className="flex justify-center">
                                            <Shield className="h-16 w-16 text-gray-300" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-gray-600 font-medium">
                                                {statusFilter || searchTerm
                                                    ? "Nenhum administrador encontrado"
                                                    : "Nenhum administrador cadastrado"}
                                            </p>
                                            {(statusFilter || searchTerm) && (
                                                <p className="text-sm text-gray-500">
                                                    Tente remover os filtros ou alterar os critérios de busca
                                                </p>
                                            )}
                                        </div>
                                        {!(statusFilter || searchTerm) && (
                                            <Button 
                                                onClick={() => setIsModalOpen(true)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Cadastrar Primeiro Administrador
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                <QuickActions />
            </main>

            <AdminFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />

            <EditAdminModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                onSuccess={handleEditSuccess}
                user={selectedUser}
            />

            <EditAdminSituationModal
                isOpen={isEditSituationModalOpen}
                onClose={handleEditSituationModalClose}
                onSuccess={handleEditSituationSuccess}
                user={selectedUser}
            />

            <AdminDetailsModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetails}
                admin={selectedUser}
                onEdit={handleEdit}
                onChangeSituation={handleAdminSituationEdit}
            />
        </div>
    )
}
