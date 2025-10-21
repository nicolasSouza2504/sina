"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  User,
  Lock,
  Unlock,
  CheckCircle,
  GripVertical
} from 'lucide-react';
import { mockCourseService, Course, Trail, Task, Material } from '@/lib/services/mockCourseService';
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

export default function GerenciarConteudoNovo() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modais
  const [selectedTrail, setSelectedTrail] = useState<ContentItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<ContentItem | null>(null);
  const [isTrailModalOpen, setIsTrailModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  
  // Estados para formulários
  const [newTrail, setNewTrail] = useState({
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
  
  const [newMaterial, setNewMaterial] = useState({
    type: 'text' as 'text' | 'video' | 'link' | 'file',
    title: '',
    content: '',
    url: '',
    file: null as File | null
  });

  useEffect(() => {
    // Criar dados de exemplo se não existirem
    mockCourseService.createSampleData();
    
    // Carregar cursos
    const allCourses = mockCourseService.getAllCourses();
    setCourses(allCourses.map(c => ({ id: c.id, name: c.title })));
    
    // Definir curso padrão se houver apenas um
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
          allTrailsFormatted.push({
            id: trail.id,
            type: 'trilha',
            title: trail.title,
            courseId: course.id,
            courseName: course.title,
            semesterId: trail.semesterNumber?.toString() || '',
            semesterName: trail.semesterNumber ? `${trail.semesterNumber}º Semestre` : 'Sem semestre',
            description: trail.description,
            tasks: trail.tasks || []
          });
        }
      }
    });

    setContent(allTrailsFormatted);
  };

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupa trilhas por semestre
  const groupedBySemester = filteredContent.reduce((acc, trail) => {
    const semesterKey = trail.semesterId || 'sem-semestre';
    const semesterName = trail.semesterName;
    
    if (!acc[semesterKey]) {
      acc[semesterKey] = {
        semesterName,
        trails: []
      };
    }
    
    acc[semesterKey].trails.push(trail);
    return acc;
  }, {} as Record<string, { semesterName: string; trails: ContentItem[] }>);

  // Ordena os semestres numericamente
  const sortedSemesters = Object.entries(groupedBySemester).sort((a, b) => {
    if (a[0] === 'sem-semestre') return 1;
    if (b[0] === 'sem-semestre') return -1;
    return parseInt(a[0]) - parseInt(b[0]);
  });

  const handleCreateTrail = () => {
    if (!selectedCourseId) {
      toast.error('❌ Selecione um curso primeiro');
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

    const trail = mockCourseService.createTrail({
      courseId: selectedCourseId,
      semesterNumber: parseInt(newTrail.semesterNumber),
      title: newTrail.title,
      description: newTrail.description
    });

    setNewTrail({ title: '', description: '', semesterNumber: '' });
    loadContent();
    toast.success('✅ Trilha criada com sucesso!');
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

    const task = mockCourseService.createTask({
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
    loadContent();
    setIsTaskModalOpen(false);
    toast.success('✅ Tarefa criada com sucesso!');
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
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = () => {
        materialData.fileData = reader.result;
        materialData.fileName = newMaterial.file?.name;
        mockCourseService.addMaterial(materialData);
        loadContent();
        setIsMaterialModalOpen(false);
        toast.success('✅ Material adicionado com sucesso!');
      };
      reader.readAsDataURL(newMaterial.file);
      return;
    }

    mockCourseService.addMaterial(materialData);
    setNewMaterial({
      type: 'text',
      title: '',
      content: '',
      url: '',
      file: null
    });
    loadContent();
    setIsMaterialModalOpen(false);
    toast.success('✅ Material adicionado com sucesso!');
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
      {/* Header */}
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

      {/* Filtros */}
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

      {/* Conteúdo */}
      {selectedCourseId ? (
        <div className="space-y-6">
          {sortedSemesters.map(([semesterKey, { semesterName, trails }]) => (
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
                        <div>
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
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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
                                <div className="flex items-center gap-2">
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
                                        taskId: task.id,
                                        taskName: task.title
                                      });
                                      setIsMaterialModalOpen(true);
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Material
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
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

                              {/* Materiais da tarefa */}
                              {task.materials && task.materials.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Materiais:</h4>
                                  <div className="grid gap-2">
                                    {task.materials.map(material => (
                                      <div key={material.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                                        {getTypeIcon(material.type)}
                                        <span className="text-sm">{material.title}</span>
                                        <div className="ml-auto flex gap-1">
                                          <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um curso</h3>
          <p className="text-gray-600">Escolha um curso para visualizar e gerenciar seu conteúdo</p>
        </div>
      )}

      {/* Modal Nova Trilha */}
      <Dialog open={isTrailModalOpen} onOpenChange={setIsTrailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Trilha de Conhecimento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="trail-title">Título</Label>
              <Input
                id="trail-title"
                value={newTrail.title}
                onChange={(e) => setNewTrail(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Fundamentos de Programação"
              />
            </div>
            
            <div>
              <Label htmlFor="trail-description">Descrição</Label>
              <Textarea
                id="trail-description"
                value={newTrail.description}
                onChange={(e) => setNewTrail(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os objetivos desta trilha..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="trail-semester">Semestre</Label>
              <Select value={newTrail.semesterNumber} onValueChange={(value) => setNewTrail(prev => ({ ...prev, semesterNumber: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um semestre" />
                </SelectTrigger>
                <SelectContent>
                  {mockCourseService.getCourseById(selectedCourseId)?.semesters.map(semester => (
                    <SelectItem key={semester.number} value={semester.number.toString()}>
                      {semester.number}º - {semester.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsTrailModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTrail}>
              Criar Trilha
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Tarefa */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Título</Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Introdução à Programação"
              />
            </div>
            
            <div>
              <Label htmlFor="task-description">Descrição</Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os objetivos desta tarefa..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-type">Tipo</Label>
                <Select value={newTask.type} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, type: value }))}>
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
                <Label htmlFor="task-difficulty">Dificuldade</Label>
                <Select value={newTask.difficulty} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, difficulty: value }))}>
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
              <Label htmlFor="task-time">Tempo Estimado</Label>
              <Input
                id="task-time"
                value={newTask.estimatedTime}
                onChange={(e) => setNewTask(prev => ({ ...prev, estimatedTime: e.target.value }))}
                placeholder="Ex: 8 horas"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTask}>
              Criar Tarefa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Novo Material */}
      <Dialog open={isMaterialModalOpen} onOpenChange={setIsMaterialModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Material</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="material-type">Tipo</Label>
              <Select value={newMaterial.type} onValueChange={(value: any) => setNewMaterial(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="file">Arquivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="material-title">Título</Label>
              <Input
                id="material-title"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título do material"
              />
            </div>
            
            {newMaterial.type === 'text' && (
              <div>
                <Label htmlFor="material-content">Conteúdo</Label>
                <Textarea
                  id="material-content"
                  value={newMaterial.content}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Conteúdo do material..."
                  rows={4}
                />
              </div>
            )}
            
            {(newMaterial.type === 'video' || newMaterial.type === 'link') && (
              <div>
                <Label htmlFor="material-url">URL</Label>
                <Input
                  id="material-url"
                  value={newMaterial.url}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            )}
            
            {newMaterial.type === 'file' && (
              <div>
                <Label htmlFor="material-file">Arquivo</Label>
                <Input
                  id="material-file"
                  type="file"
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsMaterialModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMaterial}>
              Adicionar Material
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
