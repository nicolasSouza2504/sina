"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Calendar } from "lucide-react"
import { Section } from "@/lib/interfaces/sectionInterfaces"

interface SectionSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    availableSections: Section[]
    selectedSectionIds: number[]
    onConfirm: (sectionIds: number[]) => void
    isLoading?: boolean
}

export function SectionSelectorModal({
    isOpen,
    onClose,
    availableSections,
    selectedSectionIds,
    onConfirm,
    isLoading = false
}: SectionSelectorModalProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [tempSelectedIds, setTempSelectedIds] = useState<number[]>(selectedSectionIds)

    useEffect(() => {
        if (isOpen) {
            console.log('[SectionSelectorModal] Modal aberto - Inicializando com selectedSectionIds:', selectedSectionIds)
            console.log('[SectionSelectorModal] Sections disponíveis:', availableSections.length)
            setTempSelectedIds(selectedSectionIds)
        }
    }, [isOpen, selectedSectionIds, availableSections])

    const filteredSections = availableSections.filter((section) =>
        section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.semester?.toString().includes(searchTerm)
    )

    const handleToggleSection = (sectionId: number) => {
        setTempSelectedIds((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        )
    }

    const handleConfirm = () => {
        console.log('[SectionSelectorModal] Confirmando seleção:', tempSelectedIds)
        onConfirm(tempSelectedIds)
        onClose()
    }

    const handleCancel = () => {
        setTempSelectedIds(selectedSectionIds)
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
                                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-base sm:text-2xl font-bold text-gray-900 truncate">
                                    Selecionar Semestres
                                </DialogTitle>
                                <p className="text-xs sm:text-sm text-gray-600 mt-0 sm:mt-1 line-clamp-1">
                                    Selecione os semestres que estarão ativos para esta turma
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-2 sm:space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por nome ou número do semestre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                            />
                        </div>

                        {/* Selected Count */}
                        <div className="flex items-center justify-between py-1.5 sm:py-3 px-2 sm:px-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl">
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">Selecionados:</span>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300 font-semibold text-xs">{tempSelectedIds.length}</Badge>
                        </div>

                        {/* Sections List */}
                        <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl max-h-[280px] sm:max-h-[400px] overflow-y-auto overflow-x-hidden">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : filteredSections.length === 0 ? (
                                <div className="text-center py-8 text-gray-600">
                                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Nenhum semestre encontrado</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredSections.map((section) => {
                                        const isChecked = tempSelectedIds.includes(section.id);
                                        if (isOpen) {
                                            console.log(`[SectionSelectorModal] Section ${section.id} (${section.name}): checked=${isChecked}, tempSelectedIds=`, tempSelectedIds);
                                        }
                                        return (
                                            <div
                                                key={section.id}
                                                className="flex items-start gap-1.5 sm:gap-3 p-2 sm:p-4 hover:bg-blue-50 transition-colors cursor-pointer border-b last:border-b-0"
                                                onClick={() => handleToggleSection(section.id)}
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={() => handleToggleSection(section.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="border-2 border-gray-200 flex-shrink-0 mt-0.5"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-1.5 mb-0.5 flex-wrap">
                                                        <h4 className="font-semibold text-xs sm:text-sm text-gray-900 break-words">
                                                            {section.name}
                                                        </h4>
                                                        {section.semester && (
                                                            <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300 flex-shrink-0">
                                                                {section.semester}º Semestre
                                                            </Badge>
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
