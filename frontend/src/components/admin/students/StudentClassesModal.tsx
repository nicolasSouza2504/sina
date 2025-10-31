"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Calendar, BookOpen, Hash } from "lucide-react"
import { UserData } from "@/lib/interfaces/userInterfaces"

interface StudentClassesModalProps {
    isOpen: boolean
    onClose: () => void
    student: UserData | null
}

export function StudentClassesModal({ isOpen, onClose, student }: StudentClassesModalProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR")
    }

    const classes = student?.classes || []

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Turmas Vinculadas - {student?.nome}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Summary Card */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Total de Turmas</p>
                                <p className="text-2xl font-bold text-blue-700">{classes.length}</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                            {classes.length === 0 ? "Nenhuma turma" : classes.length === 1 ? "1 turma vinculada" : `${classes.length} turmas vinculadas`}
                        </Badge>
                    </div>

                    {/* Classes List */}
                    {classes.length === 0 ? (
                        <div className="text-center py-12">
                            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma vinculada</h3>
                            <p className="text-sm text-gray-500">
                                Este aluno ainda não está vinculado a nenhuma turma.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {classes.map((cls) => (
                                <Card key={cls.Id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Class Image */}
                                            <Avatar className="h-16 w-16 rounded-lg flex-shrink-0">
                                                <AvatarImage src={cls.imgClass || "/placeholder.svg"} className="object-cover" />
                                                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                                                    {cls.nome.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Class Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                                                            {cls.nome}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {cls.course.name}
                                                        </p>
                                                    </div>
                                                    {cls.code && (
                                                        <Badge variant="outline" className="flex-shrink-0">
                                                            {cls.code}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Class Details Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Hash className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-xs text-gray-500">Semestre</p>
                                                            <p className="font-medium text-gray-900">{cls.semester}º</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-xs text-gray-500">Início</p>
                                                            <p className="font-medium text-gray-900 truncate">
                                                                {formatDate(cls.startDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-xs text-gray-500">Término</p>
                                                            <p className="font-medium text-gray-900 truncate">
                                                                {formatDate(cls.finalDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
