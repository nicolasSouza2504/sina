"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertCircle, 
  Home, 
  ArrowLeft,
  Search,
  FileQuestion
} from 'lucide-react';
import getUserFromToken from "@/lib/auth/userToken";

export default function NotFound() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const user = await getUserFromToken();
        if (user?.role?.name) {
          setUserRole(user.role.name);
        }
      } catch (error) {
        console.error('Erro ao carregar role do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserRole();
  }, []);

  const getDashboardPath = () => {
    switch (userRole) {
      case "ADMIN":
        return "/admin";
      case "TEACHER":
        return "/professor/dashboard";
      case "STUDENT":
        return "/aluno/dashboard";
      default:
        return "/ranking";
    }
  };

  const handleGoToDashboard = () => {
    const dashboardPath = getDashboardPath();
    router.push(dashboardPath);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-2 border-gray-200 shadow-xl">
          <CardHeader className="text-center pb-6 space-y-4">
            {/* Ícone de erro */}
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <FileQuestion className="h-16 w-16 text-red-600" />
              </div>
            </div>

            {/* Título */}
            <div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
                404
              </CardTitle>
              <h2 className="text-2xl font-semibold text-gray-700">
                Página Não Encontrada
              </h2>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Mensagem de erro */}
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Oops! Esta página não existe
                  </p>
                  <p className="text-sm text-red-800">
                    A página que você está procurando não foi encontrada ou pode ter sido removida.
                  </p>
                </div>
              </div>
            </div>

            {/* Informação adicional */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    O que você pode fazer?
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Verificar se o endereço está correto</li>
                    <li>Voltar para a página anterior</li>
                    <li>Ir para o seu dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full sm:w-auto h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <Button
                onClick={handleGoToDashboard}
                className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir para o Dashboard
              </Button>
            </div>

            {/* Informação do código de erro */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Código de erro: <span className="font-mono font-semibold">404 - Not Found</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
