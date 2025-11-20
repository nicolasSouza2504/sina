"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ClassCourse } from "@/lib/interfaces/classInterfaces";
import { BookOpen, Hash, Tag, Eye } from "lucide-react";

interface ModalViewCourseProps {
    isOpen: boolean;
    onClose: () => void;
    course: ClassCourse | null;
}

export default function ModalViewCourse({
    isOpen,
    onClose,
    course,
}: ModalViewCourseProps) {
    if (!course) return null;

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
                                Detalhes do Curso
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Informações do curso vinculado
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-6">
                    {/* ID do Curso */}
                    <div className="flex items-start gap-3 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Hash className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide">
                                ID do Curso
                            </p>
                            <p className="text-lg font-bold text-indigo-900">
                                #{course.id}
                            </p>
                        </div>
                    </div>

                    {/* Nome do Curso */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <BookOpen className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                                Nome do Curso
                            </p>
                            <p className="text-base font-bold text-gray-900">
                                {course.name}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
