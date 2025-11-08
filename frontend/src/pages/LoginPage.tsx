"use client";
import { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm, LoginFormValues } from "@/components/auth/login-form";
import { useRouter } from "next/navigation";
import {
  Facebook,
  Instagram,
  Linkedin,
  Terminal,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import login from "@/lib/api/auth/login";
import { UserLoginData } from "@/lib/interfaces/userInterfaces";
import { AuthLoginResponse } from "@/lib/interfaces/authInterfaces";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { decodeJwt } from "@/lib/auth/jwtAuth";
import { getDashboardRoute } from "@/lib/auth/roleRedirect";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    const userLoginData: UserLoginData = {
      email: data.email.trim(),
      password: data.password.trim(),
    };
    try {
      const response: AuthLoginResponse = await login(userLoginData);
      console.log("Login bem-sucedido");
      
      // Salvar token e userId
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id.toString());
      
      // Decodificar o token para obter o role do usuário
      const decodedToken = decodeJwt(response.data.token);
      const userRole = Array.isArray(decodedToken?.role) ? decodedToken.role[0] : decodedToken?.role || 'USER';
      
      // Redirecionar para o dashboard apropriado baseado no role
      const dashboardRoute = getDashboardRoute(userRole);
      console.log(`Redirecionando para: ${dashboardRoute} (Role: ${userRole})`);
      router.push(dashboardRoute);
    } catch (e) {
      console.error(e);
      setError(
        "Erro ao fazer login. Verifique suas credenciais e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const closeError = () => {
    setError(null);
  };
  return (
    <div className="h-screen flex overflow-hidden">
      {error && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 w-11/12 md:w-1/2 lg:w-1/3">
          <Alert
            variant="destructive"
            className="relative pr-12 backdrop-blur-2xl text-md py-5 gap-1"
          >
            <AlertTitle className="font-bold text-1xl">Erro</AlertTitle>
            <AlertDescription className="text-md ">{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeError}
              className="absolute  top-2 right-2 h-6 w-6 p-0 hover:bg-destructive-foreground/10 hover:cursor-pointer"
            >
              <X className="size-5" />
            </Button>
          </Alert>
        </div>
      )}
      <div className="hidden lg:flex w-3/5 items-center justify-center bg-gradient-to-br from-sky-500 to-sky-900 relative">
        <div className="max-w-5xl max-h-full">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg text-center pb-5 stroke-3 ">
            {" "}
            Sistema de Controle de Conteúdo{" "}
          </h1>{" "}
          <img
            src="/img/Alunos-senai.png"
            alt="Unisenai Logo"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          <div className="flex gap-20 mt-10 justify-center">
            <div className="flex flex-col items-center justify-center mt-5 ">
              <div className="w-48 h-16 ">
                <img
                  src="/img/sesi-branca.png"
                  alt="Unisenai Logo"
                  className="w-full h-full drop-shadow-2xl "
                />
              </div>
              <div className="flex gap-3 items-center justify-center mt-5 text-white ">
                <Instagram className="hover:cursor-pointer size-7" />
                <Facebook className="hover:cursor-pointer size-7" />
                <Twitter className="hover:cursor-pointer size-7" />
                <Youtube className="hover:cursor-pointer size-7" />
                <Linkedin className="hover:cursor-pointer size-7" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-5">
              <div className="w-58 h-16 justify-center ">
                <img
                  src="/img/senai-branca.png"
                  alt="Unisenai Logo"
                  className="w-full h-full drop-shadow-2xl "
                />
              </div>
              <div className="flex gap-3 items-center justify-center mt-5 text-white ">
                <Instagram className="hover:cursor-pointer size-7" />
                <Facebook className="hover:cursor-pointer size-7" />
                <Twitter className="hover:cursor-pointer size-7" />
                <Youtube className="hover:cursor-pointer size-7" />
                <Linkedin className="hover:cursor-pointer size-7" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl"></div>
      </div>
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-white relative">
        <AuthCard>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </AuthCard>
      </div>
    </div>
  );
}
