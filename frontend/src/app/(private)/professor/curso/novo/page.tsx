"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  BookOpen,
  Calendar,
  Users,
  Loader2,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockCourseService } from '@/lib/services/mockCourseService';

export default function NovoCurso() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: 'Análise e Desenvolvimento de Sistemas',
    description: '',
    totalSemesters: 6,
    status: 'active' as const,
    maxStudents: 50,
    requirements: [] as string[]
  });

  const [semesters, setSemesters] = useState([
    { id: 1, title: '1º Semestre', status: 'active', subjects: [] },
    { id: 2, title: '2º Semestre', status: 'locked', subjects: [] },
    { id: 3, title: '3º Semestre', status: 'locked', subjects: [] },
    { id: 4, title: '4º Semestre', status: 'locked', subjects: [] },
    { id: 5, title: '5º Semestre', status: 'locked', subjects: [] },
    { id: 6, title: '6º Semestre', status: 'locked', subjects: [] },
  ]);

  // Atualiza semestres quando totalSemesters muda
  useEffect(() => {
    const newSemesters = [];
    for (let i = 1; i <= formData.totalSemesters; i++) {
      newSemesters.push({
        id: i,
        title: `${i}º Semestre`,
        status: i === 1 ? 'active' : 'locked',
        subjects: []
      });
    }
    setSemesters(newSemesters);
  }, [formData.totalSemesters]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validações obrigatórias
    if (!formData.title.trim()) {
      toast.error('📝 Título obrigatório', {
        description: 'Por favor, preencha o título do curso para continuar.'
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('📋 Descrição obrigatória', {
        description: 'Por favor, adicione uma descrição detalhada do curso.'
      });
      return;
    }
    
    if (!formData.totalSemesters || formData.totalSemesters < 1) {
      toast.error('📚 Número de semestres inválido', {
        description: 'Por favor, informe um número válido de semestres (mínimo 1).'
      });
      return;
    }
    
    if (!formData.maxStudents || formData.maxStudents < 1) {
      toast.error('👥 Capacidade inválida', {
        description: 'Por favor, informe um número válido de alunos (mínimo 1).'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Cria o curso usando o serviço mockado
      const newCourse = mockCourseService.createCourse({
        title: formData.title,
        description: formData.description,
        year: new Date().getFullYear().toString(), // Ano atual
        duration: `${Math.ceil(formData.totalSemesters / 2)} anos`, // Calcula anos baseado em semestres
        totalSemesters: formData.totalSemesters,
        status: formData.status,
        maxStudents: formData.maxStudents,
        requirements: formData.requirements
      });

      console.log('Curso criado:', newCourse);
      
      // Redireciona para página de sucesso com o ID do curso
      router.push(`/professor/curso/${newCourse.id}/sucesso`);
      
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      toast.error('❌ Erro ao criar curso', {
        description: 'Não foi possível criar o curso. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    // Validações obrigatórias para rascunho
    if (!formData.title.trim()) {
      toast.error('📝 Título obrigatório', {
        description: 'Por favor, preencha o título do curso para salvar como rascunho.'
      });
      return;
    }
    
    if (!formData.totalSemesters || formData.totalSemesters < 1) {
      toast.error('📚 Número de semestres inválido', {
        description: 'Por favor, informe um número válido de semestres (mínimo 1).'
      });
      return;
    }
    
    if (!formData.maxStudents || formData.maxStudents < 1) {
      toast.error('👥 Capacidade inválida', {
        description: 'Por favor, informe um número válido de alunos (mínimo 1).'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newCourse = mockCourseService.createCourse({
        title: formData.title,
        description: formData.description,
        year: new Date().getFullYear().toString(),
        duration: `${Math.ceil(formData.totalSemesters / 2)} anos`,
        totalSemesters: formData.totalSemesters,
        status: 'draft',
        maxStudents: formData.maxStudents,
        requirements: formData.requirements
      });

      console.log('Curso salvo como rascunho:', newCourse);
      router.push('/professor/dashboard');
      
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      toast.error('❌ Erro ao salvar rascunho', {
        description: 'Não foi possível salvar o rascunho. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Adicionar Novo Curso</h1>
            <p className="text-gray-600 mt-2">Configure um novo curso personalizado</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleSaveAsDraft}
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
                Criar Curso
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
              <CardDescription>
                Configure os detalhes principais do curso de ADS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do Curso</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Análise e Desenvolvimento de Sistemas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Curso</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva os objetivos e competências do curso..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalSemesters">Total de Semestres</Label>
                  <Input
                    id="totalSemesters"
                    value={formData.totalSemesters}
                    onChange={(e) => handleInputChange('totalSemesters', parseInt(e.target.value))}
                    placeholder="6"
                    type="number"
                    min="1"
                    max="12"
                  />
                  <p className="text-xs text-gray-500">
                    Duração: {Math.ceil(formData.totalSemesters / 2)} ano(s)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Máximo de Alunos</Label>
                  <Input
                    id="maxStudents"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                    placeholder="50"
                    type="number"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Pré-requisitos</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Descreva os pré-requisitos para ingressar no curso..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Semestres */}
          <Card>
            <CardHeader>
              <CardTitle>Estrutura do Curso - {formData.totalSemesters} Semestres</CardTitle>
              <CardDescription>
                Organize os semestres do curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {semesters.map((semester, index) => (
                  <div key={semester.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{semester.title}</h3>
                          <p className="text-sm text-gray-600">
                            {index === 0 ? 'Ativo' : 'Bloqueado até conclusão do anterior'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(semester.status)}>
                        {semester.status === 'active' ? 'Ativo' : 'Bloqueado'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview do Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {formData.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formData.description || 'Descrição do curso...'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Duração:</span>
                    <span>{Math.ceil(formData.totalSemesters / 2)} anos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Semestres:</span>
                    <span>{formData.totalSemesters}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Máx. Alunos:</span>
                    <span>{formData.maxStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Ativo
                    </Badge>
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
