"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Search, Plus, Edit, Trash2, Users, GraduationCap, Filter, X, RefreshCcw} from "lucide-react"
import React, {useEffect, useState} from "react"
import {StudentFormModal} from "@/components/admin/students/StudentFormModal";
import {UserData} from "@/lib/interfaces/userInterfaces";
import { EditStudentModal } from "@/components/admin/students/EditStudentModal";
import {UserListService} from "@/lib/api/user/userListService";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";


const roles = [
    { id: 2, name: "STUDENT" },
    { id: 3, name: "TEACHER" },
    { id: 1, name: "ADMIN" },
]


export default function StudentsManagement() {
    const [students, setStudents] = useState<UserData[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    // const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    useEffect(() => {
        getStudents();
    }, []);


    const getStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const studentsData = await UserListService(null, 3);
            console.log("Raw API response:", studentsData);

            const mappedStudents = studentsData.data?.map((cls: any) => ({
                id: cls.id,
                nome: cls.nome,
                email: cls.email,
                role: cls.role,
                institutionName: cls.institutionName,
                cpf: cls.cpf,
            })) || [];

            console.log("Mapped classes:", mappedStudents);
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

        // const matchesClass = selectedClassFilter === null || student.classId === selectedClassFilter.id
        return matchesSearch;
        // return matchesSearch && matchesClass
    })

    const getSelectedClassName = () => {
        return selectedClassFilter?.name || null
    }

    const clearClassFilter = () => {
        setSelectedClassFilter(null)
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

    const handleEditSuccess = async () => {
        await getStudents()
        setIsEditModalOpen(false)
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

            <header className="border-b bg-card">
                <div className="flex h-16 items-center justify-between px-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Alunos</h1>
                        <p className="text-sm text-muted-foreground">Universidade de Tecnologia - Sistema de Gestão</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {students.length} Alunos Cadastrados
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{students.length}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">+12</span> novos este mês
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{students.filter((s) => s.role.name === "STUDENT").length}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-blue-600">98%</span> taxa de atividade
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {selectedClassFilter ? "Alunos na Turma" : "Novos Cadastros"}
                            </CardTitle>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{selectedClassFilter ? filteredStudents.length : 8}</div>
                            <p className="text-xs text-muted-foreground">
                                {selectedClassFilter ? "Alunos filtrados" : "Esta semana"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div>
                                    <CardTitle>Lista de Alunos</CardTitle>
                                    <CardDescription>Gerencie os alunos cadastrados no sistema</CardDescription>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button onClick={getStudents} className="flex items-center gap-2 bg-gray-500">
                                        <RefreshCcw className="h-4 w-4" />
                                        Recarregar Alunos
                                    </Button>
                                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Novo Aluno
                                    </Button>
                                </div>
                            </div>

                            {selectedClassFilter !== null && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Filtro ativo:</span>
                                    <Badge variant="default" className="flex items-center gap-2">
                                        {getSelectedClassName()}
                                        <button
                                            onClick={clearClassFilter}
                                            className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                </div>
                            )}

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nome, email ou CPF..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Aluno</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>CPF</TableHead>
                                            {/*<TableHead>Turma</TableHead>*/}
                                            <TableHead>Tipo</TableHead>
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
                                                            {student?.role.name}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEdit(student)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>

                                {filteredStudents.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">
                                            {selectedClassFilter
                                                ? "Nenhum aluno encontrado nesta turma com os critérios de busca."
                                                : "Nenhum aluno encontrado com os critérios de busca."}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />

            <EditStudentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                user={selectedUser}
            />

            {/*<ClassFilterModal*/}
            {/*    isOpen={isFilterModalOpen}*/}
            {/*    onClose={() => setIsFilterModalOpen(false)}*/}
            {/*    students={students}*/}
            {/*    selectedClassFilter={selectedClassFilter}*/}
            {/*    onSelectClass={setSelectedClassFilter}*/}
            {/*/>*/}
        </div>
    )
}