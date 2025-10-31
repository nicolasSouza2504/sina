"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Upload, AlertCircle, Users, X, Plus } from "lucide-react"
import { UserData } from "@/lib/interfaces/userInterfaces"
import { Class } from "@/lib/interfaces/classInterfaces"
import { z } from "zod"
import { toast } from "sonner"
import UpdateUserService from "@/lib/api/user/userUpdate";
import ClassList from "@/lib/api/class/classList"
import { ClassSelectorModal } from "./ClassSelectorModal"

interface EditUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    user: UserData | null
}

const updateUserSchema = z.object({
    name: z.string()
        .min(3, "Nome deve ter no mínimo 3 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres"),
    email: z.string()
        .email("Email inválido")
        .min(1, "Email é obrigatório"),
    cpf: z.string()
        .length(11, "CPF deve ter exatamente 11 dígitos")
        .regex(/^\d+$/, "CPF deve conter apenas números"),
    roleId: z.number().int().positive("Tipo de usuário é obrigatório"),
})

export function EditStudentModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cpf: "",
        roleId: 3, // Always STUDENT
    })
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Class selection states
    const [availableClasses, setAvailableClasses] = useState<Class[]>([])
    const [isLoadingClasses, setIsLoadingClasses] = useState(false)
    const [isClassModalOpen, setIsClassModalOpen] = useState(false)
    const [selectedClassIds, setSelectedClassIds] = useState<number[]>([])

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.nome || "",
                email: user.email || "",
                cpf: user.cpf || "",
                roleId: 3, // Always preset to STUDENT
            })
            // Set selected classes from user data
            const userClassIds = user.classes?.map(cls => cls.Id) || []
            setSelectedClassIds(userClassIds)
        }
    }, [user])

    // Load available classes
    useEffect(() => {
        const loadClasses = async () => {
            setIsLoadingClasses(true)
            try {
                const classes = await ClassList()
                setAvailableClasses(classes)
            } catch (error) {
                console.error("[EditStudentModal] Erro ao carregar turmas:", error)
                toast.error("Erro ao carregar turmas disponíveis")
            } finally {
                setIsLoadingClasses(false)
            }
        }
        if (isOpen) {
            loadClasses()
        }
    }, [isOpen])

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const formatCPF = (value: string) => {
        const numbers = value.replace(/\D/g, "")
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        }
        return value
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        if (!user?.id) {
            toast.error("Usuário não identificado")
            return
        }

        try {
            // Validar dados com Zod
            updateUserSchema.parse({
                name: formData.name,
                email: formData.email,
                cpf: formData.cpf,
                roleId: 3, // Always STUDENT
            })

            setIsSubmitting(true)

            const userData = {
                name: formData.name,
                email: formData.email,
                cpf: formData.cpf,
                roleId: 3, // Always STUDENT
                classesId: selectedClassIds.length > 0 ? selectedClassIds : undefined,
            }

            await UpdateUserService(userData, user.id, selectedImage)

            toast.success("Usuário atualizado com sucesso!")
            resetForm()
            onClose()
            onSuccess()

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {}
                error.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        fieldErrors[issue.path[0] as string] = issue.message
                    }
                })
                setErrors(fieldErrors)
            } else {
                console.error("[EditStudentModal] Erro ao atualizar usuário:", error)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: "", email: "", cpf: "", roleId: 3 })
        setSelectedImage(null)
        setImagePreview(null)
        setErrors({})
        setSelectedClassIds([])
    }

    const handleClassesConfirm = (classIds: number[]) => {
        setSelectedClassIds(classIds)
    }

    const handleRemoveClass = (classId: number) => {
        setSelectedClassIds((prev) => prev.filter((id) => id !== classId))
    }

    const getSelectedClasses = () => {
        return availableClasses.filter((cls) => selectedClassIds.includes(cls.id))
    }

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm()
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do usuário abaixo
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Digite o nome completo"
                                className={errors.name ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{errors.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@techuni.edu.br"
                                className={errors.email ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                value={formatCPF(formData.cpf)}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, "") })}
                                placeholder="000.000.000-00"
                                maxLength={14}
                                className={errors.cpf ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.cpf && (
                                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{errors.cpf}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Tipo de Usuário</Label>
                            <Input
                                id="role"
                                value="STUDENT"
                                disabled
                                className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">Tipo de usuário fixo</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="institution">Instituição</Label>
                        <Input
                            id="institution"
                            value="SENAI Joinville"
                            disabled
                            className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">Instituição padrão</p>
                    </div>

                    {/* Class Selection */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Turmas do Aluno
                        </Label>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsClassModalOpen(true)}
                            className="w-full justify-start"
                            disabled={isSubmitting || isLoadingClasses}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {isLoadingClasses ? "Carregando turmas..." : "Gerenciar Turmas"}
                        </Button>
                        
                        {selectedClassIds.length > 0 && (
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {selectedClassIds.length} {selectedClassIds.length === 1 ? "turma selecionada" : "turmas selecionadas"}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getSelectedClasses().map((cls) => (
                                        <Badge
                                            key={cls.id}
                                            variant="secondary"
                                            className="flex items-center gap-1 pr-1"
                                        >
                                            <span className="truncate max-w-[150px]">{cls.nome}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() => handleRemoveClass(cls.id)}
                                                disabled={isSubmitting}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Foto do Usuário</Label>
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <Upload className="h-4 w-4" />
                                Selecionar Imagem
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                disabled={isSubmitting}
                            />
                            {imagePreview && (
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={imagePreview} />
                                    <AvatarFallback>IMG</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                        {selectedImage && (
                            <p className="text-xs text-muted-foreground">Arquivo selecionado: {selectedImage.name}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Atualizando..." : "Atualizar Usuário"}
                        </Button>
                    </DialogFooter>
                </form>

                {/* Class Selector Modal */}
                <ClassSelectorModal
                    isOpen={isClassModalOpen}
                    onClose={() => setIsClassModalOpen(false)}
                    availableClasses={availableClasses}
                    selectedClassIds={selectedClassIds}
                    onConfirm={handleClassesConfirm}
                    isLoading={isLoadingClasses}
                />
            </DialogContent>
        </Dialog>
    )
}