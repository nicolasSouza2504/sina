"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ClassSection } from "@/lib/interfaces/classInterfaces";
import { Calendar, ListChecks, Hash } from "lucide-react";
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
            <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-[500px] p-4 sm:p-6">
                <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-600 rounded-xl">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                Semestres Ativos
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                {className ? `Turma: ${className}` : 'Semestres vinculados à turma'}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-6">
                    {/* Contador de Semestres */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <div className="p-2 bg-blue-100 rounded-lg">
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
                                Semestres Vinculados
                            </p>
                            <div className="space-y-2">
                                {sections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                                    >
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Hash className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">
                                                {section.name}
                                            </p>
                                            {section.semester && (
                                                <p className="text-xs text-gray-500">
                                                    {section.semester}º Semestre
                                                </p>
                                            )}
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                            ID: {section.id}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                            <div className="p-2 bg-yellow-100 rounded-lg">
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
