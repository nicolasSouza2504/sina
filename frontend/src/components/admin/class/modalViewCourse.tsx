"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ClassCourse } from "@/lib/interfaces/classInterfaces";
import { BookOpen, Hash, Tag } from "lucide-react";

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
            <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Detalhes do Curso
                    </DialogTitle>
                    <DialogDescription>
                        Informações do curso vinculado a esta turma
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* ID do Curso */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Hash className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium mb-1">
                                ID do Curso
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {course.id}
                            </p>
                        </div>
                    </div>

                    {/* Nome do Curso */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Tag className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium mb-1">
                                Nome do Curso
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {course.name}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
