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
import { Users, Filter } from "lucide-react"
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
            <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <div className="relative">
                    <DialogHeader className="pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-600 rounded-xl">
                                <Filter className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    Filtrar Alunos por Turma
                                </DialogTitle>
                                <p className="text-sm text-gray-600 mt-1">Selecione uma turma para filtrar os alunos</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                            <Card
                                className={`cursor-pointer transition-all border-2 rounded-xl ${
                                    selectedClassFilter === null 
                                        ? "border-blue-300 bg-blue-50" 
                                        : "border-gray-200 hover:border-blue-300"
                                }`}
                                onClick={() => handleSelectClass(null)}
                            >
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">Todas as Turmas</h3>
                                        <p className="text-sm text-gray-600">Exibir todos os alunos cadastrados</p>
                                        <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-300">
                                            {students.length} alunos
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {filteredClasses.map((cls) => {
                                return (
                                    <Card
                                        key={cls.id}
                                        className={`cursor-pointer transition-all border-2 rounded-xl ${
                                            selectedClassFilter?.id === cls.id 
                                                ? "border-blue-300 bg-blue-50" 
                                                : "border-gray-200 hover:border-blue-300"
                                        }`}
                                        onClick={() => handleSelectClass(cls)}
                                    >
                                        <CardContent className="flex items-center gap-4 p-4">
                                            <Avatar className="h-12 w-12 rounded-lg flex-shrink-0">
                                                <AvatarImage src={cls.imgClass || "/placeholder.svg"} alt={cls.nome} />
                                                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                    {cls.nome.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{cls.nome}</h3>
                                                {
                                                    cls.startDate && cls.endDate && (<p className="text-sm text-gray-600">
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

                    <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 mt-6">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
                        >
                            Fechar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
