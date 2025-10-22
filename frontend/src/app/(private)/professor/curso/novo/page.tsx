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
  CheckCircle,
  X,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateCourseService from '@/lib/api/course/createCourse';
import ClassList from '@/lib/api/class/classList';
import ClassSelectorModal from '@/components/admin/courses/ClassSelectorModal';
import type { Class } from '@/lib/interfaces/classInterfaces';

export default function NovoCurso() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    quantitySemester: 6,
    classesId: [] as number[]
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

  // Carrega turmas disponíveis
  useEffect(() => {
    async function loadClasses() {
      try {
        setIsLoadingClasses(true);
        const classes = await ClassList();
        console.log(classes);
        setAvailableClasses(classes || []);
      } catch (error) {
        console.error('Erro ao carregar turmas:', error);
        toast.error('Erro ao carregar turmas disponíveis');
      } finally {
        setIsLoadingClasses(false);
      }
    }
    loadClasses();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClassesConfirm = (selectedIds: number[]) => {
    setFormData(prev => ({
      ...prev,
      classesId: selectedIds
    }));
  };

  const handleRemoveClass = (classId: number) => {
    setFormData(prev => ({
      ...prev,
      classesId: prev.classesId.filter(id => id !== classId)
    }));
  };

  const getImagePath = (imageName: string | null) => {
        if (!imageName) return "/placeholder.svg";
        return `/img/${imageName}`;
  };

  const getSelectedClasses = () => {
    return availableClasses.filter(c => formData.classesId.includes(c.id));
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
    
    if (formData.classesId.length === 0) {
      toast.error('🎓 Selecione ao menos uma turma', {
        description: 'Por favor, selecione pelo menos uma turma para o curso.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Cria o curso usando o serviço da API
      const newCourse = await CreateCourseService({
        name: formData.name,
        quantitySemester: formData.quantitySemester,
        classesId: formData.classesId
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Adicionar Novo Curso</h1>
            <p className="text-gray-600 mt-2">Configure um novo curso e selecione as turmas</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSubmitting || isLoadingClasses}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
              <CardDescription>
                Configure os detalhes principais do curso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Curso *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantitySemester">Quantidade de Semestres *</Label>
                <Input
                  id="quantitySemester"
                  value={formData.quantitySemester}
                  onChange={(e) => handleInputChange('quantitySemester', parseInt(e.target.value) || 1)}
                  placeholder="6"
                  type="number"
                  min="1"
                  max="12"
                />
                <p className="text-xs text-gray-500">
                  Duração estimada: {Math.ceil(formData.quantitySemester / 2)} ano(s)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Turmas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Turmas do Curso *</CardTitle>
                  <CardDescription>
                    Selecione as turmas que farão parte deste curso
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isLoadingClasses || availableClasses.length === 0}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Selecionar Turmas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingClasses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">Carregando turmas...</span>
                </div>
              ) : availableClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Nenhuma turma disponível</p>
                  <p className="text-sm">Crie turmas primeiro para associá-las ao curso</p>
                </div>
              ) : formData.classesId.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Nenhuma turma selecionada</p>
                  <p className="text-sm">Clique no botão acima para selecionar turmas</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">
                      {formData.classesId.length} turma(s) selecionada(s)
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Editar Seleção
                    </Button>
                  </div>
                  {getSelectedClasses().map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {classItem.imgClass && (
                          <img
                            src={getImagePath(classItem.imgClass)}
                            alt={classItem.nome || 'Turma'}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{classItem.nome || 'Sem nome'}</p>
                          <p className="text-sm text-gray-600">
                            {classItem.code && `Código: ${classItem.code}`}
                            {classItem.semester && ` • ${classItem.semester}º Semestre`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveClass(classItem.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estrutura do Curso - Semestres */}
          <Card>
            <CardHeader>
              <CardTitle>Estrutura do Curso - {formData.quantitySemester} Semestres</CardTitle>
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
              <CardTitle>Resumo do Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {formData.name || 'Nome do curso'}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Semestres:</span>
                    <span className="font-medium">{formData.quantitySemester}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duração:</span>
                    <span className="font-medium">{Math.ceil(formData.quantitySemester / 2)} ano(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Turmas:</span>
                    <span className="font-medium">{formData.classesId.length}</span>
                  </div>
                </div>

                {formData.classesId.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Turmas Selecionadas:</p>
                    <div className="space-y-2">
                      {formData.classesId.map((classId) => {
                        const classItem = availableClasses.find(c => c.id === classId);
                        return classItem ? (
                          <div
                            key={classId}
                            className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                          >
                            <span className="truncate flex-1">{classItem.nome}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveClass(classId)}
                              className="h-6 w-6 p-0 ml-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Seleção de Turmas */}
      <ClassSelectorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        availableClasses={availableClasses}
        selectedClassIds={formData.classesId}
        onConfirm={handleClassesConfirm}
        isLoading={isLoadingClasses}
      />
    </div>
  );
}
