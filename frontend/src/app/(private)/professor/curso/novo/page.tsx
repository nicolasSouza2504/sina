"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  BookOpen,
  Loader2,
  Plus,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateCourseService from '@/lib/api/course/createCourse';

export default function NovoCurso() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    quantitySemester: 6
  });

  const [semesters, setSemesters] = useState([
    { id: 1, title: '1º Semestre', status: 'active', subjects: [] },
    { id: 2, title: '2º Semestre', status: 'locked', subjects: [] },
    { id: 3, title: '3º Semestre', status: 'locked', subjects: [] },
    { id: 4, title: '4º Semestre', status: 'locked', subjects: [] },
    { id: 5, title: '5º Semestre', status: 'locked', subjects: [] },
    { id: 6, title: '6º Semestre', status: 'locked', subjects: [] },
  ]);

  // Atualiza semestres quando quantitySemester muda
  useEffect(() => {
    const newSemesters = [];
    for (let i = 1; i <= formData.quantitySemester; i++) {
      newSemesters.push({
        id: i,
        title: `${i}º Semestre`,
        status: i === 1 ? 'active' : 'locked',
        subjects: []
      });
    }
    setSemesters(newSemesters);
  }, [formData.quantitySemester]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = async () => {
    // Validações obrigatórias
    if (!formData.name.trim()) {
      toast.error('📝 Nome obrigatório', {
        description: 'Por favor, preencha o nome do curso para continuar.'
      });
      return;
    }
    
    if (!formData.quantitySemester || formData.quantitySemester < 1) {
      toast.error('📚 Número de semestres inválido', {
        description: 'Por favor, informe um número válido de semestres (mínimo 1).'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Cria o curso usando o serviço da API
      const newCourse = await CreateCourseService({
        name: formData.name,
        quantitySemester: formData.quantitySemester
      });

      console.log('Curso criado:', newCourse);
      
      toast.success('✅ Curso criado com sucesso!', {
        description: `O curso "${formData.name}" foi criado.`
      });
      
      // Redireciona para dashboard ou lista de cursos
      router.push('/professor/dashboard');
      
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      toast.error('❌ Erro ao criar curso', {
        description: error instanceof Error ? error.message : 'Não foi possível criar o curso. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Título e Descrição */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Adicionar Novo Curso</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Configure um novo curso com suas informações básicas</p>
        </div>
        
        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="w-full sm:w-auto sm:ml-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Criar Curso
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <Card className="bg-white border-2 border-gray-200">
            <CardHeader className='p-4 sm:p-6'>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Informações do Curso
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Configure os detalhes principais do curso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Nome do Curso <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantitySemester" className="text-sm font-semibold text-gray-700">
                  Quantidade de Semestres <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantitySemester"
                  value={formData.quantitySemester}
                  onChange={(e) => handleInputChange('quantitySemester', parseInt(e.target.value) || 1)}
                  placeholder="6"
                  type="number"
                  min="1"
                  max="12"
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
                <p className="text-xs text-gray-500">
                  Duração estimada: {Math.ceil(formData.quantitySemester / 2)} ano(s)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Estrutura do Curso - Semestres */}
          <Card className="bg-white border-2 border-gray-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Estrutura do Curso - {formData.quantitySemester} Semestres
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Organize os semestres do curso
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {semesters.map((semester, index) => (
                  <div key={semester.id} className="border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{semester.title}</h3>
                          <p className="text-sm text-gray-600">
                            {index === 0 ? 'Ativo' : 'Bloqueado até conclusão do anterior'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(semester.status)}>
                        {semester.status === 'active' ? 'Ativo' : 'Bloqueado'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📚 Disciplinas serão configuradas posteriormente</p>
                      <p>⏱️ Duração: 6 meses</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com preview */}
        <div className="space-y-6 order-1 lg:order-2">
          <Card className="bg-white border-2 border-gray-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Resumo do Curso
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {formData.name || 'Nome do curso'}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Semestres:</span>
                    <span className="text-sm font-bold text-gray-900">{formData.quantitySemester}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Duração:</span>
                    <span className="text-sm font-bold text-gray-900">{Math.ceil(formData.quantitySemester / 2)} ano(s)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
