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
  ChevronsUpDown
} from 'lucide-react';
import { mockCourseService, Course, Trail, Task, Material } from '@/lib/services/mockCourseService';
import { mockSubmissionService } from '@/lib/services/mockSubmissionService';
import { StudentSubmissionsModal } from '@/components/professor/StudentSubmissionsModal';
import CreateKnowledgeTrailModal from '@/components/professor/CreateKnowledgeTrailModal';
import EditKnowledgeTrailModal from '@/components/professor/EditKnowledgeTrailModal';
import CreateTaskModal from '@/components/professor/CreateTaskModal';
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
import DeleteTaskContentService from '@/lib/api/task-content/deleteTaskContent';
import type { Course as ApiCourse } from '@/lib/interfaces/courseInterfaces';
import type { CourseContentSummary, TaskContentSummary } from '@/lib/interfaces/courseContentInterfaces';
import type { EditKnowledgeTrailFormData } from '@/lib/interfaces/knowledgeTrailInterfaces';
import type { TaskFormData } from '@/lib/interfaces/taskInterfaces';
import type { TaskContentFormData } from '@/lib/interfaces/taskContentInterfaces';

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
  
  const [selectedTrail, setSelectedTrail] = useState<ContentItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<ContentItem | null>(null);
  const [taskMaterials, setTaskMaterials] = useState<Material[]>([]);
  const [isTrailModalOpen, setIsTrailModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isEditTrailModalOpen, setIsEditTrailModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedTaskForSubmissions, setSelectedTaskForSubmissions] = useState<{ id: string; title: string } | null>(null);
  
  const [editTrail, setEditTrail] = useState<EditKnowledgeTrailFormData | null>(null);
  
  // Estados para contexto do modal de criar trilha
  const [trailModalContext, setTrailModalContext] = useState<{
    courseId?: string;
    sectionId?: string;
  }>({});
  
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
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'teórica' as 'teórica' | 'prática' | 'projeto' | 'avaliação',
    difficulty: 'Iniciante' as 'Iniciante' | 'Intermediário' | 'Avançado',
    estimatedTime: ''
  });
  
  const [editTask, setEditTask] = useState({
    id: '',
    title: '',
    description: '',
    type: 'teórica' as 'teórica' | 'prática' | 'projeto' | 'avaliação',
    difficulty: 'Iniciante' as 'Iniciante' | 'Intermediário' | 'Avançado',
    estimatedTime: ''
  });
  
  const [newMaterial, setNewMaterial] = useState({
    type: 'text' as 'text' | 'video' | 'link' | 'file',
    title: '',
    content: '',
    url: '',
    file: null as File | null
  });

  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  const handleDeleteTrail = (trailId: string) => {
    const success = mockCourseService.deleteTrail(trailId);
    if (success) {
      loadContent();
      toast.success('Trilha removida com sucesso', {
        description: 'A trilha e todos os seus conteúdos foram excluídos permanentemente.'
      });
    } else {
      toast.error('Erro ao excluir trilha', {
        description: 'Não foi possível remover a trilha. Tente novamente.'
      });
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    if (!selectedKnowledgeTrailForTask) {
      toast.error('❌ Erro: Trilha de conhecimento não selecionada');
      return;
    }

    try {
      // Prepare payload - difficultyLevel is always required, dueDate only for ranked trails
      const payload: any = {
        courseId: selectedKnowledgeTrailForTask.courseId,
        knowledgeTrailId: selectedKnowledgeTrailForTask.id,
        name: data.name,
        description: data.description,
        difficultyLevel: data.difficultyLevel
      };

      // Add dueDate only for ranked trails
      if (selectedKnowledgeTrailForTask.isRanked && data.dueDate) {
        const dueDateISO = new Date(data.dueDate + 'T23:59:59.000Z').toISOString();
        payload.dueDate = dueDateISO;
      }
      
      await CreateTaskService(payload);

      toast.success('✅ Tarefa criada com sucesso', {
        description: 'A tarefa foi adicionada à trilha e está disponível.'
      });

      // Recarrega o conteúdo do curso mantendo o curso selecionado
      if (selectedCourseId) {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      }

      setSelectedKnowledgeTrailForTask(null);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('❌ Erro ao criar tarefa', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde'
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

  const handleDeleteTaskContent = async (contentId: number, contentName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o conteúdo "${contentName}"?`)) {
      return;
    }

    try {
      await DeleteTaskContentService(contentId);

      toast.success('✅ Conteúdo excluído com sucesso', {
        description: `O material "${contentName}" foi removido.`
      });

      // Recarrega o conteúdo do curso mantendo o curso selecionado
      if (selectedCourseId) {
        const content = await CourseContentSummaryService(parseInt(selectedCourseId));
        setCourseContent(content);
      }
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error);
      toast.error('❌ Erro ao excluir material', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde'
      });
    }
  };

  const handleEditTask = () => {
    if (!editTask.id) return;

    const success = mockCourseService.updateTask(editTask.id, {
      title: editTask.title,
      description: editTask.description,
      type: editTask.type,
      difficulty: editTask.difficulty,
      estimatedTime: editTask.estimatedTime
    });

    if (success) {
      loadContent();
      setIsEditTaskModalOpen(false);
      toast.success('Tarefa atualizada com sucesso', {
        description: 'As alterações foram salvas e aplicadas à tarefa.'
      });
    } else {
      toast.error('Erro ao atualizar tarefa', {
        description: 'Não foi possível salvar as alterações. Tente novamente.'
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const success = mockCourseService.deleteTask(taskId);
    if (success) {
      loadContent();
      toast.success('Tarefa removida com sucesso', {
        description: 'A tarefa e todos os seus materiais foram excluídos permanentemente.'
      });
    } else {
      toast.error('Erro ao excluir tarefa', {
        description: 'Não foi possível remover a tarefa. Tente novamente.'
      });
    }
  };

  const loadTaskMaterials = (taskId: string) => {
    const materials = mockCourseService.getMaterialsByTaskId(taskId);
    setTaskMaterials(materials);
  };

  const handleCreateMaterial = () => {
    if (!selectedTask) {
      toast.error('❌ Selecione uma tarefa primeiro');
      return;
    }

    if (!newMaterial.title.trim()) {
      toast.error('❌ Título do material é obrigatório');
      return;
    }

    let materialData: any = {
      taskId: selectedTask.id,
      type: newMaterial.type,
      title: newMaterial.title
    };

    if (newMaterial.type === 'text') {
      if (!newMaterial.content.trim()) {
        toast.error('❌ Conteúdo é obrigatório para material de texto');
        return;
      }
      materialData.content = newMaterial.content;
    } else if (newMaterial.type === 'video' || newMaterial.type === 'link') {
      if (!newMaterial.url.trim()) {
        toast.error('❌ URL é obrigatória');
        return;
      }
      materialData.url = newMaterial.url;
    } else if (newMaterial.type === 'file') {
      if (!newMaterial.file) {
        toast.error('❌ Arquivo é obrigatório');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        materialData.fileData = reader.result;
        materialData.fileName = newMaterial.file?.name;
        mockCourseService.addMaterial(materialData);
        resetMaterialForm();
        loadContent();
        if (selectedTask) {
          loadTaskMaterials(selectedTask.id);
        }
        setIsMaterialModalOpen(false);
        toast.success('Material adicionado com sucesso', {
          description: 'O material foi vinculado à tarefa e está disponível para os alunos.'
        });
      };
      reader.readAsDataURL(newMaterial.file);
      return;
    }

    mockCourseService.addMaterial(materialData);
    resetMaterialForm();
    loadContent();
    loadTaskMaterials(selectedTask.id);
    setIsMaterialModalOpen(false);
    toast.success('Material adicionado com sucesso', {
      description: 'O material foi vinculado à tarefa e está disponível para os alunos.'
    });
  };

  const handleDeleteMaterial = (materialId: string) => {
    const success = mockCourseService.removeMaterial(materialId);
    if (success) {
      loadContent();
      if (selectedTask) {
        loadTaskMaterials(selectedTask.id);
      }
      toast.success('Material removido com sucesso', {
        description: 'O material foi excluído permanentemente da tarefa.'
      });
    } else {
      toast.error('Erro ao excluir material', {
        description: 'Não foi possível remover o material. Tente novamente.'
      });
    }
  };

  const resetMaterialForm = () => {
    setNewMaterial({
      type: 'text',
      title: '',
      content: '',
      url: '',
      file: null
    });
    setEditingMaterial(null);
  };

  const startEditingMaterial = (material: Material) => {
    setEditingMaterial(material);
    setNewMaterial({
      type: material.type,
      title: material.title,
      content: material.content || '',
      url: material.url || '',
      file: null
    });
  };

  const saveEditedMaterial = () => {
    if (!editingMaterial) return;

    let updateData: any = {
      type: newMaterial.type,
      title: newMaterial.title
    };
    if (newMaterial.type === 'text') {
      updateData.content = newMaterial.content;
      updateData.url = undefined;
      updateData.fileData = undefined;
      updateData.fileName = undefined;
    } else if (newMaterial.type === 'video' || newMaterial.type === 'link') {
      updateData.url = newMaterial.url;
      updateData.content = undefined;
      updateData.fileData = undefined;
      updateData.fileName = undefined;
    } else if (newMaterial.type === 'file') {
      if (newMaterial.file) {
        const reader = new FileReader();
        reader.onload = () => {
          updateData.fileData = reader.result;
          updateData.fileName = newMaterial.file?.name;
          updateData.content = undefined;
          updateData.url = undefined;
          
          const success = mockCourseService.updateMaterial(editingMaterial.id, updateData);
          if (success) {
            loadContent();
            if (selectedTask) {
              loadTaskMaterials(selectedTask.id);
            }
            setIsMaterialModalOpen(false);
            resetMaterialForm();
            toast.success('Material atualizado com sucesso', {
              description: 'As alterações foram salvas e aplicadas ao material.'
            });
          } else {
            toast.error('Erro ao atualizar material', {
              description: 'Não foi possível salvar as alterações. Tente novamente.'
            });
          }
        };
        reader.readAsDataURL(newMaterial.file);
        return;
      } else {
        updateData.content = undefined;
        updateData.url = undefined;
      }
    }

    const success = mockCourseService.updateMaterial(editingMaterial.id, updateData);

    if (success) {
      loadContent();
      if (selectedTask) {
        loadTaskMaterials(selectedTask.id);
      }
      setIsMaterialModalOpen(false);
      resetMaterialForm();
      toast.success('Material atualizado com sucesso', {
        description: 'As alterações foram salvas e aplicadas ao material.'
      });
    } else {
      toast.error('Erro ao atualizar material', {
        description: 'Não foi possível salvar as alterações. Tente novamente.'
      });
    }
  };

  const viewMaterial = (material: Material) => {
    setViewingMaterial(material);
    setIsViewModalOpen(true);
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    try {
      if (url.includes('embed/')) {
        return url;
      }
      
      let videoId = '';
      
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0] || '';
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      return url;
    } catch (error) {
      console.error('Erro ao converter URL do YouTube:', error);
      return url;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'locked': return <Lock className="h-4 w-4 text-red-500" />;
      case 'unlocked': return <Unlock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'file': return <Upload className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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
                                    toast.info('Funcionalidade em desenvolvimento');
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <AccordionContent className="px-3 pb-3">
                              {trail.tasks && trail.tasks.length > 0 ? (
                                <Accordion type="multiple" className="space-y-2">
                                  {trail.tasks.map(task => (
                                    <AccordionItem key={task.id} value={`task-${task.id}`} className="border rounded-lg bg-white">
                                      <div className="flex items-center justify-between gap-4 px-3 py-2">
                                        <AccordionTrigger className="py-0 hover:no-underline [&>svg]:ml-2">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-medium text-sm">{task.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                              Ordem: {task.taskOrder}
                                            </Badge>
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
                                              toast.info('Funcionalidade em desenvolvimento');
                                            }}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              toast.info('Funcionalidade em desenvolvimento');
                                            }}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
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
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleDeleteTaskContent(content.id, content.name)}
                                                      className="h-6 w-6 p-0 hover:bg-red-100"
                                                      title="Excluir conteúdo"
                                                    >
                                                      <Trash2 className="h-3 w-3 text-red-600" />
                                                    </Button>
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

      <Dialog open={isEditTaskModalOpen} onOpenChange={setIsEditTaskModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>
          
      <div className="space-y-4">
            <div>
              <Label htmlFor="edit-task-title">Título</Label>
              <Input
                id="edit-task-title"
                value={editTask.title}
                onChange={(e) => setEditTask(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-task-description">Descrição</Label>
              <Textarea
                id="edit-task-description"
                value={editTask.description}
                onChange={(e) => setEditTask(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
                  </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-task-type">Tipo</Label>
                <Select value={editTask.type} onValueChange={(value: any) => setEditTask(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teórica">Teórica</SelectItem>
                    <SelectItem value="prática">Prática</SelectItem>
                    <SelectItem value="projeto">Projeto</SelectItem>
                    <SelectItem value="avaliação">Avaliação</SelectItem>
                  </SelectContent>
                </Select>
                    </div>
              
              <div>
                <Label htmlFor="edit-task-difficulty">Dificuldade</Label>
                <Select value={editTask.difficulty} onValueChange={(value: any) => setEditTask(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iniciante">Iniciante</SelectItem>
                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                    <SelectItem value="Avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
                    </div>
                  </div>
            
            <div>
              <Label htmlFor="edit-task-time">Tempo Estimado</Label>
              <Input
                id="edit-task-time"
                value={editTask.estimatedTime}
                onChange={(e) => setEditTask(prev => ({ ...prev, estimatedTime: e.target.value }))}
              />
            </div>
                </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditTaskModalOpen(false)}>
              Cancelar
                  </Button>
            <Button onClick={handleEditTask}>
              Salvar Alterações
                  </Button>
                </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMaterialModalOpen} onOpenChange={(open) => {
        setIsMaterialModalOpen(open);
        if (!open) resetMaterialForm();
      }}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <span className="text-gray-900">Gerenciar Materiais</span>
                <p className="text-sm font-normal text-gray-600 mt-1">
                  {selectedTask?.title || 'Tarefa'} • Adicione materiais de aprendizagem
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-6 h-[75vh]">
            <div className="w-2/5 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Materiais de Aprendizagem</h3>
                  <p className="text-sm text-gray-500">Gerencie todos os materiais desta tarefa</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                  {taskMaterials.length} material(is)
                      </Badge>
                    </div>
              
              <div className="space-y-3">
                {taskMaterials.map(material => (
                  <Card key={material.id} className="group p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-blue-50 rounded-lg">
                        {getTypeIcon(material.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">{material.title}</h4>
                        <div className="space-y-2">
                          {material.type === 'text' && material.content && (
                            <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
                              {material.content.substring(0, 100)}...
                        </p>
                      )}
                          {material.type === 'video' && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">🎥 Vídeo</Badge>
                          )}
                          {material.type === 'link' && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">🔗 Link</Badge>
                          )}
                          {material.type === 'file' && material.fileName && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">📄 {material.fileName}</Badge>
                      )}
                    </div>
                  </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewMaterial(material)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingMaterial(material)}
                          className="h-8 w-8 p-0 hover:bg-yellow-50"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4 text-yellow-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
          </Card>
        ))}

                {(!taskMaterials.length) && (
                  <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
                    <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Nenhum material adicionado</h4>
                    <p className="text-sm text-gray-500 mb-4">Use o formulário ao lado para adicionar o primeiro material</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Começar a adicionar
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            <div className="w-3/5 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingMaterial ? 'Editar Material' : 'Adicionar Novo Material'}
              </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingMaterial ? 'Modifique as informações do material' : 'Preencha os dados do novo material'}
                  </p>
                </div>
                {editingMaterial && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetMaterialForm}
                    className="flex items-center gap-2 border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4" />
                    Novo Material
                  </Button>
                )}
              </div>

              <Card className="p-6 border-2 border-gray-100">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="material-type" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Tipo de Material
                      </Label>
                      <Select value={newMaterial.type} onValueChange={(value: any) => setNewMaterial(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">📄 Texto</SelectItem>
                          <SelectItem value="video">🎥 Vídeo</SelectItem>
                          <SelectItem value="link">🔗 Link</SelectItem>
                          <SelectItem value="file">📁 Arquivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="material-title" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Título *
                      </Label>
                      <Input
                        id="material-title"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Digite o título do material"
                        className={`h-11 ${!newMaterial.title.trim() ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      />
                      {!newMaterial.title.trim() && (
                        <p className="text-xs text-red-500 mt-1">Título é obrigatório</p>
                      )}
                    </div>
                  </div>
                  
                  {newMaterial.type === 'text' && (
                    <div>
                      <Label htmlFor="material-content" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Conteúdo *
                      </Label>
                      <Textarea
                        id="material-content"
                        value={newMaterial.content}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Digite o conteúdo do material..."
                        rows={8}
                        className="resize-none border-gray-300 focus:border-blue-500"
                      />
                      {!newMaterial.content.trim() && (
                        <p className="text-xs text-red-500 mt-1">Conteúdo é obrigatório</p>
                      )}
                    </div>
                  )}
                  
                  {(newMaterial.type === 'video' || newMaterial.type === 'link') && (
                    <div>
                      <Label htmlFor="material-url" className="text-sm font-semibold text-gray-700 mb-2 block">
                        URL *
                      </Label>
                      <Input
                        id="material-url"
                        value={newMaterial.url}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://exemplo.com"
                        className="h-11 border-gray-300 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
                        {newMaterial.type === 'video' ? '🎥 Cole o link do YouTube ou outro vídeo' : '🔗 Cole o link que deseja compartilhar'}
                      </p>
                    </div>
                  )}
                  
                  {newMaterial.type === 'file' && (
                    <div>
                      <Label htmlFor="material-file" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Arquivo *
                      </Label>
                      <Input
                        id="material-file"
                        type="file"
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        className="cursor-pointer h-11 border-gray-300 focus:border-blue-500"
                      />
                      {newMaterial.file && (
                        <div className="mt-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Upload className="h-5 w-5 text-green-600" />
                            <div>
                              <span className="text-sm font-semibold text-green-800">{newMaterial.file.name}</span>
                              <p className="text-xs text-green-600 mt-1">
                                Arquivo selecionado com sucesso
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(newMaterial.title || newMaterial.content || newMaterial.url) && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">Preview do Material</Label>
                      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            {getTypeIcon(newMaterial.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{newMaterial.title || 'Sem título'}</h4>
                            {newMaterial.type === 'text' && newMaterial.content && (
                              <p className="text-sm text-gray-600 line-clamp-3 bg-white p-3 rounded border">
                                {newMaterial.content}
                              </p>
                            )}
                            {newMaterial.type === 'video' && newMaterial.url && (
                              <div className="flex items-center gap-2 bg-white p-3 rounded border">
                                <span className="text-lg">🎥</span>
                                <span className="text-sm text-blue-600 font-medium">{newMaterial.url}</span>
                              </div>
                            )}
                            {newMaterial.type === 'link' && newMaterial.url && (
                              <div className="flex items-center gap-2 bg-white p-3 rounded border">
                                <span className="text-lg">🔗</span>
                                <span className="text-sm text-green-600 font-medium">{newMaterial.url}</span>
                              </div>
                            )}
                            {newMaterial.type === 'file' && newMaterial.file && (
                              <div className="flex items-center gap-2 bg-white p-3 rounded border">
                                <span className="text-lg">📁</span>
                                <span className="text-sm text-purple-600 font-medium">{newMaterial.file.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
          </Card>
                    </div>
        )}
      </div>
              </Card>

              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-6 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                {editingMaterial ? (
                  <Button 
                    onClick={saveEditedMaterial} 
                    className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCreateMaterial}
                    disabled={!newMaterial.title.trim() || (newMaterial.type === 'text' && !newMaterial.content.trim()) || ((newMaterial.type === 'video' || newMaterial.type === 'link') && !newMaterial.url.trim()) || (newMaterial.type === 'file' && !newMaterial.file)}
                    className="px-6 h-11 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Material
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewingMaterial && getTypeIcon(viewingMaterial.type)}
              {viewingMaterial?.title || 'Visualizar Material'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            {viewingMaterial && (
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-blue-600">
                      {getTypeIcon(viewingMaterial.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{viewingMaterial.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {viewingMaterial.type === 'text' && (
                          <Badge variant="outline">📄 Texto</Badge>
                        )}
                        {viewingMaterial.type === 'video' && (
                          <Badge variant="outline">🎥 Vídeo</Badge>
                        )}
                        {viewingMaterial.type === 'link' && (
                          <Badge variant="outline">🔗 Link</Badge>
                        )}
                        {viewingMaterial.type === 'file' && (
                          <Badge variant="outline">📁 Arquivo</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  {viewingMaterial.type === 'text' && (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {viewingMaterial.content}
                      </div>
                    </div>
                  )}

                  {viewingMaterial.type === 'video' && viewingMaterial.url && (
                    <div className="space-y-4">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={getYouTubeEmbedUrl(viewingMaterial.url)}
                          title={viewingMaterial.title}
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onError={(e) => {
                            console.error('Erro ao carregar vídeo:', e);
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Se o vídeo não carregar, você pode assistir diretamente no YouTube:
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => window.open(viewingMaterial.url, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Abrir no YouTube
                        </Button>
                      </div>
                    </div>
                  )}

                  {viewingMaterial.type === 'link' && viewingMaterial.url && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Link className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-medium">Link Externo</p>
                            <p className="text-sm text-gray-600 break-all">{viewingMaterial.url}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <Button
                          onClick={() => window.open(viewingMaterial.url, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Abrir Link
                        </Button>
                      </div>
                    </div>
                  )}

                  {viewingMaterial.type === 'file' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-gray-600" />
                          <div>
                            <p className="font-medium">{viewingMaterial.fileName || 'Arquivo'}</p>
                            <p className="text-sm text-gray-600">Arquivo anexado</p>
                          </div>
                        </div>
                      </div>
                      
                      {viewingMaterial.fileData && viewingMaterial.fileName?.toLowerCase().endsWith('.pdf') && (
                        <div className="border rounded-lg overflow-hidden">
                          <iframe
                            src={viewingMaterial.fileData}
                            title={viewingMaterial.title}
                            className="w-full h-96"
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-3 justify-center">
                        <Button
                          onClick={() => {
                            if (viewingMaterial.fileData) {
                              const link = document.createElement('a');
                              link.href = viewingMaterial.fileData;
                              link.download = viewingMaterial.fileName || 'arquivo';
                              link.click();
                            }
                          }}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Baixar Arquivo
                        </Button>
                        <Button
                          onClick={() => window.open(viewingMaterial.fileData || viewingMaterial.url, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Abrir em Nova Aba
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
