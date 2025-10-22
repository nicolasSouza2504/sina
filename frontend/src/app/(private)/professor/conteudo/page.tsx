"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Users
} from 'lucide-react';
import { mockCourseService, Course, Trail, Task, Material } from '@/lib/services/mockCourseService';
import { mockSubmissionService } from '@/lib/services/mockSubmissionService';
import { StudentSubmissionsModal } from '@/components/professor/StudentSubmissionsModal';
import QuickActions from '@/components/admin/quickActions';
import { toast } from 'sonner';

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
  
  const [newTrail, setNewTrail] = useState({
    courseId: '',
    title: '',
    description: '',
    semesterNumber: ''
  });
  
  const [editTrail, setEditTrail] = useState({
    id: '',
    title: '',
    description: '',
    semesterNumber: ''
  });
  
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
    
    if (allCourses.length === 1) {
      setSelectedCourseId(allCourses[0].id);
    }
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

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedBySemester = filteredContent.reduce((acc, trail) => {
    const semesterKey = trail.semesterId || 'sem-semestre';
    const semesterName = trail.semesterName || 'Sem semestre';
    
    if (!acc[semesterKey]) {
      acc[semesterKey] = {
        semesterName,
        trails: []
      };
    }
    
    acc[semesterKey].trails.push(trail);
    return acc;
  }, {} as Record<string, { semesterName: string; trails: ContentItem[] }>);

  const sortedSemesters = Object.entries(groupedBySemester).sort((a, b) => {
    if (a[0] === 'sem-semestre') return 1;
    if (b[0] === 'sem-semestre') return -1;
    return parseInt(a[0]) - parseInt(b[0]);
  });

  const handleCreateTrail = () => {
    if (!newTrail.courseId) {
      toast.error('❌ Selecione um curso');
      return;
    }

    if (!newTrail.title.trim()) {
      toast.error('❌ Título da trilha é obrigatório');
      return;
    }

    if (!newTrail.description.trim()) {
      toast.error('❌ Descrição da trilha é obrigatória');
      return;
    }

    if (!newTrail.semesterNumber) {
      toast.error('❌ Selecione um semestre');
      return;
    }

    mockCourseService.createTrail({
      courseId: newTrail.courseId,
      semesterNumber: parseInt(newTrail.semesterNumber),
      title: newTrail.title,
      description: newTrail.description
    });

    setNewTrail({ courseId: '', title: '', description: '', semesterNumber: '' });
    setIsTrailModalOpen(false);
    
    if (newTrail.courseId === selectedCourseId) {
      loadContent();
    }
    
    toast.success('Trilha de conhecimento criada com sucesso', {
      description: 'A trilha foi adicionada ao curso e está disponível para uso.'
    });
  };

  const handleEditTrail = () => {
    if (!editTrail.id) return;

    const trail = mockCourseService.getTrailById(editTrail.id);
    if (!trail) {
      toast.error('❌ Trilha não encontrada');
      return;
    }

    const allTrails = mockCourseService.getAllTrails();
    const trailIndex = allTrails.findIndex(t => t.id === editTrail.id);
    if (trailIndex !== -1) {
      allTrails[trailIndex] = {
        ...allTrails[trailIndex],
        title: editTrail.title,
        description: editTrail.description,
        semesterNumber: parseInt(editTrail.semesterNumber)
      };
      localStorage.setItem('mockTrails', JSON.stringify(allTrails));
      loadContent();
      setIsEditTrailModalOpen(false);
      toast.success('Trilha atualizada com sucesso', {
        description: 'As alterações foram salvas e aplicadas à trilha.'
      });
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

  const handleCreateTask = () => {
    if (!selectedTrail) {
      toast.error('❌ Selecione uma trilha primeiro');
      return;
    }

    if (!newTask.title.trim()) {
      toast.error('❌ Título da tarefa é obrigatório');
      return;
    }

    if (!newTask.description.trim()) {
      toast.error('❌ Descrição da tarefa é obrigatória');
      return;
    }

    if (!newTask.estimatedTime.trim()) {
      toast.error('❌ Tempo estimado é obrigatório');
      return;
    }

    mockCourseService.createTask({
      trailId: selectedTrail.id,
      title: newTask.title,
      description: newTask.description,
      type: newTask.type,
      difficulty: newTask.difficulty,
      estimatedTime: newTask.estimatedTime,
      status: 'unlocked'
    });

    setNewTask({
      title: '',
      description: '',
      type: 'teórica',
      difficulty: 'Iniciante',
      estimatedTime: ''
    });
    setIsTaskModalOpen(false);
    loadContent();
    toast.success('Tarefa criada com sucesso', {
      description: 'A tarefa foi adicionada à trilha e está pronta para receber materiais.'
    });
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Conteúdo</h1>
          <p className="text-gray-600 mt-2">Organize trilhas de conhecimento, tarefas e materiais</p>
          </div>
        <Button onClick={() => setIsTrailModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Trilha
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione um curso" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
            placeholder="Buscar trilhas, tarefas ou materiais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
      </div>

      {selectedCourseId ? (
        <div className="space-y-6">
          {sortedSemesters.length > 0 ? (
            sortedSemesters.map(([semesterKey, { semesterName, trails }]) => (
              <div key={semesterKey}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {semesterName}
                </h2>
                
                <div className="grid gap-4">
                  {trails.map(trail => (
                    <Card key={trail.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{trail.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{trail.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTrail(trail);
                                setIsTaskModalOpen(true);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Nova Tarefa
              </Button>
              <Button
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditTrail({
                                  id: trail.id,
                                  title: trail.title,
                                  description: trail.description,
                                  semesterNumber: trail.semesterId || ''
                                });
                                setIsEditTrailModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
              </Button>
              <Button
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteTrail(trail.id)}
              >
                              <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          {trail.tasks && trail.tasks.length > 0 ? (
                            trail.tasks.map(task => (
                              <div key={task.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-2 flex-1">
                                    {getStatusIcon(task.status)}
                                    <h3 className="font-medium">{task.title}</h3>
                                    <Badge variant="outline">{task.type}</Badge>
                                    <Badge variant="secondary">{task.difficulty}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                                      variant="outline"
                                      size="sm"
                                        onClick={() => {
                                          setSelectedTask({
                                            id: task.id,
                                            type: 'tarefa',
                                            title: task.title,
                                            description: task.description,
                                            taskId: task.id // Adicionar taskId para referência
                                          });
                                          loadTaskMaterials(task.id); // Carregar materiais da tarefa
                                          setIsMaterialModalOpen(true);
                                        }}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Material
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => {
                                        setSelectedTaskForSubmissions({
                                          id: task.id,
                                          title: task.title
                                        });
                                        setIsSubmissionsModalOpen(true);
                                      }}
                                    >
                                      <Users className="h-4 w-4 mr-1" />
                                      Entregas
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setEditTask({
                                          id: task.id,
                                          title: task.title,
                                          description: task.description,
                                          type: task.type,
                                          difficulty: task.difficulty,
                                          estimatedTime: task.estimatedTime
                                        });
                                        setIsEditTaskModalOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
              </Button>
              <Button
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {task.estimatedTime}
                                  </span>
                                </div>

                                {task.materials && task.materials.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      Materiais ({task.materials.length})
                                    </h4>
                                    <div className="grid gap-2">
                                      {task.materials.map(material => (
                                        <Card key={material.id} className="p-3 hover:shadow-sm transition-shadow">
                                          <div className="flex items-center gap-3">
                                            <div className="text-blue-600">
                                              {getTypeIcon(material.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <h5 className="font-medium text-sm truncate">{material.title}</h5>
                                              <div className="flex items-center gap-2 mt-1">
                                                {material.type === 'text' && material.content && (
                                                  <span className="text-xs text-gray-500 truncate">
                                                    {material.content.substring(0, 50)}...
                                                  </span>
                                                )}
                                                {material.type === 'video' && (
                                                  <Badge variant="outline" className="text-xs">🎥 Vídeo</Badge>
                                                )}
                                                {material.type === 'link' && (
                                                  <Badge variant="outline" className="text-xs">🔗 Link</Badge>
                                                )}
                                                {material.type === 'file' && material.fileName && (
                                                  <Badge variant="outline" className="text-xs">📄 {material.fileName}</Badge>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex gap-1">
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => viewMaterial(material)}
                                                className="h-8 w-8 p-0"
                                              >
                                                <Eye className="h-4 w-4" />
                                              </Button>
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedTask({
                                                    id: task.id,
                                                    type: 'tarefa',
                                                    title: task.title,
                                                    description: task.description,
                                                    taskId: task.id
                                                  });
                                                  loadTaskMaterials(task.id); // Carregar materiais da tarefa
                                                  startEditingMaterial(material);
                                                  setIsMaterialModalOpen(true);
                                                }}
                                                className="h-8 w-8 p-0"
                                              >
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleDeleteMaterial(material.id)}
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>Nenhuma tarefa criada nesta trilha</p>
                              <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                  setSelectedTrail(trail);
                                  setIsTaskModalOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Criar Primeira Tarefa
                              </Button>
                            </div>
                          )}
          </div>
        </CardContent>
      </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma trilha encontrada</h3>
              <p className="text-gray-600 mb-4">Comece criando uma nova trilha de conhecimento</p>
              <Button onClick={() => setIsTrailModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Trilha
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um curso</h3>
          <p className="text-gray-600">Escolha um curso para visualizar e gerenciar seu conteúdo</p>
        </div>
      )}

      <Dialog open={isTrailModalOpen} onOpenChange={setIsTrailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <DialogHeader className="pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                  </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Nova Trilha de Conhecimento
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">Crie uma nova trilha de aprendizado para seus alunos</p>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="trail-course" className="text-sm font-semibold text-gray-700">
                  Curso
                </Label>
                <Select value={newTrail.courseId} onValueChange={(value) => setNewTrail(prev => ({ ...prev, courseId: value }))}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id} className="py-3">
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trail-title" className="text-sm font-semibold text-gray-700">
                  Título da Trilha
                </Label>
                <Input
                  id="trail-title"
                  value={newTrail.title}
                  onChange={(e) => setNewTrail(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Fundamentos de Programação"
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trail-description" className="text-sm font-semibold text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="trail-description"
                  value={newTrail.description}
                  onChange={(e) => setNewTrail(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva os objetivos desta trilha..."
                  rows={4}
                  className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trail-semester" className="text-sm font-semibold text-gray-700">
                  Semestre
                </Label>
                <Select value={newTrail.semesterNumber} onValueChange={(value) => setNewTrail(prev => ({ ...prev, semesterNumber: value }))}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    <SelectValue placeholder="Selecione um semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {newTrail.courseId && mockCourseService.getCourseById(newTrail.courseId)?.semesters.map(semester => (
                      <SelectItem key={semester.number} value={semester.number.toString()} className="py-3">
                        {semester.number}º - {semester.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsTrailModalOpen(false);
                  setNewTrail({ courseId: '', title: '', description: '', semesterNumber: '' });
                }}
                className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateTrail}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Criar Trilha
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTrailModalOpen} onOpenChange={setIsEditTrailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Editar Trilha
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">Atualize as informações da trilha de conhecimento</p>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-trail-title" className="text-sm font-semibold text-gray-700">
                  Título
                </Label>
                <Input
                  id="edit-trail-title"
                  value={editTrail.title}
                  onChange={(e) => setEditTrail(prev => ({ ...prev, title: e.target.value }))}
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-trail-description" className="text-sm font-semibold text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="edit-trail-description"
                  value={editTrail.description}
                  onChange={(e) => setEditTrail(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-trail-semester" className="text-sm font-semibold text-gray-700">
                  Semestre
                </Label>
                <Select value={editTrail.semesterNumber} onValueChange={(value) => setEditTrail(prev => ({ ...prev, semesterNumber: value }))}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    <SelectValue placeholder="Selecione um semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCourseId && mockCourseService.getCourseById(selectedCourseId)?.semesters.map(semester => (
                      <SelectItem key={semester.number} value={semester.number.toString()} className="py-3">
                        {semester.number}º - {semester.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
              <Button 
                variant="outline" 
                onClick={() => setIsEditTrailModalOpen(false)}
                className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleEditTrail}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <DialogHeader className="pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Nova Tarefa
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">Crie uma nova tarefa para a trilha de conhecimento</p>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="task-title" className="text-sm font-semibold text-gray-700">
                  Título
                </Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Introdução à Programação"
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-description" className="text-sm font-semibold text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva os objetivos desta tarefa..."
                  rows={4}
                  className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-type" className="text-sm font-semibold text-gray-700">
                    Tipo
                  </Label>
                  <Select value={newTask.type} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teórica" className="py-3">Teórica</SelectItem>
                      <SelectItem value="prática" className="py-3">Prática</SelectItem>
                      <SelectItem value="projeto" className="py-3">Projeto</SelectItem>
                      <SelectItem value="avaliação" className="py-3">Avaliação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-difficulty" className="text-sm font-semibold text-gray-700">
                    Dificuldade
                  </Label>
                  <Select value={newTask.difficulty} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Iniciante" className="py-3">Iniciante</SelectItem>
                      <SelectItem value="Intermediário" className="py-3">Intermediário</SelectItem>
                      <SelectItem value="Avançado" className="py-3">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-time" className="text-sm font-semibold text-gray-700">
                  Tempo Estimado
                </Label>
                <Input
                  id="task-time"
                  value={newTask.estimatedTime}
                  onChange={(e) => setNewTask(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  placeholder="Ex: 8 horas"
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
              <Button 
                variant="outline" 
                onClick={() => setIsTaskModalOpen(false)}
                className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateTask}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Tarefa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
