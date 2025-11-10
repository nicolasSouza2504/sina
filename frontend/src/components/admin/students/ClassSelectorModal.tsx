"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, GraduationCap, Users } from "lucide-react"
import { Class } from "@/lib/interfaces/classInterfaces"

interface ClassSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    availableClasses: Class[]
    selectedClassIds: number[]
    onConfirm: (classIds: number[]) => void
    isLoading?: boolean
}

export function ClassSelectorModal({
    isOpen,
    onClose,
    availableClasses,
    selectedClassIds,
    onConfirm,
    isLoading = false
}: ClassSelectorModalProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [tempSelectedIds, setTempSelectedIds] = useState<number[]>(selectedClassIds)

    useEffect(() => {
        if (isOpen) {
            console.log('[ClassSelectorModal] Modal aberto - Inicializando com selectedClassIds:', selectedClassIds)
            console.log('[ClassSelectorModal] Turmas disponíveis:', availableClasses.length)
            setTempSelectedIds(selectedClassIds)
        }
    }, [isOpen, selectedClassIds, availableClasses])

    const filteredClasses = availableClasses.filter((cls) =>
        cls.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.course?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleToggleClass = (classId: number) => {
        setTempSelectedIds((prev) =>
            prev.includes(classId)
                ? prev.filter((id) => id !== classId)
                : [...prev, classId]
        )
    }

    const handleConfirm = () => {
        console.log('[ClassSelectorModal] Confirmando seleção:', tempSelectedIds)
        onConfirm(tempSelectedIds)
        onClose()
    }

    const handleCancel = () => {
        setTempSelectedIds(selectedClassIds)
        setSearchTerm("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="w-[95vw] sm:w-full max-w-lg sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden p-2 sm:p-6">
                <div className="relative">
                    <DialogHeader className="pb-2 sm:pb-6">
                        <div className="flex items-start gap-1.5 sm:gap-3 mb-1">
                            <div className="p-1.5 sm:p-3 bg-blue-600 rounded-lg sm:rounded-xl flex-shrink-0">
                                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-base sm:text-2xl font-bold text-gray-900 truncate">
                                    Selecionar Turmas
                                </DialogTitle>
                                <p className="text-xs sm:text-sm text-gray-600 mt-0 sm:mt-1 line-clamp-1">Selecione as turmas</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-2 sm:space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por nome, código ou curso..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                            />
                        </div>

                        {/* Selected Count */}
                        <div className="flex items-center justify-between py-1.5 sm:py-3 px-2 sm:px-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl">
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">Selecionadas:</span>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300 font-semibold text-xs">{tempSelectedIds.length}</Badge>
                        </div>

                        {/* Classes List */}
                        <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl max-h-[280px] sm:max-h-[400px] overflow-y-auto overflow-x-hidden">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : filteredClasses.length === 0 ? (
                                <div className="text-center py-8 text-gray-600">
                                    <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Nenhuma turma encontrada</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredClasses.map((cls) => {
                                        const isChecked = tempSelectedIds.includes(cls.id);
                                        if (isOpen) {
                                            console.log(`[ClassSelectorModal] Turma ${cls.id} (${cls.nome}): checked=${isChecked}, tempSelectedIds=`, tempSelectedIds);
                                        }
                                        return (
                                            <div
                                                key={cls.id}
                                                className="flex items-start gap-1.5 sm:gap-3 p-2 sm:p-4 hover:bg-blue-50 transition-colors cursor-pointer border-b last:border-b-0"
                                                onClick={() => handleToggleClass(cls.id)}
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={() => handleToggleClass(cls.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="border-2 border-gray-200 flex-shrink-0 mt-0.5"
                                                />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-1.5 mb-0.5 flex-wrap">
                                                    <h4 className="font-semibold text-xs sm:text-sm text-gray-900 break-words">
                                                        {cls.nome}
                                                    </h4>
                                                    {cls.code && (
                                                        <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300 flex-shrink-0">
                                                            {cls.code}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-600 flex-wrap">
                                                    {cls.course && (
                                                        <span className="break-words">
                                                            {cls.course.name}
                                                        </span>
                                                    )}
                                                    {cls.semester && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{cls.semester}º Sem.</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-1.5 sm:gap-3 pt-2 sm:pt-8 border-t border-gray-100 mt-2 sm:mt-6">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleCancel}
                            className="h-9 sm:h-12 px-3 sm:px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-lg sm:rounded-xl text-xs sm:text-base"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleConfirm}
                            className="h-9 sm:h-12 px-3 sm:px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-base"
                        >
                            Confirmar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
