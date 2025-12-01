"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ClassSection } from "@/lib/interfaces/classInterfaces";
import { Calendar, ListChecks, Hash, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModalViewSectionsProps {
    isOpen: boolean;
    onClose: () => void;
    sections: ClassSection[];
    className?: string;
}

export default function ModalViewSections({
    isOpen,
    onClose,
    sections,
    className,
}: ModalViewSectionsProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-[500px] p-0 flex flex-col max-h-[90vh]">
                {/* Header Fixo */}
                <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-xl flex-shrink-0">
                            <Eye className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                                Semestres Vinculados
                            </DialogTitle>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                                {className ? `Turma: ${className}` : 'Semestres vinculados à turma'}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Conteúdo com Scroll */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {/* Contador de Semestres */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <ListChecks className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
                                Total de Semestres
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                                {sections.length}
                            </p>
                        </div>
                    </div>

                    {/* Lista de Semestres */}
                    {sections.length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Lista de Semestres
                            </p>
                            <div className="space-y-2">
                                {sections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                                    >
                                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                                            <Hash className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {section.name}
                                            </p>
                                            {section.semester && (
                                                <p className="text-xs text-gray-500">
                                                    {section.semester}º Semestre
                                                </p>
                                            )}
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-300 flex-shrink-0">
                                            ID: {section.id}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                            <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                                <Calendar className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-yellow-600 font-semibold mb-1 uppercase tracking-wide">
                                    Sem Semestres
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
