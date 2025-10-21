"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  BookOpen, 
  Home,
  PlusCircle,
  Calendar,
  Users,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { mockCourseService, Course } from '@/lib/services/mockCourseService';

export default function CursoSucessoPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (courseId) {
      const loadedCourse = mockCourseService.getCourseById(courseId);
      if (loadedCourse) {
        setCourse(loadedCourse);
      } else {
        // Se não encontrar o curso, redireciona para dashboard
        router.push('/professor/dashboard');
      }
    }
  }, [courseId, router]);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleAddTrails = () => {
    // Redireciona para página de criar trilha, passando o ID do curso e do primeiro semestre
    const firstSemester = course.semesters[0];
    router.push(`/professor/trilha/nova?courseId=${course.id}&semesterId=${firstSemester.id}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Success Message */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="bg-green-100 rounded-full p-6 mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Curso Criado com Sucesso!
        </h1>
        <p className="text-gray-600 max-w-md">
          Seu curso foi criado e está pronto para receber conteúdo. Agora você pode adicionar trilhas de conhecimento para cada semestre.
        </p>
      </div>

      {/* Course Summary */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <CardDescription className="mt-2">
                {course.description || 'Curso de ADS com estrutura completa'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {course.status === 'active' ? 'Ativo' : course.status === 'draft' ? 'Rascunho' : 'Inativo'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duração</p>
                <p className="font-semibold">{course.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Semestres</p>
                <p className="font-semibold">{course.totalSemesters} semestres</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Capacidade</p>
                <p className="font-semibold">{course.maxStudents} alunos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semesters Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estrutura do Curso</CardTitle>
          <CardDescription>
            {course.totalSemesters} semestres criados e prontos para receber trilhas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.semesters.map((semester, index) => (
              <div 
                key={semester.number}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{semester.title}</p>
                    <p className="text-sm text-gray-600">
                      Semestre {semester.number}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={semester.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {semester.status === 'active' ? 'Ativo' : 'Bloqueado'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>
            O que você gostaria de fazer agora?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleAddTrails}
            className="w-full justify-between text-left h-auto p-4"
            size="lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Adicionar Trilhas de Conhecimento</p>
                <p className="text-sm opacity-90">Crie conteúdo de aprendizado para os semestres</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Button>

          <Button 
            variant="outline"
            className="w-full justify-between text-left h-auto p-4"
            size="lg"
            asChild
          >
            <Link href="/professor/cursos">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Ver Detalhes do Curso</p>
                  <p className="text-sm text-gray-600">Visualize as informações completas</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          <Button 
            variant="outline"
            className="w-full justify-between text-left h-auto p-4"
            size="lg"
            asChild
          >
            <Link href="/professor/dashboard">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Voltar ao Dashboard</p>
                  <p className="text-sm text-gray-600">Retornar à página principal</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Dica</p>
            <p className="text-sm text-blue-800">
              Para um melhor aproveitamento, recomendamos adicionar pelo menos 3-4 trilhas de conhecimento 
              por semestre. Cada trilha deve conter materiais diversos como textos, vídeos e links externos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

