"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, AlertCircle, Plus } from "lucide-react"
import { z } from "zod"
import createUser from "@/lib/api/user/userCreate"
import { toast } from "sonner"

// Schema de validação com Zod
const adminSchema = z.object({
    name: z.string()
        .min(3, "Nome deve ter no mínimo 3 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres"),
    email: z.string()
        .email("Email inválido")
        .min(1, "Email é obrigatório"),
    password: z.string()
        .min(6, "Senha deve ter no mínimo 6 caracteres")
        .max(50, "Senha deve ter no máximo 50 caracteres"),
    cpf: z.string()
        .length(11, "CPF deve ter exatamente 11 dígitos")
        .regex(/^\d+$/, "CPF deve conter apenas números"),
    idInstitution: z.number().int().positive("ID da instituição é obrigatório"),
})

interface AdminFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function AdminFormModal({ isOpen, onClose, onSuccess }: AdminFormModalProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cpf: "",
        idInstitution: 1, // SENAI_JOINVILLE fixado
    })

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        try {
            // Validar dados com Zod
            adminSchema.parse({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                cpf: formData.cpf,
                idInstitution: formData.idInstitution,
            })

            setIsSubmitting(true)

            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                cpf: formData.cpf,
                idInstitution: formData.idInstitution, // ID 1 = SENAI_JOINVILLE
                // role será definido no backend através do path parameter
            }

            // Enviar para o backend
            // O role "ADMIN" corresponde ao valor 1 no enum Roles
            await createUser(userData, "ADMIN", selectedImage)

            toast.success("Administrador cadastrado com sucesso!")
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
                console.error("[AdminFormModal] Erro ao cadastrar administrador:", error)
                // Toast de erro já é exibido pela função createUser
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: "", email: "", password: "", cpf: "", idInstitution: 1 })
        setSelectedImage(null)
        setImagePreview(null)
        setErrors({})
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <div className="relative">
                    <DialogHeader className="pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-600 rounded-xl">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    Cadastrar Novo Administrador
                                </DialogTitle>
                                <p className="text-sm text-gray-600 mt-1">Preencha os dados do administrador para cadastro no sistema</p>
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
                                placeholder="admin@senai.br"
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
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                Senha <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Mínimo 6 caracteres"
                                className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700">
                                CPF <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="cpf"
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, "") })}
                                placeholder="00000000000"
                                maxLength={11}
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
                        <p className="text-xs text-gray-500">Instituição padrão para novos administradores</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Foto do Administrador</Label>
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
                                    Cadastrando...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Cadastrar Administrador
                                </>
                            )}
                        </Button>
                    </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
