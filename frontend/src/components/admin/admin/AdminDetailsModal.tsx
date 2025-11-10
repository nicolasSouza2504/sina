"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, Shield, X, Edit, Rotate3d } from "lucide-react"
import { UserData } from "@/lib/interfaces/userInterfaces"

interface AdminDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    admin: UserData | null
    onEdit: (admin: UserData) => void
    onChangeSituation: (admin: UserData) => void
}

export function AdminDetailsModal({
    isOpen,
    onClose,
    admin,
    onEdit,
    onChangeSituation
}: AdminDetailsModalProps) {
    const formatCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    <DialogHeader className="pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-600 rounded-xl">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    Detalhes do Administrador
                                </DialogTitle>
                                <p className="text-sm text-gray-600 mt-1">Informações completas do administrador</p>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    {admin && (
                        <div className="space-y-6">
                            {/* Informações Pessoais */}
                            <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">
                                        {admin.nome
                                            ?.split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{admin.nome}</h3>
                                    <p className="text-sm text-gray-600">ID: {admin.id}</p>
                                    <Badge className="mt-2">
                                        {admin.role.name === "ADMIN" ? "Administrador" : admin.role.name}
                                    </Badge>
                                </div>
                            </div>

                            {/* Informações de Contato */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="border-2 border-gray-200 rounded-xl">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-blue-600" />
                                            Informações de Contato
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                                            <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CPF</label>
                                            <p className="text-sm font-medium text-gray-900">{formatCPF(admin.cpf)}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 border-gray-200 rounded-xl">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-blue-600" />
                                            Informações do Sistema
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                                            <div className="mt-1">
                                                <Badge 
                                                    variant={admin.status === "ATIVO" ? "default" : "destructive"} 
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    {admin.status === "ATIVO" ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Instituição</label>
                                            <p className="text-sm font-medium text-gray-900">{admin.institutionName || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Informações de Permissões */}
                            <Card className="border-2 border-gray-200 rounded-xl">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                        Permissões e Acesso
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                            <div className="text-2xl font-bold text-blue-600">Total</div>
                                            <div className="text-xs text-blue-600 font-medium">Acesso Completo</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 border border-green-200 rounded-xl">
                                            <div className="text-2xl font-bold text-green-600">Admin</div>
                                            <div className="text-xs text-green-600 font-medium">Nível de Acesso</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-xl">
                                            <div className="text-2xl font-bold text-purple-600">Todas</div>
                                            <div className="text-xs text-purple-600 font-medium">Funcionalidades</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ações */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-gray-100 mt-6">
                                <Button 
                                    className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl" 
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Fechar
                                </Button>
                                <Button 
                                    className="flex-1 h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors rounded-xl" 
                                    variant="outline"
                                    onClick={() => {
                                        onClose();
                                        onEdit(admin);
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                                <Button 
                                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                    onClick={() => {
                                        onClose();
                                        onChangeSituation(admin);
                                    }}
                                >
                                    <Rotate3d className="h-4 w-4 mr-2" />
                                    Alterar Situação
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
