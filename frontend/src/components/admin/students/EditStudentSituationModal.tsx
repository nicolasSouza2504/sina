"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { UserData } from "@/lib/interfaces/userInterfaces"
import { toast } from "sonner"
import UserUpdateStatusService from "@/lib/api/user/userUpdateStatus"

interface EditUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    user: UserData | null
}

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

export function EditStudentSituationModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Alterar Situação do Aluno</DialogTitle>
                    <DialogDescription>
                        {user?.status === "ATIVO" 
                            ? `Desativar o aluno ${user?.nome || ""}`
                            : `Ativar o aluno ${user?.nome || ""}`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {user?.status && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <span>
                                Status atual: <strong className="capitalize">
                                    {user.status === "ATIVO" ? "Ativo" : "Inativo"}
                                </strong>
                            </span>
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
                                } h-16 flex items-center justify-center gap-3 text-white`}
                            >
                                {user.status === "ATIVO" ? (
                                    <>
                                        <XCircle className="h-5 w-5" />
                                        <span className="font-medium">Desativar Aluno</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span className="font-medium">Ativar Aluno</span>
                                    </>
                                )}
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-full h-12"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}