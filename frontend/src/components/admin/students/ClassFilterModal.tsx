"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Users } from "lucide-react"
import {Class} from "@/lib/interfaces/classInterfaces";
import {useEffect, useState} from "react";
import ClassList from "@/lib/api/class/classList";


interface ClassFilterModalProps {
    isOpen: boolean
    onClose: () => void
    students: Array<{ classId: number }>
    selectedClassFilter: {
        id: number
        code: string | null
        name: string
        startDate: string | null
        endDate: string | null
        semester: number | null
        courseId: number |null
        imgClass: string | null
    } | null
    onSelectClass: (
        classData: {
            id: number,
            code: string | null
            name: string
            startDate: string | null
            endDate: string | null
            semester: number | null
            courseId: number |null
            imgClass: string | null
        } | null,
    ) => void
}

export function ClassFilterModal({
                                     isOpen,
                                     onClose,
                                     students,
                                     selectedClassFilter,
                                     onSelectClass,
                                 }: ClassFilterModalProps) {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        getClasses();
    }, []);

    const getClasses = async () => {
        try {
            setLoading(true);
            setError(null);
            const classData = await ClassList();
            console.log("Raw API response:", classData);

            const mappedClasses = classData?.map((cls: any) => ({
                id: cls.Id || cls.id,
                code: cls.code || null,
                name: cls.nome || cls.name,
                startDate: cls.startDate || null,
                endDate: cls.endDate || null,
                semester: cls.semester || null,
                courseId: cls.courseId || null,
                imgClass: cls.imgClass
            })) || [];

            console.log("Mapped classes:", mappedClasses);
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
            cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.code?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR")
    }

    const handleSelectClass = (classData: Class | null) => {
        onSelectClass(classData)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Filtrar Alunos por Turma</DialogTitle>
                    <DialogDescription>
                        Selecione uma turma para filtrar os alunos. Por padrão, todos os alunos são exibidos.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                        <Card
                            className={`cursor-pointer transition-all hover:border-primary ${
                                selectedClassFilter === null ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => handleSelectClass(null)}
                        >
                            <CardContent className="flex items-center gap-4 p-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback>
                                        <Users className="h-8 w-8" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-semibold">Todas as Turmas</h3>
                                    <p className="text-sm text-muted-foreground">Exibir todos os alunos cadastrados</p>
                                    <Badge variant="secondary" className="mt-1">
                                        {students.length} alunos
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {filteredClasses.map((cls) => {
                            return (
                                <Card
                                    key={cls.id}
                                    className={`cursor-pointer transition-all hover:border-primary ${
                                        selectedClassFilter?.id === cls.id ? "border-primary bg-primary/5" : ""
                                    }`}
                                    onClick={() => handleSelectClass(cls)}
                                >
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={cls.imgClass || "/placeholder.svg"} alt={cls.name} />
                                            <AvatarFallback>{cls.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{cls.name}</h3>
                                            {
                                                cls.startDate && cls.endDate && (<p className="text-sm text-muted-foreground">
                                                    {formatDate(cls.startDate)} - {formatDate(cls.endDate)}
                                                </p>)
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
