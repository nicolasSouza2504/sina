"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Camera, Save, User, Mail, Lock, CreditCard, Building, Users } from "lucide-react"
import Link from "next/link"
import {UserFromToken, UserUpdate} from "@/lib/interfaces/userInterfaces";
import getUserFromToken from "@/lib/auth/userToken";
import UpdateUserService from "@/lib/api/user/userUpdate";

export default function ProfilePage() {
    const [user, setUser] = useState<UserFromToken | undefined | null>(null);
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: undefined as string | undefined,
        email: undefined as string | undefined,
        password: undefined as string | undefined,
        cpf: undefined as string | undefined,
        image: null as File | null,
    })

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = await getUserFromToken();
                setUser(user)
                setFormData({
                    name: user?.nome,
                    email: user?.email,
                    password: "",
                    cpf: user?.cpf,
                    image: null,
                })
                setImagePreview(null)
            } catch (error) {
                console.error("Error fetching user profile:", error)
                toast.error("Não foi possível carregar os dados do perfil.")
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }))
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const formDataToSend = new FormData()
            if (formData.name) formDataToSend.append("name", formData.name)
            if (formData.email) formDataToSend.append("email", formData.email)
            if (formData.password) {
                formDataToSend.append("password", formData.password)
            }
            if (formData.cpf) {
                formDataToSend.append("cpf", formData.cpf)
            }
            if (formData.image) {
                formDataToSend.append("image", formData.image)
            }
            const userUpdateData:UserUpdate = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            }
            await UpdateUserService(userUpdateData, user!.id, formData.image);
            toast.success("Perfil atualizado com sucesso!")
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Não foi possível atualizar o perfil.")
        } finally {
            setSaving(false)
        }
    }

    const getInitials = (name: string | undefined): string => {
        if (!name) return "?"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) // Limit to 2 characters
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive">Erro ao carregar perfil</h2>
                    <p className="text-muted-foreground mt-2">Não foi possível carregar os dados do usuário.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 w-full">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 sm:gap-4 mb-4 sm:mb-6 text-center">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Meu Perfil</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Atualize suas informações pessoais</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Profile Info Card */}
                <Card className="lg:col-span-1">
                    <CardHeader className="text-center py-4 sm:py-6">
                        <div className="relative mx-auto">
                            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto">
                                <AvatarImage src={imagePreview || undefined} alt={user.nome || "User"} />
                                <AvatarFallback className="text-base sm:text-lg">
                                    {getInitials(user.nome)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-lg sm:text-xl mt-2">{user.nome || "Nome não disponível"}</CardTitle>
                        <CardDescription className="text-sm">{user.email}</CardDescription>
                        <Badge variant="secondary" className="w-fit mx-auto text-xs sm:text-sm">
                            {user.role && user.role.name ? user.role.name : "Sem Função" }
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{user.institutionName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>ID: {user.id}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Update Form */}
                <Card className="lg:col-span-2">
                    <CardHeader className="py-4 sm:py-6">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                            Atualizar Informações
                        </CardTitle>
                        <CardDescription className="text-sm">Modifique seus dados pessoais e foto de perfil</CardDescription>
                    </CardHeader>
                    <CardContent className="py-3 sm:py-4">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-sm">Foto de Perfil</Label>
                                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
                                        <AvatarImage src={imagePreview || undefined} alt="Preview" />
                                        <AvatarFallback>
                                            <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 w-full">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="cursor-pointer text-sm"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Personal Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm">Nome Completo</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleInputChange}
                                            className="pl-10 text-sm"
                                            placeholder="Seu nome completo"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email || ""}
                                            onChange={handleInputChange}
                                            className="pl-10 text-sm"
                                            placeholder="seu.email@exemplo.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cpf" className="text-sm">CPF</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="cpf"
                                            name="cpf"
                                            value={formData.cpf || ""}
                                            onChange={handleInputChange}
                                            className="pl-10 text-sm"
                                            placeholder="000.000.000-00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm">Nova Senha (opcional)</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password || ""}
                                            onChange={handleInputChange}
                                            className="pl-10 text-sm"
                                            placeholder="Deixe em branco para manter a atual"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Submit Button */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                                <Link href="/" className="w-full sm:w-auto">
                                    <Button variant="outline" type="button" className="w-full sm:w-auto" size="sm">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={saving} className="w-full sm:w-auto" size="sm">
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Salvar Alterações
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}