"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, XCircle, Lock } from "lucide-react"
import { UserData } from "@/lib/interfaces/userInterfaces"
import { toast } from "sonner"
import UserUpdateStatusService from "@/lib/api/user/userUpdateStatus"

interface EditUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    user: UserData | null
}

const OPTIONS_STATUS = [
    {
        value: "active",
        label: "Ativo",
        icon: CheckCircle2,
        colorClass: "bg-green-500 hover:bg-green-600 text-white"
    },
    {
        value: "inactive",
        label: "Inativo",
        icon: XCircle,
        colorClass: "bg-red-500 hover:bg-red-600 text-white"
    },
    {
        value: "frozen",
        label: "Trancado",
        icon: Lock,
        colorClass: "bg-yellow-500 hover:bg-yellow-600 text-white"
    },
]

export function EditStudentSituationModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (user && isOpen) {
            setSelectedStatus(user.status || null)
        }
    }, [user, isOpen])

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
            setSelectedStatus(null)
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Atualizar Situação do Aluno</DialogTitle>
                    <DialogDescription>
                        Selecione o novo status para {user?.nome || "o usuário"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-3">
                        {OPTIONS_STATUS.map((option) => {
                            const Icon = option.icon
                            const isCurrentStatus = user?.status === option.value

                            return (
                                <Button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleStatusSelect(option.value)}
                                    disabled={isSubmitting}
                                    className={`${option.colorClass} h-24 flex flex-col items-center justify-center gap-2 relative text-black hover:text-white `}
                                    variant={isCurrentStatus ? "default" : "outline"}
                                >
                                    <Icon className="h-6 w-6  " />
                                    <span className="text-sm font-medium  ">{option.label}</span>
                                    {isCurrentStatus && (
                                        <span className="absolute top-1 right-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                                            Atual
                                        </span>
                                    )}
                                </Button>
                            )
                        })}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-full h-12"
                    >
                        Cancelar
                    </Button>

                    {user?.status && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            <span>
                                Status atual: <strong className="capitalize">{OPTIONS_STATUS.find(s => s.value === user.status)?.label}</strong>
                            </span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}