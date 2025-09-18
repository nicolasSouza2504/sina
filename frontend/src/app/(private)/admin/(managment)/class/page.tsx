"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import ModalAddClass from "@/components/admin/class/modalAddClass";
import ModalEditClass from "@/components/admin/class/modalEditClass";
import { Class } from "@/lib/interfaces/classInterfaces";
import ClassList from "@/lib/api/class/classList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ClassesManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  useEffect(() => {
    getClasses();
  }, []);

  const getClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const classData = await ClassList();
      setClasses(classData || []);
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
      cls.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDeleteClass = (id: number) => {
    console.log("Deleting class:", id);
    setClasses((prev) => prev?.filter((cls) => cls.id !== id) || []);
  };

  const openEditModal = (cls: Class) => {
    setSelectedClass(cls);
    setIsEditModalOpen(true);
  };

  const reloadClassList = () => {
    getClasses();
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
    finalDate: string | null
  ) => {
    if (!startDate || !finalDate) {
      return { status: "Sem Data", variant: "outline" as const };
    }

    try {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(finalDate);

      if (now < start)
        return { status: "Não Iniciada", variant: "secondary" as const };
      if (now > end)
        return { status: "Finalizada", variant: "destructive" as const };
      return { status: "Em Andamento", variant: "default" as const };
    } catch {
      return { status: "Data inválida", variant: "outline" as const };
    }
  };

  const getClassesWithDates = () => {
    return classes?.filter((cls) => cls.startDate && cls.finalDate) || [];
  };

  const getInProgressClasses = () => {
    return getClassesWithDates().filter((cls) => {
      try {
        const now = new Date();
        const start = new Date(cls.startDate!);
        const end = new Date(cls.finalDate!);
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
        return new Date() > new Date(cls.finalDate!);
      } catch {
        return false;
      }
    });
  };

  const closeError = () => {
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Carregando turmas...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Por favor, aguarde
          </div>
        </div>
      </div>
    );
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
              <X className="size-5" />
            </Button>
          </Alert>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gerenciamento de Turmas
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as turmas da universidade de tecnologia
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Turmas
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Turmas ativas no sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Em Andamento
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getInProgressClasses().length}
              </div>
              <p className="text-xs text-muted-foreground">
                Turmas em andamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Não Iniciadas
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getUpcomingClasses().length}
              </div>
              <p className="text-xs text-muted-foreground">Turmas futuras</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getFinishedClasses().length}
              </div>
              <p className="text-xs text-muted-foreground">Turmas concluídas</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome da turma..."
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
            <CardTitle>Lista de Turmas</CardTitle>
            <CardDescription>
              {filteredClasses.length} turma(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredClasses.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
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
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Turma
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Nome da Turma</TableHead>
                    <TableHead>Data de Início</TableHead>
                    <TableHead>Data de Término</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((cls) => {
                    const { status, variant } = getClassStatus(
                      cls.startDate,
                      cls.finalDate
                    );
                    return (
                      <TableRow key={cls.id}>
                        <TableCell>
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={cls.imgClass || "/placeholder.svg"}
                              alt={cls.name || "Turma"}
                            />
                            <AvatarFallback>
                              {(cls.name || "T").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {cls.name || "Nome não disponível"}
                        </TableCell>
                        <TableCell>{formatDate(cls.startDate)}</TableCell>
                        <TableCell>{formatDate(cls.finalDate)}</TableCell>
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
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar Exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a turma "
                                    {cls.name || "esta turma"}"? Esta ação não
                                    pode ser desfeita.
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
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Class Modal */}
      <ModalAddClass
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onClassCreated={() => {
          reloadClassList();
        }}
      />

      {/* Edit Class Modal */}
      <ModalEditClass
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
        onClassUpdated={() => {
          reloadClassList();
        }}
      />
    </div>
  );
}
