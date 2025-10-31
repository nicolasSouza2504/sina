"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  BookOpen, 
  Plus, 
  Search,
  Eye, 
  Edit, 
  Trash2,
  FileText, 
  Video, 
  Link, 
  Upload,
  Clock,
  Lock,
  Unlock,
  CheckCircle,
  ExternalLink,
  Download,
  Users,
  Trophy,
  Check,
  ChevronsUpDown,
  ArrowUpDown
} from 'lucide-react';
import { mockCourseService, Course, Trail, Task, Material } from '@/lib/services/mockCourseService';
import { mockSubmissionService } from '@/lib/services/mockSubmissionService';
import { StudentSubmissionsModal } from '@/components/professor/StudentSubmissionsModal';
import CreateKnowledgeTrailModal from '@/components/professor/CreateKnowledgeTrailModal';
import EditKnowledgeTrailModal from '@/components/professor/EditKnowledgeTrailModal';
import CreateTaskModal from '@/components/professor/CreateTaskModal';
import ReorderTasksModal from '@/components/professor/ReorderTasksModal';
import EditTaskModal from '@/components/professor/EditTaskModal';
import UpdateTaskOrderService from '@/lib/api/task/updateTaskOrder';
import UpdateTaskService, { UpdateTaskPayload } from '@/lib/api/task/updateTask';
import type { DifficultyLevel } from '@/lib/interfaces/taskInterfaces';
import CreateTaskContentModal from '@/components/KnowledgeTrail/CreateTaskContentModal';
import TaskMaterialsModal from '@/components/KnowledgeTrail/TaskMaterialsModal';
import ViewTaskContentModal from '@/components/KnowledgeTrail/ViewTaskContentModal';
import QuickActions from '@/components/admin/quickActions';
import { toast } from 'sonner';
import CourseList from '@/lib/api/course/courseList';
import CreateKnowledgeTrailService from '@/lib/api/knowledgetrail/createKnowledgeTrail';
import UpdateKnowledgeTrailService from '@/lib/api/knowledgetrail/updateKnowledgeTrail';
import CourseContentSummaryService from '@/lib/api/course/courseContentSummary';
import CreateTaskService from '@/lib/api/task/createTask';
import CreateTaskContentService from '@/lib/api/task-content/createTaskContent';
import type { Course as ApiCourse } from '@/lib/interfaces/courseInterfaces';
import type { EditKnowledgeTrailFormData } from '@/lib/interfaces/knowledgeTrailInterfaces';
import type { TaskFormData } from '@/lib/interfaces/taskInterfaces';
import type { TaskContentFormData } from '@/lib/interfaces/taskContentInterfaces';
import type { TaskSummary, CourseContentSummary, TaskContentSummary } from '@/lib/interfaces/courseContentInterfaces';

interface ContentItem {
  id: string;
  type: 'trilha' | 'tarefa' | 'material';
  title: string;
  description: string;
  courseId?: string;
  courseName?: string;
  semesterId?: string;
  semesterName?: string;
  trailId?: string;
  trailName?: string;
  taskId?: string;
  taskName?: string;
  materials?: Material[];
  tasks?: Task[];
  difficulty?: string;
  estimatedTime?: string;
  status?: string;
}

export default function GerenciarConteudo() {
  const router = useRouter();
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCourseCombobox, setOpenCourseCombobox] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  
  // Estados para API real
  const [apiCourses, setApiCourses] = useState<ApiCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [courseContent, setCourseContent] = useState<CourseContentSummary | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  
  const [isTrailModalOpen, setIsTrailModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditTrailModalOpen, setIsEditTrailModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedTaskForSubmissions, setSelectedTaskForSubmissions] = useState<{ id: string; title: string } | null>(null);
  
  // Estado para edição de tarefa
  const [editTask, setEditTask] = useState<{
    id: number;
    name: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    dueDate?: string;
    courseId: number;
    knowledgeTrailId: number;
    taskOrder: number;
    isRanked: boolean;
  } | null>(null);
  
  const [editTrail, setEditTrail] = useState<EditKnowledgeTrailFormData | null>(null);
  
  // Estados para contexto do modal de criar trilha
  const [trailModalContext, setTrailModalContext] = useState<{
    courseId?: string;
    sectionId?: string;
  }>({});
  
  // Estados para reordenação de tarefas
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [selectedTrailForReorder, setSelectedTrailForReorder] = useState<{
    id: number;
    name: string;
    tasks: TaskSummary[];
  } | null>(null);
  
  // Estados para criação de tarefa
  const [selectedKnowledgeTrailForTask, setSelectedKnowledgeTrailForTask] = useState<{
    id: number;
    name: string;
    courseId: number;
    courseName: string;
    isRanked: boolean;
  } | null>(null);

  // Estados para criação de conteúdo de tarefa
  const [selectedTaskForContent, setSelectedTaskForContent] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isTaskContentModalOpen, setIsTaskContentModalOpen] = useState(false);

  // Estados para visualização de materiais
  const [selectedTaskForMaterials, setSelectedTaskForMaterials] = useState<{
    id: number;
    name: string;
    materials: TaskContentSummary[];
  } | null>(null);
  const [isTaskMaterialsModalOpen, setIsTaskMaterialsModalOpen] = useState(false);

  // Estados para visualização direta de conteúdo
  const [selectedContentForView, setSelectedContentForView] = useState<TaskContentSummary | null>(null);
  const [isViewContentModalOpen, setIsViewContentModalOpen] = useState(false);
  
  // Estados mock removidos - usando apenas componentes com API real

  // Carrega cursos da API real
  useEffect(() => {
    const loadApiCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const courses = await CourseList();
        if (courses) {
          setApiCourses(courses);
        }
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        toast.error('Erro ao carregar cursos da API');
      } finally {
        setIsLoadingCourses(false);
      }
    };
    
    loadApiCourses();
  }, []);

  // Carrega conteúdo do curso quando selecionado
  useEffect(() => {
    const loadCourseContent = async () => {
      if (!selectedCourseId) {
        setCourseContent(null);
        setSearchTerm(''); // Limpa o filtro quando não há curso selecionado
        return;
      }

      setIsLoadingContent(true);
      setSearchTerm(''); // Limpa o filtro ao trocar de curso
      try {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      } catch (error) {
        console.error('Erro ao carregar conteúdo do curso:', error);
        toast.error('Erro ao carregar conteúdo do curso');
        setCourseContent(null);
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadCourseContent();
  }, [selectedCourseId]);

  useEffect(() => {
    const allTrails = mockCourseService.getAllTrails();
    const needsReset = allTrails.some(trail => !trail.tasks);
    
    if (needsReset) {
      mockCourseService.resetDataWithNewStructure();
    } else {
      mockCourseService.createSampleData();
    }
    
    const allCourses = mockCourseService.getAllCourses();
    setCourses(allCourses.map(c => ({ id: c.id, name: c.title })));
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadContent();
    }
  }, [selectedCourseId]);

  const loadContent = () => {
    if (!selectedCourseId) return;
    
    const allTrails = mockCourseService.getAllTrails();
    const allTrailsFormatted: ContentItem[] = [];

    allTrails.forEach(trail => {
      if (trail.courseId === selectedCourseId) {
        const course = mockCourseService.getCourseById(trail.courseId);
        if (course) {
          const tasksWithMaterials = trail.tasks?.map(task => {
            const materials = mockCourseService.getMaterialsByTaskId(task.id);
            return {
              ...task,
              materials: materials
            };
          }) || [];

          allTrailsFormatted.push({
            id: trail.id,
      type: 'trilha',
            title: trail.title,
            courseId: course.id,
            courseName: course.title,
            semesterId: trail.semesterNumber?.toString() || '',
            semesterName: trail.semesterNumber ? `${trail.semesterNumber}º Semestre` : 'Sem semestre',
            description: trail.description,
            tasks: tasksWithMaterials
          });
        }
      }
    });

    setContent(allTrailsFormatted);
  };

  // Filtra apenas tarefas por nome quando há filtro ativo
  const filteredSections = courseContent?.sections
    .map(section => ({
      ...section,
      knowledgeTrails: section.knowledgeTrails
        .map(trail => ({
          ...trail,
          tasks: searchTerm 
            ? trail.tasks.filter(task => 
                task.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : trail.tasks // Sem filtro, mostra todas as tarefas
        }))
        .filter(trail => searchTerm ? trail.tasks.length > 0 : true) // Remove trilhas vazias apenas se houver filtro
    }))
    .filter(section => searchTerm ? section.knowledgeTrails.length > 0 : true) || []; // Remove sections vazias apenas se houver filtro

  const handleCreateTrail = async (data: { name: string; sectionId: number; ranked: boolean }) => {
    try {
      const response = await CreateKnowledgeTrailService(data);
      
      toast.success('✅ Trilha de conhecimento criada com sucesso', {
        description: 'A trilha foi adicionada e está disponível para uso.'
      });
      
      // Recarrega o conteúdo do curso
      if (selectedCourseId) {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao criar trilha:', error);
      toast.error('❌ Erro ao criar trilha de conhecimento', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde'
      });
      throw error;
    }
  };

  const handleReorderTasks = async (reorderedTasks: { taskId: number; newOrder: number }[]) => {
    try {
      await UpdateTaskOrderService(reorderedTasks);
      
      toast.success('✅ Ordem das tarefas atualizada', {
        description: 'As tarefas foram reordenadas com sucesso.'
      });

      // Recarrega o conteúdo do curso
      if (selectedCourseId) {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      }
    } catch (error) {
      console.error('Erro ao reordenar tarefas:', error);
      toast.error('❌ Erro ao reordenar tarefas', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      throw error;
    }
  };

  const handleEditTrail = async (data: { id: number; name: string; sectionId: number; ranked: boolean }) => {
    try {
      await UpdateKnowledgeTrailService(data.id, {
        name: data.name,
        sectionId: data.sectionId,
        ranked: data.ranked
      });
      
      toast.success('✅ Trilha atualizada com sucesso', {
        description: 'As alterações foram salvas e aplicadas à trilha.'
      });
      
      // Recarrega o conteúdo do curso
      if (selectedCourseId) {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      }
      
      setEditTrail(null);
      setIsEditTrailModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar trilha:', error);
      toast.error('❌ Erro ao atualizar trilha de conhecimento', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde'
      });
      throw error;
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    if (!selectedKnowledgeTrailForTask) return;

    try {
      // Busca a trilha atual para calcular o próximo order
      const currentTrail = courseContent?.sections
        .flatMap(s => s.knowledgeTrails)
        .find(kt => kt.id === selectedKnowledgeTrailForTask.id);
      
      // Calcula o próximo order (maior order atual + 1)
      const nextOrder = currentTrail && currentTrail.tasks.length > 0
        ? Math.max(...currentTrail.tasks.map(t => t.taskOrder)) + 1
        : 1;

      const payload: any = {
        courseId: selectedKnowledgeTrailForTask.courseId,
        knowledgeTrailId: selectedKnowledgeTrailForTask.id,
        name: data.name,
        description: data.description,
        difficultyLevel: data.difficultyLevel,
        taskOrder: nextOrder // Adiciona o order automaticamente
      };

      // Adiciona dueDate apenas para trilhas ranqueadas
      if (selectedKnowledgeTrailForTask.isRanked && data.dueDate) {
        const dueDateISO = new Date(data.dueDate + 'T23:59:59.000Z').toISOString();
        payload.dueDate = dueDateISO;
      }

      await CreateTaskService(payload);
      
      toast.success('✅ Tarefa criada com sucesso', {
        description: 'A tarefa foi adicionada à trilha de conhecimento.'
      });

      // Recarrega o conteúdo do curso mantendo o curso selecionado
      if (selectedCourseId) {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('❌ Erro ao criar tarefa', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      throw error;
    }
  };

  const handleCreateTaskContent = async (data: TaskContentFormData) => {
    if (!selectedTaskForContent) {
      toast.error('❌ Erro: Tarefa não selecionada');
      return;
    }

    // Validação condicional: arquivo obrigatório exceto para LINK
    if (data.taskContentType !== 'LINK' && !data.file) {
      toast.error('❌ Erro: Arquivo é obrigatório');
      return;
    }

    // Validação para LINK: URL obrigatória
    if (data.taskContentType === 'LINK' && !data.link?.trim()) {
      toast.error('❌ Erro: URL do link é obrigatória');
      return;
    }

    try {
      const payload: any = {
        taskId: selectedTaskForContent.id,
        name: data.name,
        taskContentType: data.taskContentType
      };

      // Adiciona link se for tipo LINK
      if (data.taskContentType === 'LINK' && data.link) {
        payload.link = data.link;
      }

      console.log('📤 Enviando payload:', payload);
      console.log('📎 Arquivo:', data.file ? data.file.name : 'null (sem arquivo)');

      await CreateTaskContentService(payload, data.file);

      toast.success('✅ Material adicionado com sucesso', {
        description: 'O material foi vinculado à tarefa e está disponível.'
      });

      // Recarrega o conteúdo do curso mantendo o curso selecionado
      if (selectedCourseId) {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      }

      setSelectedTaskForContent(null);
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error);
      toast.error('❌ Erro ao adicionar material', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde'
      });
      throw error;
    }
  };

  // Função de deletar conteúdo removida conforme solicitado

  const handleEditTask = async (data: {
    id: number;
    name: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    dueDate?: string;
    courseId: number;
    knowledgeTrailId: number;
    taskOrder: number;
  }) => {
    try {
      const payload: UpdateTaskPayload = {
        courseId: data.courseId,
        knowledgeTrailId: data.knowledgeTrailId,
        name: data.name,
        description: data.description,
        difficultyLevel: data.difficultyLevel,
        taskOrder: data.taskOrder
      };

      // Adiciona dueDate se existir (para trilhas ranqueadas)
      if (data.dueDate) {
        const dueDateISO = new Date(data.dueDate + 'T23:59:59.000Z').toISOString();
        payload.dueDate = dueDateISO;
      }

      await UpdateTaskService(data.id, payload);
      
      toast.success('✅ Tarefa atualizada com sucesso');
      
      // Recarrega o conteúdo do curso
      if (selectedCourseId) {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('❌ Erro ao atualizar tarefa', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde'
      });
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciar Conteúdo</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Organize trilhas de conhecimento, tarefas e materiais</p>
          </div>
        <Button 
          onClick={() => {
            setTrailModalContext({
              courseId: selectedCourseId || undefined,
              sectionId: undefined
            });
            setIsTrailModalOpen(true);
          }} 
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Trilha
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="w-full">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Selecionar Curso</Label>
          <Popover open={openCourseCombobox} onOpenChange={setOpenCourseCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCourseCombobox}
                className="w-full justify-between h-11 text-left font-normal"
                disabled={isLoadingCourses}
              >
                <span className="truncate">
                  {selectedCourseId
                    ? apiCourses.find((course) => course.id.toString() === selectedCourseId)?.name
                    : isLoadingCourses ? "Carregando cursos..." : "Selecione um curso"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar curso..." />
                <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {apiCourses.map((course) => (
                    <CommandItem
                      key={course.id}
                      value={course.name}
                      onSelect={() => {
                        setSelectedCourseId(course.id.toString());
                        setOpenCourseCombobox(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 shrink-0 ${
                          selectedCourseId === course.id.toString() ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span className="truncate">{course.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        {selectedCourseId && (
          <div className="w-full">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Filtrar Tarefas</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Digite o nome da tarefa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2 text-xs hover:bg-gray-100"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {!selectedCourseId ? (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-6 sm:px-10">
          <span className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />
          <span className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-indigo-200/50 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 animate-pulse">
              <BookOpen className="h-12 w-12 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Selecione um curso para começar</h3>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">
              Escolha um curso no seletor acima para visualizar e organizar trilhas, tarefas e materiais. Tudo fica em um só lugar para facilitar o planejamento das aulas.
            </p>

            <div className="mt-10 grid gap-4 px-2 sm:grid-cols-3">
              {[{
                title: 'Trilhas de conhecimento',
                description: 'Acompanhe o progresso das trilhas alvo de cada semestre.',
                icon: <BookOpen className="h-5 w-5" />,
                accent: 'from-blue-500/10 to-blue-600/10'
              }, {
                title: 'Tarefas e atividades',
                description: 'Planeje desafios e mantenha o histórico de atividades.',
                icon: <CheckCircle className="h-5 w-5" />,
                accent: 'from-green-500/10 to-green-600/10'
              }, {
                title: 'Materiais centralizados',
                description: 'Vídeos, links e arquivos acessíveis a um clique.',
                icon: <FileText className="h-5 w-5" />,
                accent: 'from-purple-500/10 to-purple-600/10'
              }].map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 p-5 shadow-sm transition transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-inner shadow-black/5 text-blue-600">
                      {feature.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-gray-900 sm:text-base">{feature.title}</h4>
                      <p className="mt-1 text-xs text-gray-600 sm:text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 inline-flex items-center gap-3 rounded-full bg-white/70 px-5 py-2 text-sm font-medium text-blue-600 shadow-sm shadow-blue-500/10">
              <div className="flex h-3 w-3 animate-ping rounded-full bg-blue-500" />
              Aguarde — selecione um curso para desbloquear o painel de conteúdo
            </div>
          </div>
        </div>
      ) : isLoadingContent ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Carregando conteúdo...</h3>
          <p className="text-gray-600">Aguarde enquanto buscamos as trilhas e tarefas</p>
        </div>
      ) : courseContent ? (
        <div className="space-y-4">
          {searchTerm && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-900 flex-1">
                Filtrando por: <strong>"{searchTerm}"</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-100"
              >
                Limpar filtro
              </Button>
            </div>
          )}
          
          {searchTerm && filteredSections.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-sm text-gray-600 mb-4">
                Não encontramos tarefas com o termo "{searchTerm}"
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm('')}
              >
                Limpar filtro
              </Button>
            </div>
          ) : filteredSections.length > 0 ? (
            <Accordion type="multiple" className="space-y-3">
              {filteredSections.map((section) => (
                <AccordionItem key={section.id} value={`section-${section.id}`} className="border rounded-lg bg-white">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <BookOpen className="h-5 w-5 flex-shrink-0" />
                      <span className="font-semibold text-base sm:text-lg">{section.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {section.knowledgeTrails?.length || 0} {section.knowledgeTrails?.length === 1 ? 'trilha' : 'trilhas'}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {section.knowledgeTrails && section.knowledgeTrails.length > 0 ? (
                      <Accordion type="multiple" className="space-y-2">
                        {section.knowledgeTrails.map(trail => (
                          <AccordionItem key={trail.id} value={`trail-${trail.id}`} className="border-l-4 border-l-blue-500 rounded-lg bg-blue-50/30">
                            <div className="flex items-center justify-between gap-4 px-3 py-2">
                              <AccordionTrigger className="py-0 hover:no-underline [&>svg]:ml-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-medium text-sm sm:text-base">{trail.name}</span>
                                  {trail.ranked && (
                                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 text-xs">
                                      <Trophy className="h-3 w-3 mr-1" />
                                      Rankeada
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className={`text-xs ${searchTerm ? 'bg-green-50 text-green-700 border-green-300' : ''}`}>
                                    {trail.tasks.length} {trail.tasks.length === 1 ? 'tarefa' : 'tarefas'}
                                    {searchTerm && ' encontrada' + (trail.tasks.length === 1 ? '' : 's')}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedKnowledgeTrailForTask({
                                      id: trail.id,
                                      name: trail.name,
                                      courseId: courseContent.id,
                                      courseName: courseContent.name,
                                      isRanked: trail.ranked || false
                                    });
                                    setIsTaskModalOpen(true);
                                  }}
                                  className="h-8 px-2 text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">Nova</span>
                                </Button>
                                <Button
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const section = courseContent.sections.find(s => 
                                      s.knowledgeTrails.some(kt => kt.id === trail.id)
                                    );
                                    
                                    setEditTrail({
                                      id: trail.id,
                                      name: trail.name,
                                      sectionId: section?.id || 0,
                                      sectionName: section?.name || '',
                                      ranked: trail.ranked || false
                                    });
                                    setIsEditTrailModalOpen(true);
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTrailForReorder({
                                      id: trail.id,
                                      name: trail.name,
                                      tasks: trail.tasks
                                    });
                                    setIsReorderModalOpen(true);
                                  }}
                                  className="h-8 px-2 text-xs"
                                  title="Reordenar tarefas"
                                >
                                  <ArrowUpDown className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">Ordem</span>
                                </Button>
                              </div>
                            </div>
                            <AccordionContent className="px-3 pb-3">
                              {trail.tasks && trail.tasks.length > 0 ? (
                                <Accordion type="multiple" className="space-y-2">
                                  {[...trail.tasks].sort((a, b) => a.taskOrder - b.taskOrder).map(task => (
                                    <AccordionItem key={task.id} value={`task-${task.id}`} className="border rounded-lg bg-white">
                                      <div className="flex items-center justify-between gap-4 px-3 py-2">
                                        <AccordionTrigger className="py-0 hover:no-underline [&>svg]:ml-2">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
                                              {task.taskOrder}
                                            </span>
                                            <span className="font-medium text-sm">{task.name}</span>
                                            {task.contents && task.contents.length > 0 && (
                                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                                {task.contents.length} {task.contents.length === 1 ? 'material' : 'materiais'}
                                              </Badge>
                                            )}
                                          </div>
                                        </AccordionTrigger>
                                        <div className="flex gap-1 flex-shrink-0">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setSelectedTaskForContent({
                                                id: task.id,
                                                name: task.name
                                              });
                                              setIsTaskContentModalOpen(true);
                                            }}
                                            className="h-8 px-2 text-xs hover:bg-purple-50 hover:border-purple-300"
                                          >
                                            <Upload className="h-3 w-3 mr-1" />
                                            <span className="hidden sm:inline">Mat</span>
                                          </Button>
                                          {task.contents && task.contents.length > 0 && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                setSelectedTaskForMaterials({
                                                  id: task.id,
                                                  name: task.name,
                                                  materials: task.contents
                                                });
                                                setIsTaskMaterialsModalOpen(true);
                                              }}
                                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                                            >
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                          )}
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              // Encontrar a trilha para pegar courseId e isRanked
                                              const trailData = courseContent?.sections
                                                .flatMap(s => s.knowledgeTrails)
                                                .find(kt => kt.tasks.some(t => t.id === task.id));
                                              
                                              setEditTask({
                                                id: task.id,
                                                name: task.name,
                                                description: task.description,
                                                difficultyLevel: task.difficultyLevel || 'MEDIO',
                                                dueDate: task.dueDate,
                                                courseId: courseContent?.id || 0,
                                                knowledgeTrailId: trailData?.id || 0,
                                                taskOrder: task.taskOrder,
                                                isRanked: trailData?.ranked || false
                                              });
                                              setIsEditTaskModalOpen(true);
                                            }}
                                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                                            title="Editar tarefa"
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          {/* Botões de excluir tarefa e conteúdo ocultados temporariamente */}
                                        </div>
                                      </div>
                                      <AccordionContent className="px-3 pb-2">
                                        <p className="text-xs sm:text-sm text-gray-600 mb-3">{task.description}</p>
                                        {task.contents && task.contents.length > 0 && (
                                          <div className="space-y-2">
                                            <h4 className="text-xs font-medium text-gray-700 flex items-center gap-2">
                                              <FileText className="h-3 w-3" />
                                              Conteúdos ({task.contents.length})
                                            </h4>
                                            <div className="space-y-1">
                                              {task.contents.map(content => (
                                                <div key={content.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border text-xs">
                                                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                                                    {content.contentType}
                                                  </Badge>
                                                  <span className="text-gray-900 font-medium truncate flex-1 min-w-0">
                                                    {content.name}
                                                  </span>
                                                  <div className="flex items-center gap-1 flex-shrink-0">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {
                                                        setSelectedContentForView(content);
                                                        setIsViewContentModalOpen(true);
                                                      }}
                                                      className="h-6 w-6 p-0 hover:bg-purple-100"
                                                      title="Visualizar conteúdo"
                                                    >
                                                      <Eye className="h-3 w-3 text-purple-600" />
                                                    </Button>
                                                    {/* Botão de excluir conteúdo ocultado temporariamente */}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </AccordionContent>
                                    </AccordionItem>
                                  ))}
                                </Accordion>
                              ) : (
                                <div className="text-center py-6 text-gray-500">
                                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                  <p className="text-sm">Nenhuma tarefa criada nesta trilha</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={() => {
                                      setSelectedKnowledgeTrailForTask({
                                        id: trail.id,
                                        name: trail.name,
                                        courseId: courseContent.id,
                                        courseName: courseContent.name,
                                        isRanked: trail.ranked || false
                                      });
                                      setIsTaskModalOpen(true);
                                    }}
                                  >
                                    <Plus className="h-3 w-3 mr-2" />
                                    Criar Primeira Tarefa
                                  </Button>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <BookOpen className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Nenhuma trilha neste semestre</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTrailModalContext({
                              courseId: courseContent?.id.toString(),
                              sectionId: section.id.toString()
                            });
                            setIsTrailModalOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          Criar Trilha
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Nenhuma seção encontrada</h3>
              <p className="text-sm text-gray-600 mb-4">Este curso ainda não possui seções configuradas</p>
            </div>
          )}
        </div>
      ) : null}

      <CreateKnowledgeTrailModal
        open={isTrailModalOpen}
        onOpenChange={(open) => {
          setIsTrailModalOpen(open);
          if (!open) {
            setTrailModalContext({});
          }
        }}
        courses={apiCourses}
        isLoadingCourses={isLoadingCourses}
        onSubmit={handleCreateTrail}
        prefilledCourseId={trailModalContext.courseId}
        prefilledSectionId={trailModalContext.sectionId}
      />

      <EditKnowledgeTrailModal
        open={isEditTrailModalOpen}
        onOpenChange={setIsEditTrailModalOpen}
        trail={editTrail}
        onSubmit={handleEditTrail}
      />

      {selectedKnowledgeTrailForTask && (
        <CreateTaskModal
          open={isTaskModalOpen}
          onOpenChange={(open) => {
            setIsTaskModalOpen(open);
            if (!open) {
              setSelectedKnowledgeTrailForTask(null);
            }
          }}
          courseId={selectedKnowledgeTrailForTask.courseId}
          courseName={selectedKnowledgeTrailForTask.courseName}
          knowledgeTrailId={selectedKnowledgeTrailForTask.id}
          knowledgeTrailName={selectedKnowledgeTrailForTask.name}
          isRanked={selectedKnowledgeTrailForTask.isRanked}
          onSubmit={handleCreateTask}
        />
      )}

      {selectedTaskForContent && (
        <CreateTaskContentModal
          open={isTaskContentModalOpen}
          onOpenChange={(open) => {
            setIsTaskContentModalOpen(open);
            if (!open) {
              setSelectedTaskForContent(null);
            }
          }}
          taskId={selectedTaskForContent.id}
          taskName={selectedTaskForContent.name}
          onSubmit={handleCreateTaskContent}
        />
      )}

      {selectedTaskForMaterials && (
        <TaskMaterialsModal
          open={isTaskMaterialsModalOpen}
          onOpenChange={(open) => {
            setIsTaskMaterialsModalOpen(open);
            if (!open) {
              setSelectedTaskForMaterials(null);
            }
          }}
          taskName={selectedTaskForMaterials.name}
          materials={selectedTaskForMaterials.materials}
        />
      )}

      {selectedContentForView && (
        <ViewTaskContentModal
          open={isViewContentModalOpen}
          onOpenChange={(open) => {
            setIsViewContentModalOpen(open);
            if (!open) {
              setSelectedContentForView(null);
            }
          }}
          contentName={selectedContentForView.name}
          contentType={selectedContentForView.contentType}
          contentUrl={selectedContentForView.contentUrl}
        />
      )}

      {selectedTrailForReorder && (
        <ReorderTasksModal
          open={isReorderModalOpen}
          onOpenChange={(open) => {
            setIsReorderModalOpen(open);
            if (!open) {
              setSelectedTrailForReorder(null);
            }
          }}
          tasks={selectedTrailForReorder.tasks}
          trailName={selectedTrailForReorder.name}
          onSubmit={handleReorderTasks}
        />
      )}

      {editTask && (
        <EditTaskModal
          open={isEditTaskModalOpen}
          onOpenChange={(open) => {
            setIsEditTaskModalOpen(open);
            if (!open) {
              setEditTask(null);
            }
          }}
          task={editTask}
          onSubmit={handleEditTask}
        />
      )}

      {/* MODAIS INLINE REMOVIDOS - USANDO COMPONENTES */}
      {/* EditTaskModal, MaterialModal e ViewModal agora são componentes */}

      {/* Modal de Entregas dos Alunos */}
      {selectedTaskForSubmissions && (
        <StudentSubmissionsModal
          isOpen={isSubmissionsModalOpen}
          onClose={() => {
            setIsSubmissionsModalOpen(false);
            setSelectedTaskForSubmissions(null);
          }}
          taskId={selectedTaskForSubmissions.id}
          taskTitle={selectedTaskForSubmissions.title}
        />
      )}

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
