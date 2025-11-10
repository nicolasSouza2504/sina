"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Upload, AlertCircle, Users, X, Plus, Edit, Calendar, Key } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { UserData } from "@/lib/interfaces/userInterfaces"
import { Class } from "@/lib/interfaces/classInterfaces"
import { z } from "zod"
import { toast } from "sonner"
import UpdateUserService from "@/lib/api/user/userUpdate";
import ClassList from "@/lib/api/class/classList"
import { ClassSelectorModal } from "../students/ClassSelectorModal"

interface EditTeacherModalProps {
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

export function EditTeacherModal({ isOpen, onClose, onSuccess, user }: EditTeacherModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cpf: "",
        roleId: 2, // Always TEACHER
        password: "",
    })
    const [updatePassword, setUpdatePassword] = useState(false)
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
                roleId: 2, // Always preset to TEACHER
                password: "",
            })
            setUpdatePassword(false)
            // Set selected classes from user data
            const userClassIds = user.classes?.map(cls => cls.id) || []
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
                console.error("[EditTeacherModal] Erro ao carregar turmas:", error)
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
            // Validar senha se checkbox marcado
            if (updatePassword && !formData.password) {
                setErrors({ password: "Senha é obrigatória quando marcado para atualizar" })
                return
            }
            if (updatePassword && formData.password.length < 6) {
                setErrors({ password: "Senha deve ter no mínimo 6 caracteres" })
                return
            }

            // Validar dados com Zod
            updateUserSchema.parse({
                name: formData.name,
                email: formData.email,
                cpf: formData.cpf,
                roleId: 2, // Always TEACHER
            })

            setIsSubmitting(true)

            const userData = {
                name: formData.name,
                email: formData.email,
                cpf: formData.cpf,
                roleId: 2, // Always TEACHER
                classesId: selectedClassIds.length > 0 ? selectedClassIds : undefined,
                ...(updatePassword && formData.password ? { password: formData.password } : {}),
            }

            await UpdateUserService(userData, user.id, selectedImage)

            toast.success("Professor atualizado com sucesso!")
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
                console.error("[EditTeacherModal] Erro ao atualizar usuário:", error)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: "", email: "", cpf: "", roleId: 2, password: "" })
        setSelectedImage(null)
        setImagePreview(null)
        setErrors({})
        setSelectedClassIds([])
        setUpdatePassword(false)
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
            <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <div className="relative">
                    <DialogHeader className="pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-600 rounded-xl">
                                <Edit className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    Editar Professor
                                </DialogTitle>
                                <p className="text-sm text-gray-600 mt-1">Atualize as informações do professor</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Nome Completo <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: João Silva"
                                className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
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
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="professor@senai.br"
                                className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700">
                                CPF <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="cpf"
                                value={formatCPF(formData.cpf)}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, "") })}
                                placeholder="000.000.000-00"
                                maxLength={14}
                                className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
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
                            <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                                Tipo de Usuário
                            </Label>
                            <Input
                                id="role"
                                value="TEACHER"
                                disabled
                                className="h-12 bg-gray-100 border-2 border-gray-200 cursor-not-allowed rounded-xl"
                            />
                            <p className="text-xs text-gray-500">Tipo de usuário fixo</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="institution" className="text-sm font-semibold text-gray-700">
                            Instituição
                        </Label>
                        <Input
                            id="institution"
                            value="SENAI Joinville"
                            disabled
                            className="h-12 bg-gray-100 border-2 border-gray-200 cursor-not-allowed rounded-xl"
                        />
                        <p className="text-xs text-gray-500">Instituição padrão</p>
                    </div>

                    {/* Password Update Section */}
                    <div className="space-y-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="updatePassword"
                                checked={updatePassword}
                                onCheckedChange={(checked) => {
                                    setUpdatePassword(checked as boolean)
                                    if (!checked) {
                                        setFormData({ ...formData, password: "" })
                                        setErrors({ ...errors, password: "" })
                                    }
                                }}
                                disabled={isSubmitting}
                            />
                            <Label htmlFor="updatePassword" className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2">
                                <Key className="h-4 w-4 text-amber-600" />
                                Desejo atualizar a senha
                            </Label>
                        </div>
                        
                        {updatePassword && (
                            <div className="space-y-2 mt-3">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Nova Senha <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Digite a nova senha"
                                    className="h-12 border-2 border-gray-200 hover:border-amber-300 focus:border-amber-500 transition-colors rounded-xl"
                                    disabled={isSubmitting}
                                />
                                {errors.password && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.password}</span>
                                    </div>
                                )}
                                <p className="text-xs text-gray-600">Mínimo de 6 caracteres</p>
                            </div>
                        )}
                    </div>

                    {/* Class Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Turmas do Professor
                        </Label>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsClassModalOpen(true)}
                            className="w-full h-12 justify-start border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors rounded-xl"
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
                        <Label className="text-sm font-semibold text-gray-700">Foto do Professor</Label>
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors rounded-xl"
                                disabled={isSubmitting}
                            >
                                <Upload className="h-4 w-4 mr-2" />
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
                            <p className="text-xs text-gray-500">Arquivo selecionado: {selectedImage.name}</p>
                        )}
                    </div>

                    {/* Footer com Botões */}
                    <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Atualizando...
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Atualizar Professor
                                </>
                            )}
                        </Button>
                    </div>
                    </form>
                </div>

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
