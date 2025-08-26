"use client"

import { useState } from "react"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"
import {useRouter} from "next/navigation"
import {toast} from "sonner";

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (data: any) => {
        setIsLoading(true)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("Login data:", data)
        setIsLoading(false)
    }

    const handleGoToRegister = () => {
        toast("Redirecionando para o cadastro")
        router.push("/register")
    }

    return (
        <AuthCard
            title="Entrar"
            description="Digite suas credenciais para acessar sua conta"
            footerText="Não tem uma conta?"
            footerLinkText="Cadastre-se"
            onFooterLinkClick={handleGoToRegister}
        >
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </AuthCard>
    )
}
