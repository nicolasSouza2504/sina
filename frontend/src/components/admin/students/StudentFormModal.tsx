"use client"

import type React from "react"
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
import { Upload, AlertCircle } from "lucide-react"
import { z } from "zod"
import createUser from "@/lib/api/user/userCreate";
import {toast} from "sonner";

// Schema de validação com Zod
const studentSchema = z.object({
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

interface StudentFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (e: React.FormEvent) => void
}

export function StudentFormModal({ isOpen, onClose, onSuccess }: StudentFormModalProps) {
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
            studentSchema.parse({
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
            // O role "STUDENT" corresponde ao valor 3 no enum Roles
            await createUser(userData, "STUDENT", selectedImage)

            toast.success("Aluno cadastrado com sucesso!")
            resetForm()
            onClose()
            onSuccess?.(e)

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
                console.error("[StudentFormModal] Erro ao cadastrar aluno:", error)
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
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
                    <DialogDescription>Preencha os dados do aluno para cadastro no sistema</DialogDescription>
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
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Digite a senha"
                                className={errors.password ? "border-red-500" : ""}
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
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, "") })}
                                placeholder="00000000000"
                                maxLength={11}
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="institution">Instituição</Label>
                        <Input
                            id="institution"
                            value="SENAI Joinville"
                            disabled
                            className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">Instituição padrão para novos alunos</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Foto do Aluno</Label>
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
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Cadastrando..." : "Cadastrar Aluno"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}