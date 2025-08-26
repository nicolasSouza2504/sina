    "use client"

import { useState } from "react"
import { AuthCard } from "@/components/auth/auth-card"
import { RegisterForm } from "@/components/auth/register-form"
import {UserRegister, UserRegisterForm} from "@/lib/interfaces/userInterfaces";
import {toast} from "sonner";
import {useRouter} from "next/navigation"
import createUser from "@/lib/api/user/userCreate";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export default function RegisterPage() {
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async (data: UserRegisterForm) => {
        setIsLoading(true);
        const userData: UserRegister = {
            name: data.name,
            email: data.email,
            password: data.password
        }
        try {
            await createUser(data)
            setAlert({ type: "success", message: "Conta criada com sucesso!" })
            setIsLoading(false);
            toast("redirecionando para Login")
            setTimeout(() => {
                router.push("/login")
            }, 3000);
        } catch (err: any) {
            setAlert({ type: "error", message: err.message || "Erro ao criar conta" })
            setIsLoading(false);
        }
    }

    const handleGoToLogin = () => {
        toast("Redirecionando para o Login")
        router.push("/login")
    }

    return (
        <AuthCard
            title="Criar Conta"
            description="Preencha os dados abaixo para criar sua conta"
            footerText="Já tem uma conta?"
            footerLinkText="Faça login"
            onFooterLinkClick={handleGoToLogin}
        >
            {alert && (
                <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mb-4">
                    {alert.type === "error" ? (
                        <XCircle className="h-4 w-4" />
                    ) : (
                        <CheckCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                        {alert.type === "error" ? "Erro" : "Sucesso"}
                    </AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            )}
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </AuthCard>
    )
}
