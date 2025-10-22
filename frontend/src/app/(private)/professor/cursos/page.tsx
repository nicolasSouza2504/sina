"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeleteConfirmation, useDeleteConfirmation } from '@/components/ui/delete-confirmation';
import { SuccessToast } from '@/components/ui/success-message';
import QuickActions from '@/components/admin/quickActions';
import { 
  Lock, 
  Unlock, 
  Play, 
  Pause, 
  ArrowLeft, 
  BookOpen,
  Calendar,
  Users,
  Clock,
  Settings,
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  Save,
  X,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { mockCourseService, Course, Semester } from '@/lib/services/mockCourseService';
import { cn } from '@/lib/utils';

export default function GerenciarCursos() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isAddingSemester, setIsAddingSemester] = useState(false);
  const [isEditingSemester, setIsEditingSemester] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    totalSemesters: 0,
    maxStudents: 0,
    requirements: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'draft'
  });

  const [semesterForm, setSemesterForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const { confirmationState, showDeleteConfirmation, hideDeleteConfirmation, handleConfirm } = useDeleteConfirmation();

  useEffect(() => {
    mockCourseService.createSampleData();
    loadCourses();
  }, []);

  const loadCourses = () => {
    const allCourses = mockCourseService.getAllCourses();
    setCourses(allCourses);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSemesterAction = (courseId: string, semesterNumber: number, action: 'unlock' | 'lock' | 'activate') => {
    setLoading(true);
    
    let success = false;
    switch (action) {
      case 'unlock':
        success = mockCourseService.unlockSemester(courseId, semesterNumber);
        break;
      case 'lock':
        success = mockCourseService.lockSemester(courseId, semesterNumber);
        break;
      case 'activate':
        success = mockCourseService.activateSemester(courseId, semesterNumber);
        break;
    }

    if (success) {
      loadCourses();
      if (selectedCourse?.id === courseId) {
        const updatedCourse = mockCourseService.getCourseById(courseId);
        if (updatedCourse) setSelectedCourse(updatedCourse);
      }
      
      setSuccessMessage({
        title: 'Semestre atualizado com sucesso!',
        message: `O semestre foi ${action === 'unlock' ? 'desbloqueado' : action === 'lock' ? 'bloqueado' : 'ativado'}.`
      });
      setShowSuccess(true);
    }
    
    setLoading(false);
  };

  const handleEditCourse = (course: Course) => {
    setCourseForm({
      title: course.title,
      description: course.description,
      totalSemesters: course.totalSemesters,
      maxStudents: course.maxStudents,
      requirements: course.requirements,
      status: course.status
    });
    setSelectedCourse(course);
    setIsEditingCourse(true);
  };

  const handleSaveCourse = () => {
    if (!selectedCourse) return;
    
    const updatedCourse = {
      ...selectedCourse,
      ...courseForm
    };

    setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
    setSelectedCourse(updatedCourse);
    setIsEditingCourse(false);
    
    setSuccessMessage({
      title: 'Curso atualizado com sucesso!',
      message: `O curso "${updatedCourse.title}" foi atualizado.`
    });
    setShowSuccess(true);
  };

  const handleDeleteCourse = (course: Course) => {
    showDeleteConfirmation(
      'Excluir Curso',
      'Tem certeza que deseja excluir este curso? Todos os semestres e trilhas associadas serão permanentemente removidos.',
      course.title,
      () => {
        // Aqui você implementaria a lógica de exclusão no backend
        setCourses(courses.filter(c => c.id !== course.id));
        if (selectedCourse?.id === course.id) {
          setSelectedCourse(null);
        }
        
        setSuccessMessage({
          title: 'Curso excluído com sucesso!',
          message: `O curso "${course.title}" foi removido.`
        });
        setShowSuccess(true);
      }
    );
  };

  // Função para adicionar novo semestre
  const handleAddSemester = () => {
    if (!selectedCourse) return;
    
    const newSemesterNumber = selectedCourse.semesters.length + 1;
    const newSemester: Semester = {
      number: newSemesterNumber,
      title: semesterForm.title || `Semestre ${newSemesterNumber}`,
      description: semesterForm.description || `Conteúdo do ${newSemesterNumber}º semestre`,
      status: 'locked',
      startDate: semesterForm.startDate,
      endDate: semesterForm.endDate
    };

    const updatedCourse = {
      ...selectedCourse,
      semesters: [...selectedCourse.semesters, newSemester],
      totalSemesters: newSemesterNumber
    };

    setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
    setSelectedCourse(updatedCourse);
    setIsAddingSemester(false);
    
    // Limpa o formulário
    setSemesterForm({ title: '', description: '', startDate: '', endDate: '' });
    
    setSuccessMessage({
      title: 'Semestre adicionado com sucesso!',
      message: `O semestre ${newSemesterNumber} foi adicionado ao curso.`
    });
    setShowSuccess(true);
  };

  // Função para editar semestre
  const handleEditSemester = (semester: Semester) => {
    setSemesterForm({
      title: semester.title,
      description: semester.description || '',
      startDate: semester.startDate || '',
      endDate: semester.endDate || ''
    });
    setEditingSemester(semester);
    setIsEditingSemester(true);
  };

  const handleSaveSemester = () => {
    if (!selectedCourse || !editingSemester) return;

    const updatedSemesters = selectedCourse.semesters.map(s =>
      s.number === editingSemester.number
        ? { ...s, ...semesterForm }
        : s
    );

    const updatedCourse = {
      ...selectedCourse,
      semesters: updatedSemesters
    };

    setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
    setSelectedCourse(updatedCourse);
    setIsEditingSemester(false);
    setEditingSemester(null);
    
    // Limpa o formulário
    setSemesterForm({ title: '', description: '', startDate: '', endDate: '' });
    
    setSuccessMessage({
      title: 'Semestre atualizado com sucesso!',
      message: `O semestre ${editingSemester.number} foi atualizado.`
    });
    setShowSuccess(true);
  };

  // Função para deletar semestre
  const handleDeleteSemester = (semester: Semester) => {
    if (!selectedCourse) return;
    
    showDeleteConfirmation(
      'Excluir Semestre',
      'Tem certeza que deseja excluir este semestre? Todas as trilhas e materiais associados serão permanentemente removidos.',
      `Semestre ${semester.number}`,
      () => {
        const updatedSemesters = selectedCourse.semesters.filter(s => s.number !== semester.number);
        const updatedCourse = {
          ...selectedCourse,
          semesters: updatedSemesters,
          totalSemesters: updatedSemesters.length
        };

        setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
        setSelectedCourse(updatedCourse);
        
        setSuccessMessage({
          title: 'Semestre excluído com sucesso!',
          message: `O semestre ${semester.number} foi removido.`
        });
        setShowSuccess(true);
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'unlocked': return 'bg-blue-100 text-blue-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'unlocked': return 'Desbloqueado';
      case 'locked': return 'Bloqueado';
      default: return 'Desconhecido';
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cursos</h1>
            <p className="text-gray-600 mt-2">Gerencie cursos, semestres e controle de acesso</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <button onClick={() => router.push('/professor/curso/novo')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Curso
            </button>
          </Button>
        </div>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Input
              placeholder="Buscar cursos por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Cursos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Cursos Disponíveis</h2>
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum curso encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  selectedCourse?.id === course.id && "ring-2 ring-blue-500"
                )}
                onClick={() => setSelectedCourse(course)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                        <Badge className={cn("text-xs", getStatusColor(course.status))}>
                          {getStatusText(course.status)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {course.totalSemesters} semestres
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.maxStudents} alunos
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCourse(course);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detalhes do Curso Selecionado */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes do Curso</h2>
          {!selectedCourse ? (
            <Card>
              <CardContent className="p-8 text-center">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecione um curso para ver os detalhes</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Informações do Curso */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedCourse.title}</CardTitle>
                      <CardDescription>{selectedCourse.description}</CardDescription>
                    </div>
                    <Badge className={cn("text-xs", getStatusColor(selectedCourse.status))}>
                      {getStatusText(selectedCourse.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Duração</p>
                      <p className="font-semibold">{selectedCourse.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Semestres</p>
                      <p className="font-semibold">{selectedCourse.totalSemesters}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Máx. Alunos</p>
                      <p className="font-semibold">{selectedCourse.maxStudents}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ano</p>
                      <p className="font-semibold">{selectedCourse.year}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gerenciamento de Semestres */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Semestres</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setIsAddingSemester(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedCourse.semesters.map((semester) => (
                    <div key={semester.number} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {semester.number}
                        </div>
                        <div>
                          <p className="font-medium">{semester.title}</p>
                          <p className="text-sm text-gray-600">{semester.description}</p>
                          {semester.startDate && semester.endDate && (
                            <p className="text-xs text-gray-500">
                              {semester.startDate} - {semester.endDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", getStatusColor(semester.status))}>
                          {getStatusText(semester.status)}
                        </Badge>
                        <div className="flex gap-1">
                          {semester.status !== 'unlocked' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSemesterAction(selectedCourse.id, semester.number, 'unlock')}
                              disabled={loading}
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                          {semester.status !== 'locked' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSemesterAction(selectedCourse.id, semester.number, 'lock')}
                              disabled={loading}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          )}
                          {semester.status !== 'active' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSemesterAction(selectedCourse.id, semester.number, 'activate')}
                              disabled={loading}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditSemester(semester)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSemester(semester)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição de Curso */}
      {isEditingCourse && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Editar Curso
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Atualize as informações do curso</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Título do Curso
                </Label>
                <Input
                  id="title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalSemesters" className="text-sm font-semibold text-gray-700">
                    Total de Semestres
                  </Label>
                  <Input
                    id="totalSemesters"
                    type="number"
                    value={courseForm.totalSemesters}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, totalSemesters: parseInt(e.target.value) }))}
                    className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents" className="text-sm font-semibold text-gray-700">
                    Máximo de Alunos
                  </Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={courseForm.maxStudents}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
                    className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                  Status
                </Label>
                <Select value={courseForm.status} onValueChange={(value: any) => setCourseForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="py-3">Ativo</SelectItem>
                    <SelectItem value="inactive" className="py-3">Inativo</SelectItem>
                    <SelectItem value="draft" className="py-3">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingCourse(false)}
                  className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveCourse}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Novo Semestre */}
      {isAddingSemester && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <PlusCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Adicionar Semestre
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Adicione um novo semestre ao curso</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="semesterTitle" className="text-sm font-semibold text-gray-700">
                  Título do Semestre
                </Label>
                <Input
                  id="semesterTitle"
                  value={semesterForm.title}
                  onChange={(e) => setSemesterForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={`Semestre ${selectedCourse.semesters.length + 1}`}
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semesterDescription" className="text-sm font-semibold text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="semesterDescription"
                  value={semesterForm.description}
                  onChange={(e) => setSemesterForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700">
                    Data de Início
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={semesterForm.startDate}
                    onChange={(e) => setSemesterForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700">
                    Data de Fim
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={semesterForm.endDate}
                    onChange={(e) => setSemesterForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingSemester(false)}
                  className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddSemester}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Semestre
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Edição de Semestre */}
      {isEditingSemester && editingSemester && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar Semestre {editingSemester.number}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingSemester(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="editSemesterTitle">Título do Semestre</Label>
                <Input
                  id="editSemesterTitle"
                  value={semesterForm.title}
                  onChange={(e) => setSemesterForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editSemesterDescription">Descrição</Label>
                <Textarea
                  id="editSemesterDescription"
                  value={semesterForm.description}
                  onChange={(e) => setSemesterForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStartDate">Data de Início</Label>
                  <Input
                    id="editStartDate"
                    type="date"
                    value={semesterForm.startDate}
                    onChange={(e) => setSemesterForm(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editEndDate">Data de Fim</Label>
                  <Input
                    id="editEndDate"
                    type="date"
                    value={semesterForm.endDate}
                    onChange={(e) => setSemesterForm(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveSemester} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setIsEditingSemester(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isVisible={confirmationState.isVisible}
        title={confirmationState.title}
        message={confirmationState.message}
        itemName={confirmationState.itemName}
        onConfirm={handleConfirm}
        onCancel={hideDeleteConfirmation}
      />

      {/* Success Toast */}
      <SuccessToast
        title={successMessage.title}
        message={successMessage.message}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        autoClose={true}
        autoCloseDelay={3000}
      />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}