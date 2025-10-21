"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SuccessToast } from '@/components/ui/success-message';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Loader2,
  CheckCircle,
  Info,
  BookOpen,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockCourseService } from '@/lib/services/mockCourseService';

export default function NovaTrilha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Pega courseId da URL se existir
  const urlCourseId = searchParams?.get('courseId') || '';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: urlCourseId || '',
    semesterNumber: '',
    difficulty: '',
    objectives: '',
    estimatedTime: ''
  });

  // Carrega cursos do localStorage
  const [courses, setCourses] = useState<Array<{id: string, name: string}>>([]);
  const [semesters, setSemesters] = useState<Array<{number: number, title: string}>>([]);

  useEffect(() => {
    // Cria dados de exemplo se necessário
    mockCourseService.createSampleData();
    
    // Carrega todos os cursos
    const allCourses = mockCourseService.getAllCourses();
    setCourses(allCourses.map(c => ({ id: c.id, name: c.title })));
  }, []);

  // Carrega semestres quando um curso é selecionado
  useEffect(() => {
    if (formData.courseId) {
      const courseSemesters = mockCourseService.getSemestersByCourseId(formData.courseId);
      setSemesters(courseSemesters.map(s => ({ number: s.number, title: s.title })));
    } else {
      setSemesters([]);
    }
  }, [formData.courseId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validações obrigatórias
    if (!formData.title.trim()) {
      toast.error('📝 Título obrigatório', {
        description: 'Por favor, preencha o título da trilha para continuar.'
      });
      return;
    }

    if (!formData.description.trim()) {
      toast.error('📋 Descrição obrigatória', {
        description: 'Por favor, adicione uma descrição detalhada da trilha.'
      });
      return;
    }

    if (!formData.courseId) {
      toast.error('🎓 Curso não selecionado', {
        description: 'Por favor, selecione um curso para a trilha.'
      });
      return;
    }

    if (!formData.semesterNumber) {
      toast.error('📚 Semestre não selecionado', {
        description: 'Por favor, escolha um semestre para a trilha.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Cria a trilha usando o serviço mockado (sem materiais por enquanto)
      const newTrail = mockCourseService.createTrail({
        courseId: formData.courseId,
        semesterNumber: parseInt(formData.semesterNumber),
        title: formData.title,
        description: formData.description
      });

      console.log('Trilha criada:', newTrail);
      
      // Mostra mensagem de sucesso
      setShowSuccess(true);
      
      // Aguarda um pouco e redireciona para Gerenciar Conteúdo
      setTimeout(() => {
        router.push(`/professor/conteudo?trailId=${newTrail.id}&action=addMaterials`);
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao criar trilha:', error);
      toast.error('❌ Erro ao criar trilha', {
        description: 'Não foi possível criar a trilha. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Trilha de Conhecimento</h1>
            <p className="text-gray-600 mt-2">Crie uma trilha de aprendizado para seus alunos</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar como Rascunho
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Criar Trilha
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Alert se veio de um curso específico */}
      {urlCourseId && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800 font-medium">
            Você está criando uma trilha para o curso recém-criado. O curso já está pré-selecionado.
          </AlertDescription>
        </Alert>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                Informações Básicas da Trilha
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Defina os detalhes principais da sua trilha de conhecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Trilha *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Introdução ao React"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o que os alunos aprenderão nesta trilha..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Curso *</Label>
                  <Select value={formData.courseId} onValueChange={(value) => handleInputChange('courseId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">
                          Nenhum curso disponível
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {courses.length === 0 && (
                    <p className="text-xs text-gray-500">
                      Crie um curso primeiro em "Novo Curso"
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre *</Label>
                  <Select value={formData.semesterNumber} onValueChange={(value) => handleInputChange('semesterNumber', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.length > 0 ? (
                        semesters.map((semester) => (
                          <SelectItem key={semester.number} value={semester.number.toString()}>
                            {semester.number}º - {semester.title}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">
                          {formData.courseId ? 'Nenhum semestre disponível' : 'Selecione um curso primeiro'}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {formData.courseId && semesters.length === 0 && (
                    <p className="text-xs text-gray-500">
                      Este curso não possui semestres configurados
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">Objetivos de Aprendizagem</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  placeholder="Liste os objetivos que os alunos devem alcançar..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Tempo Estimado</Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                  placeholder="Ex: 4 horas"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com preview */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-purple-600" />
                Preview da Trilha
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">
                    {formData.title || 'Título da Trilha'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {formData.description || 'Descrição da trilha...'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Dificuldade:</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      {formData.difficulty || 'Não definida'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Tempo estimado:</span>
                    <span className="text-gray-600 font-semibold">{formData.estimatedTime || 'Não definido'}</span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Info className="h-6 w-6 mr-3 text-yellow-600" />
                Dicas para uma Trilha de Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-yellow-100 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 font-medium">Use títulos claros e objetivos</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-yellow-100 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 font-medium">Defina objetivos de aprendizagem específicos</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-yellow-100 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 font-medium">Indique a dificuldade correta</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-yellow-100 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 font-medium">Estime o tempo de forma realista</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Toast */}
      <SuccessToast
        title="Trilha criada com sucesso!"
        message={`A trilha "${formData.title}" foi criada. Você será redirecionado para adicionar materiais.`}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        autoClose={true}
        autoCloseDelay={1500}
      />
    </div>
  );
}
