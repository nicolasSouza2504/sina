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
import { Search, GraduationCap } from "lucide-react"
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
        setTempSelectedIds(selectedClassIds)
    }, [selectedClassIds, isOpen])

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
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Selecionar Turmas
                    </DialogTitle>
                    <DialogDescription>
                        Selecione as turmas que o aluno irá participar
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome, código ou curso..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Selected Count */}
                    <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Turmas selecionadas:</span>
                        <Badge variant="secondary">{tempSelectedIds.length}</Badge>
                    </div>

                    {/* Classes List */}
                    <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredClasses.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Nenhuma turma encontrada</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {filteredClasses.map((cls) => (
                                    <div
                                        key={cls.id}
                                        className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => handleToggleClass(cls.id)}
                                    >
                                        <Checkbox
                                            checked={tempSelectedIds.includes(cls.id)}
                                            onCheckedChange={() => handleToggleClass(cls.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-sm truncate">
                                                    {cls.nome}
                                                </h4>
                                                {cls.code && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {cls.code}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                {cls.course && (
                                                    <span className="truncate">
                                                        {cls.course.name}
                                                    </span>
                                                )}
                                                {cls.semester && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{cls.semester}º Semestre</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleConfirm}>
                        Confirmar ({tempSelectedIds.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
