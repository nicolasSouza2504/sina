"use client";

import type React from "react";

import {useEffect, useState} from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Calendar,
    Users,
    GraduationCap,
    X,
    Hash, RefreshCcw,
} from "lucide-react";
import ModalAddClass from "@/components/admin/class/modalAddClass";
import ModalEditClass from "@/components/admin/class/modalEditClass";
import ModalViewCourse from "@/components/admin/class/modalViewCourse";
import {Class, ClassCourse} from "@/lib/interfaces/classInterfaces";
import ClassList from "@/lib/api/class/classList";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import ClassRemoveService from "@/lib/api/class/classRemove";
import QuickActions from "@/components/admin/quickActions";

const imgs = ["TurmaIMG1.png", "TurmaIMG2.png", "TurmaIMG3.png", "TurmaIMG4.png"];

export default function ClassesManagement() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<ClassCourse | null>(null);

    useEffect(() => {
        getClasses();
    }, []);

    const getClasses = async () => {
        try {
            setLoading(true);
            setError(null);
            const classData = await ClassList();

            const mappedClasses = classData?.map((cls: any) => ({
                id: cls.Id || cls.id,
                code: cls.code || null,
                nome: cls.nome || cls.name,
                startDate: cls.startDate,
                endDate: cls.finalDate || cls.endDate,
                semester: cls.semester || null,
                courseId: cls.course?.id || cls.courseId || null,
                imgClass: cls.imgClass,
                course: cls.course ? {
                    id: cls.course.id,
                    name: cls.course.name
                } : null
            })) || [];


            setClasses(mappedClasses);
        } catch (err) {
            console.error("Error fetching classes:", err);
            const message =
                err instanceof Error
                    ? err.message
                    : "Erro desconhecido ao buscar turmas.";
            setError(message);

            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredClasses =
        classes?.filter((cls) =>
            cls.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.code?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const handleDeleteClass = async (id: number) => {
        try{
            await ClassRemoveService(id);
            setClasses((prev) => prev?.filter((cls) => cls.id !== id) || []);
        }catch(error){
            console.error("Error fetching classes:", error);
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro desconhecido ao buscar turmas.";
            setError(message);
        }
    };

    const openEditModal = (cls: Class) => {
        setSelectedClass(cls);
        setIsEditModalOpen(true);
    };

    const openCourseModal = (course: ClassCourse | null) => {
        if (course) {
            setSelectedCourse(course);
            setIsCourseModalOpen(true);
        }
    };

    const reloadClassList = async () => {
        await getClasses();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("pt-BR");
        } catch {
            return "Data inválida";
        }
    };

    const getClassStatus = (
        startDate: string | null,
        endDate: string | null
    ) => {
        if (!startDate || !endDate) {
            return {status: "Sem Data", variant: "outline" as const};
        }

        try {
            const now = new Date();
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (now < start)
                return {status: "Não Iniciada", variant: "secondary" as const};
            if (now > end)
                return {status: "Finalizada", variant: "destructive" as const};
            return {status: "Em Andamento", variant: "default" as const};
        } catch {
            return {status: "Data inválida", variant: "outline" as const};
        }
    };

    const getClassesWithDates = () => {
        return classes?.filter((cls) => cls.startDate && cls.endDate) || [];
    };

    const getInProgressClasses = () => {
        return getClassesWithDates().filter((cls) => {
            try {
                const now = new Date();
                const start = new Date(cls.startDate!);
                const end = new Date(cls.endDate!);
                return now >= start && now <= end;
            } catch {
                return false;
            }
        });
    };

    const getUpcomingClasses = () => {
        return getClassesWithDates().filter((cls) => {
            try {
                return new Date() < new Date(cls.startDate!);
            } catch {
                return false;
            }
        });
    };

    const getFinishedClasses = () => {
        return getClassesWithDates().filter((cls) => {
            try {
                return new Date() > new Date(cls.endDate!);
            } catch {
                return false;
            }
        });
    };

    const closeError = () => {
        setError(null);
    };

    // Helper function to get the full image path
    const getImagePath = (imageName: string | null) => {
        if (!imageName) return "/placeholder.svg";
        return `/img/${imageName}`;
    };

    // Helper function to format semester display
    const formatSemester = (semester: number | null | string) => {
        if (semester === null || semester === undefined) return "N/A";
        return `${semester} Semestres`;
    };


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

            {/* Header */}
            <header className="border-b bg-card">
                <div className="flex flex-col sm:flex-row sm:h-16 items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-0 gap-4 sm:gap-0">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            Gerenciamento de Turmas
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                            Gerencie as turmas da universidade de tecnologia
                        </p>
                    </div>
                    <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full sm:w-auto"
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-2"/>
                        <span className="sm:inline">Nova Turma</span>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                                Total de Turmas
                            </CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">{classes?.length || 0}</div>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                                Turmas ativas no sistema
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                                Em Andamento
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">
                                {getInProgressClasses().length}
                            </div>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                                Turmas em andamento
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                                Não Iniciadas
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">
                                {getUpcomingClasses().length}
                            </div>
                            <p className="text-xs text-muted-foreground hidden sm:block">Turmas futuras</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">Finalizadas</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">
                                {getFinishedClasses().length}
                            </div>
                            <p className="text-xs text-muted-foreground hidden sm:block">Turmas concluídas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">Buscar Turmas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                                <Input
                                    placeholder="Buscar por nome ou código..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Classes Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
                            <div>
                                <CardTitle className="text-base sm:text-lg">Lista de Turmas</CardTitle>
                                <CardDescription className="text-sm">
                                    {filteredClasses.length} turma(s) encontrada(s)
                                </CardDescription>
                            </div>
                            <div>
                                <Button 
                                    onClick={reloadClassList} 
                                    className="flex items-center gap-2 bg-gray-500 w-full sm:w-auto"
                                    size="sm"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    <span className="hidden sm:inline">Recarregar</span>
                                    <span className="sm:hidden">Atualizar</span>
                                </Button>
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
                                {filteredClasses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground"/>
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                            Nenhuma turma encontrada
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {searchTerm
                                                ? "Nenhuma turma corresponde à sua pesquisa."
                                                : "Comece criando uma nova turma."}
                                        </p>
                                        {!searchTerm && (
                                            <div className="mt-6">
                                                <Button 
                                                    onClick={() => setIsCreateModalOpen(true)}
                                                    className="w-full sm:w-auto"
                                                >
                                                    <Plus className="h-4 w-4 mr-2"/>
                                                    Nova Turma
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Mobile Cards View */}
                                        <div className="block lg:hidden space-y-3">
                                            {filteredClasses.map((cls) => {
                                                const {status, variant} = getClassStatus(
                                                    cls.startDate,
                                                    cls.endDate
                                                );
                                                return (
                                                    <Card key={cls.id} className="w-full">
                                                        <CardContent className="p-4">
                                                            {/* Header com Avatar, Nome e Status */}
                                                            <div className="flex items-start gap-3 mb-3">
                                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                                    <AvatarImage
                                                                        src={getImagePath(cls.imgClass)}
                                                                        alt={cls.nome || "Turma"}
                                                                    />
                                                                    <AvatarFallback className="text-xs">
                                                                        {(cls.nome || cls.code || "T").substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="space-y-2">
                                                                        <h3 className="font-medium text-sm leading-tight">
                                                                            {cls.nome || "Nome não disponível"}
                                                                        </h3>
                                                                        <div className="flex items-center gap-2">
                                                                            {cls.code && (
                                                                                <p className="text-xs text-muted-foreground font-mono">
                                                                                    {cls.code}
                                                                                </p>
                                                                            )}
                                                                            <Badge variant={variant} className="text-xs px-2 py-1">
                                                                                {status}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Informações em Grid */}
                                                            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                                                                <div className="space-y-1">
                                                                    <div className="text-muted-foreground">Curso</div>
                                                                    <div className="font-medium">
                                                                        {cls.course ? (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => openCourseModal(cls.course)}
                                                                                className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                            >
                                                                                <GraduationCap className="h-3 w-3 mr-1" />
                                                                                ID: {cls.course.id}
                                                                            </Button>
                                                                        ) : (
                                                                            <span className="text-gray-400">Sem curso</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-muted-foreground">Semestres</div>
                                                                    <div className="font-medium">{formatSemester(cls.semester)}</div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-muted-foreground">Início</div>
                                                                    <div className="font-medium">{formatDate(cls.startDate)}</div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-muted-foreground">Término</div>
                                                                    <div className="font-medium">{formatDate(cls.endDate)}</div>
                                                                </div>
                                                            </div>

                                                            {/* Botões de Ação */}
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openEditModal(cls)}
                                                                    className="flex-1 h-8"
                                                                >
                                                                    <Edit className="h-3 w-3 mr-1"/>
                                                                    <span className="text-xs">Editar</span>
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="outline" size="sm" className="flex-1 h-8">
                                                                            <Trash2 className="h-3 w-3 mr-1"/>
                                                                            <span className="text-xs">Excluir</span>
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className="w-[90vw] max-w-md">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className="text-base">
                                                                                Confirmar Exclusão
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription className="text-sm">
                                                                                Tem certeza que deseja excluir a turma "
                                                                                <span className="font-medium">{cls.nome || cls.code || "esta turma"}</span>"? 
                                                                                Esta ação não pode ser desfeita.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                                                            <AlertDialogCancel className="w-full sm:w-auto">
                                                                                Cancelar
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleDeleteClass(cls.id)}
                                                                                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                            >
                                                                                Excluir
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>

                                        {/* Desktop Table View */}
                                        <div className="hidden lg:block overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Imagem</TableHead>
                                                        <TableHead>Código</TableHead>
                                                        <TableHead>Nome da Turma</TableHead>
                                                        <TableHead className="text-center">Curso</TableHead>
                                                        <TableHead>QTD Semestres</TableHead>
                                                        <TableHead>Data de Início</TableHead>
                                                        <TableHead>Data de Término</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Ações</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredClasses.map((cls) => {
                                                        const {status, variant} = getClassStatus(
                                                            cls.startDate,
                                                            cls.endDate
                                                        );
                                                        return (
                                                            <TableRow key={cls.id}>
                                                                <TableCell>
                                                                    <Avatar className="h-12 w-12">
                                                                        <AvatarImage
                                                                            src={getImagePath(cls.imgClass)}
                                                                            alt={cls.nome || "Turma"}
                                                                        />
                                                                        <AvatarFallback>
                                                                            {(cls.nome || cls.code || "T").substring(0, 2).toUpperCase()}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                </TableCell>
                                                                <TableCell className="font-mono text-sm">
                                                                    {cls.code || "N/A"}
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                    {cls.nome || "Nome não disponível"}
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    {cls.course ? (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => openCourseModal(cls.course)}
                                                                            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                        >
                                                                            <GraduationCap className="h-4 w-4 mr-1" />
                                                                            ID: {cls.course.id}
                                                                        </Button>
                                                                    ) : (
                                                                        <span className="text-gray-400 text-sm">Sem curso</span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatSemester(cls.semester)}
                                                                </TableCell>
                                                                <TableCell>{formatDate(cls.startDate)}</TableCell>
                                                                <TableCell>{formatDate(cls.endDate)}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant={variant}>{status}</Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => openEditModal(cls)}
                                                                        >
                                                                            <Edit className="h-4 w-4"/>
                                                                        </Button>
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button variant="outline" size="sm">
                                                                                    <Trash2 className="h-4 w-4"/>
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>
                                                                                        Confirmar Exclusão
                                                                                    </AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        Tem certeza que deseja excluir a turma "
                                                                                        {cls.nome || cls.code || "esta turma"}"? Esta
                                                                                        ação não pode ser desfeita.
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>
                                                                                        Cancelar
                                                                                    </AlertDialogCancel>
                                                                                    <AlertDialogAction
                                                                                        onClick={() => handleDeleteClass(cls.id)}
                                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                    >
                                                                                        Excluir
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                    </CardContent>
                </Card>
                <QuickActions />
            </main>



            {/* Create Class Modal */}
            <ModalAddClass
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onClassCreated={async () => {
                    await reloadClassList();
                }}
                imageNames={imgs}
            />

            {/* Edit Class Modal */}
            <ModalEditClass
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedClass(null);
                }}
                classData={selectedClass}
                onClassUpdated={async () => {
                    await reloadClassList();
                }}
                imageNames={imgs}
            />

            {/* View Course Modal */}
            <ModalViewCourse
                isOpen={isCourseModalOpen}
                onClose={() => {
                    setIsCourseModalOpen(false);
                    setSelectedCourse(null);
                }}
                course={selectedCourse}
            />
        </div>
    );
}