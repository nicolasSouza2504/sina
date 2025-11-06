"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, XCircle, FileText } from "lucide-react"
import { UserData } from "@/lib/interfaces/userInterfaces"
import { toast } from "sonner"
import UserUpdateStatusService from "@/lib/api/user/userUpdateStatus"

const STATUS_OPTIONS = {
    active: {
        value: "ATIVO",
        label: "Ativo",
        icon: CheckCircle2,
        colorClass: "bg-green-500 hover:bg-green-600 text-white"
    },
    inactive: {
        value: "INATIVO",
        label: "Inativo",
        icon: XCircle,
        colorClass: "bg-red-500 hover:bg-red-600 text-white"
    }
}

interface EditAdminSituationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    user: UserData | null
}

export function EditAdminSituationModal({ isOpen, onClose, onSuccess, user }: EditAdminSituationModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset state whenever modal opens or user changes
    useEffect(() => {
        if (isOpen && user) {
            console.log('[EditStatusModal] Carregando dados do usuário:', user.id, user.status)
            setSelectedStatus(user.status || null)
        }
    }, [isOpen, user?.id, user?.status])

    // Clear state when modal closes
    useEffect(() => {
        if (!isOpen) {
            console.log('[EditStatusModal] Limpando estado ao fechar modal')
            setSelectedStatus(null)
        }
    }, [isOpen])

    const handleStatusSelect = async (status: string) => {
        if (!user?.id) {
            toast.error("Usuário não identificado")
            return
        }

        if (status === user.status) {
            toast.info("Este já é o status atual do usuário")
            return
        }

        try {
            setIsSubmitting(true)
            setSelectedStatus(status)

            await UserUpdateStatusService(status, user.id)

            toast.success("Status atualizado com sucesso!")
            onSuccess()
            handleClose()

        } catch (error) {
            console.error("[EditStatusModal] Erro ao atualizar status:", error)
            toast.error("Erro ao atualizar status do usuário")
            setSelectedStatus(user.status || null)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        if (!isSubmitting) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] sm:w-full max-w-md max-h-[95vh] sm:max-h-[90vh] p-4 sm:p-6">
                <div className="relative">
                    <DialogHeader className="pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-600 rounded-xl">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    Alterar Situação
                                </DialogTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                    {user?.status === "ATIVO" 
                                        ? `Desativar ${user?.nome || "administrador"}`
                                        : `Ativar ${user?.nome || "administrador"}`
                                    }
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        {user?.status && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-blue-800 font-medium">Status Atual</p>
                                        <p className="text-sm text-blue-700 capitalize">
                                            {user.status === "ATIVO" ? "Ativo" : "Inativo"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            {user?.status && (
                                <Button
                                    type="button"
                                    onClick={() => handleStatusSelect(user.status === "ATIVO" ? "INATIVO" : "ATIVO")}
                                    disabled={isSubmitting}
                                    className={`${
                                        user.status === "ATIVO" 
                                            ? STATUS_OPTIONS.inactive.colorClass 
                                            : STATUS_OPTIONS.active.colorClass
                                    } h-12 flex items-center justify-center gap-2 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`}
                                >
                                    {user.status === "ATIVO" ? (
                                        <>
                                            <XCircle className="h-5 w-5" />
                                            <span>Desativar Administrador</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span>Ativar Administrador</span>
                                        </>
                                    )}
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
