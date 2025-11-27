"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Class } from "@/lib/interfaces/classInterfaces";
import { BookOpen, Hash, Tag, Eye, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModalViewCourseProps {
    isOpen: boolean;
    onClose: () => void;
    classData: Class | null;
}

export default function ModalViewCourse({
    isOpen,
    onClose,
    classData,
}: ModalViewCourseProps) {
    if (!classData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-[500px] p-4 sm:p-6">
                <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-indigo-600 rounded-xl">
                            <Eye className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                Detalhes da Turma
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Informações do curso e semestres vinculados
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-6">
                    {/* ID do Curso */}
                    {classData.course && (
                        <div className="flex items-start gap-3 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Hash className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide">
                                    ID do Curso
                                </p>
                                <p className="text-lg font-bold text-indigo-900">
                                    #{classData.course.id}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Nome do Curso */}
                    {classData.course && (
                        <div className="flex items-start gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <BookOpen className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                                    Nome do Curso
                                </p>
                                <p className="text-base font-bold text-gray-900">
                                    {classData.course.name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Semestres Vinculados */}
                    {classData.sections && classData.sections.length > 0 && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">
                                    Semestres Ativos ({classData.sections.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {classData.sections.map((section) => (
                                        <Badge
                                            key={section.id}
                                            className="bg-blue-100 text-blue-700 border-blue-300 px-3 py-1"
                                        >
                                            {section.name}
                                            {section.semester && ` (${section.semester}º)`}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sem Semestres */}
                    {(!classData.sections || classData.sections.length === 0) && (
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-yellow-600 font-semibold mb-1 uppercase tracking-wide">
                                    Semestres
                                </p>
                                <p className="text-sm text-yellow-700">
                                    Nenhum semestre vinculado a esta turma
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
