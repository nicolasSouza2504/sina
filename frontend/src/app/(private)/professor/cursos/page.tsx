"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SuccessToast } from '@/components/ui/success-message';
import QuickActions from '@/components/admin/quickActions';
import EditCourseModal from '@/components/professor/EditCourseModal';
import CreateCourseModal from '@/components/professor/CreateCourseModal';
import { 
  ArrowLeft, 
  BookOpen,
  Calendar,
  Users,
  Plus,
  GraduationCap,
  Loader2,
  Edit
} from 'lucide-react';
import { Course } from '@/lib/interfaces/courseInterfaces';
import CourseListService from '@/lib/api/course/courseList';
import UpdateCourseService from '@/lib/api/course/updateCourse';
import { cn } from '@/lib/utils';

export default function GerenciarCursos() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await CourseListService();
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCourse = (course: Course) => {
    setCourseToEdit(course);
    setIsEditModalOpen(true);
  };

  const handleSaveCourse = async (courseId: number, newName: string, quantitySemester: number) => {
    try {
      // Chama a API para atualizar o curso
      await UpdateCourseService({ 
        name: newName, 
        quantitySemester: quantitySemester 
      }, courseId);
      
      // Atualiza localmente após sucesso
      const updatedCourses = courses.map(c => 
        c.id === courseId ? { ...c, name: newName } : c
      );
      setCourses(updatedCourses);
      
      if (selectedCourse?.id === courseId) {
        setSelectedCourse({ ...selectedCourse, name: newName });
      }
      
      setSuccessMessage({
        title: 'Curso atualizado com sucesso!',
        message: `O curso foi atualizado para "${newName}".`
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      throw error; // Repassa o erro para o modal tratar
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} size="sm" className="sm:size-default">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciar Cursos</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Gerencie cursos, semestres e controle de acesso</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Novo Curso
          </Button>
        </div>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <Input
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-10 text-sm sm:text-base border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
              disabled={loading}
            />
            <BookOpen className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Lista de Cursos */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Cursos Disponíveis</h2>
          {loading ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4 animate-spin" />
                <p className="text-sm sm:text-base text-gray-600">Carregando cursos...</p>
              </CardContent>
            </Card>
          ) : filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600">Nenhum curso encontrado</p>
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
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2">{course.name}</h3>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCourse(course);
                        }}
                        className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{course.quantitySemester} sem.</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{course.classes?.length || 0} turmas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{course.sections?.length || 0} seções</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detalhes do Curso Selecionado */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Detalhes do Curso</h2>
          {!selectedCourse ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600">Selecione um curso para ver os detalhes</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {/* Informações do Curso */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 break-words">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        {selectedCourse.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Curso com {selectedCourse.quantitySemester} semestres</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditCourse(selectedCourse)}
                      className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-1">Semestres</p>
                      <p className="font-semibold text-base sm:text-lg">{selectedCourse.quantitySemester}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-1">Turmas</p>
                      <p className="font-semibold text-base sm:text-lg">{selectedCourse.classes?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-1">Seções</p>
                      <p className="font-semibold text-base sm:text-lg">{selectedCourse.sections?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-1">ID do Curso</p>
                      <p className="font-semibold text-base sm:text-lg">{selectedCourse.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seções do Curso */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Seções do Curso
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3">
                  {selectedCourse.sections && selectedCourse.sections.length > 0 ? (
                    selectedCourse.sections.map((section) => (
                      <div key={section.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                          {section.semester}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{section.name}</p>
                          <p className="text-xs text-gray-500">ID: {section.id}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs sm:text-sm">Nenhuma seção cadastrada</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Turmas do Curso */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Turmas Vinculadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3">
                  {selectedCourse.classes && selectedCourse.classes.length > 0 ? (
                    selectedCourse.classes.map((classItem) => (
                      <div key={classItem.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                          {classItem.code?.substring(0, 2) || 'T'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base break-words">{classItem.nome}</p>
                          <p className="text-xs text-gray-500">Código: {classItem.code} | Sem: {classItem.semester}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs sm:text-sm">Nenhuma turma vinculada</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCourseCreated={loadCourses}
      />

      {/* Edit Course Modal */}
      <EditCourseModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        course={courseToEdit}
        onSave={handleSaveCourse}
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