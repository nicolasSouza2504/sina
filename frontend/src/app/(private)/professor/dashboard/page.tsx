"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Edit3, 
  Users, 
  School, 
  Clock,
  StickyNote,
  Plus,
  X,
  Save,
  Trash2,
  Trophy,
  Award,
  Medal,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface QuickNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  classId: string;
  className: string;
}

export default function ProfessorDashboard() {
  // Estados para anotações rápidas
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', classId: '', className: '' });

  // Mock de turmas - em produção viria da API
  const availableClasses = [
    { id: 'class_1', name: 'ADS 2º Semestre - Noturno' },
    { id: 'class_2', name: 'ADS 3º Semestre - Noturno' },
    { id: 'class_3', name: 'ADS 4º Semestre - Noturno' },
    { id: 'class_4', name: 'Desenvolvimento Web - Matutino' },
    { id: 'class_5', name: 'Backend Avançado - Vespertino' }
  ];

  // Mock de ranking de atividades EAD - em produção viria da API
  const eadRanking = [
    { 
      id: 1, 
      studentName: 'Maria Silva', 
      studentAvatar: 'MS',
      class: 'ADS 2º Semestre',
      tasksCompleted: 45, 
      totalTasks: 50,
      completionRate: 90,
      lastSubmission: '2h atrás'
    },
    { 
      id: 2, 
      studentName: 'João Santos', 
      studentAvatar: 'JS',
      class: 'ADS 3º Semestre',
      tasksCompleted: 42, 
      totalTasks: 50,
      completionRate: 84,
      lastSubmission: '5h atrás'
    },
    { 
      id: 3, 
      studentName: 'Ana Costa', 
      studentAvatar: 'AC',
      class: 'ADS 2º Semestre',
      tasksCompleted: 40, 
      totalTasks: 50,
      completionRate: 80,
      lastSubmission: '1 dia atrás'
    },
    { 
      id: 4, 
      studentName: 'Pedro Oliveira', 
      studentAvatar: 'PO',
      class: 'ADS 4º Semestre',
      tasksCompleted: 38, 
      totalTasks: 50,
      completionRate: 76,
      lastSubmission: '1 dia atrás'
    },
    { 
      id: 5, 
      studentName: 'Carla Mendes', 
      studentAvatar: 'CM',
      class: 'ADS 3º Semestre',
      tasksCompleted: 35, 
      totalTasks: 50,
      completionRate: 70,
      lastSubmission: '2 dias atrás'
    }
  ];

  // Mock data - em produção viria da API
  const stats = {
    totalCursos: 3,
    totalSemestres: 12,
    totalTrilhas: 24,
    totalAlunos: 156,
    turmasAtivas: 5,
    conteudoPendente: 8
  };

  // Carregar anotações do localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('professor-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Salvar anotações no localStorage
  const saveNotes = (newNotes: QuickNote[]) => {
    setNotes(newNotes);
    localStorage.setItem('professor-notes', JSON.stringify(newNotes));
  };

  // Adicionar nova anotação
  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Preencha todos os campos', {
        description: 'Título e conteúdo são obrigatórios para criar uma anotação.'
      });
      return;
    }

    if (!newNote.classId) {
      toast.error('Selecione uma turma', {
        description: 'É necessário associar a anotação a uma turma.'
      });
      return;
    }

    const note: QuickNote = {
      id: `note_${Date.now()}`,
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      classId: newNote.classId,
      className: newNote.className,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);
    setNewNote({ title: '', content: '', classId: '', className: '' });
    setIsAddingNote(false);
    
    toast.success('Anotação criada com sucesso', {
      description: 'Sua anotação foi salva e está disponível no dashboard.'
    });
  };

  // Excluir anotação
  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
    
    toast.success('Anotação removida com sucesso', {
      description: 'A anotação foi excluída permanentemente.'
    });
  };

  // Obter cor da taxa de conclusão
  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Obter ícone de medalha baseado na posição
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-600" />;
      default: return <span className="text-sm font-bold text-gray-500">{position}º</span>;
    }
  };

  // Obter cor de fundo baseado na posição
  const getRankBackground = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3: return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const quickActions = [
    {
      title: 'Anotações Rápidas',
      description: 'Registre observações importantes sobre alunos e aulas',
      icon: StickyNote,
      href: '#',
      color: 'bg-purple-500 hover:bg-purple-600',
      isNoteAction: true
    },
    {
      title: 'Gerenciar Conteúdo',
      description: 'Criar e editar trilhas e materiais',
      icon: Edit3,
      href: '/professor/conteudo',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Ver Minhas Turmas',
      description: 'Acompanhar alunos',
      icon: Users,
      href: '/admin/class',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];


  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Professor</h1>
        <p className="text-gray-600 mt-2">Gerencie os cursos e conteúdos de forma eficiente</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-left pl-4">{stats.totalCursos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semestres</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-left pl-4">{stats.totalSemestres}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trilhas de Conhecimento</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-left pl-4">{stats.totalTrilhas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-left pl-4">{stats.totalAlunos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse as principais funcionalidades para gerenciar seu conteúdo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              action.isNoteAction ? (
                <Card 
                  key={action.title} 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full border-2 hover:border-gray-300"
                  onClick={() => setIsAddingNote(true)}
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-xl ${action.color} text-white shadow-md`}>
                        <action.icon className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">{action.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full border-2 hover:border-gray-300">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`p-4 rounded-xl ${action.color} text-white shadow-md`}>
                          <action.icon className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg">{action.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anotações Rápidas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Anotações Rápidas
              </CardTitle>
              <CardDescription>
                Registre observações importantes sobre alunos, aulas e atividades
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsAddingNote(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Anotação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <StickyNote className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhuma anotação ainda</p>
              <p className="text-sm">Clique em "Nova Anotação" para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <Card key={note.id} className="relative group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                        {note.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                      {note.content}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200 w-fit"
                      >
                        {note.className}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para Adicionar Anotação */}
      {isAddingNote && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Nova Anotação</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote({ title: '', content: '', classId: '', className: '' });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Título
                </label>
                <Input
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Ex: Aluno João saiu mais cedo"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Conteúdo
                </label>
                <Textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Descreva os detalhes da observação..."
                  className="w-full min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Turma
                </label>
                <select
                  value={newNote.classId}
                  onChange={(e) => {
                    const selectedClass = availableClasses.find(c => c.id === e.target.value);
                    setNewNote({ 
                      ...newNote, 
                      classId: e.target.value,
                      className: selectedClass?.name || ''
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecione uma turma</option>
                  {availableClasses.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddNote}
                  className="flex-1 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar Anotação
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote({ title: '', content: '', classId: '', className: '' });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ranking de Atividades EAD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Ranking de Atividades EAD
                </CardTitle>
                <CardDescription>
                  Top 5 alunos com mais atividades entregues
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Top 5
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eadRanking.map((student, index) => (
                <div 
                  key={student.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:shadow-md ${getRankBackground(index + 1)}`}
                >
                  {/* Posição/Medalha */}
                  <div className="flex items-center justify-center min-w-[40px]">
                    {getRankIcon(index + 1)}
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm shadow-md">
                    {student.studentAvatar}
                  </div>

                  {/* Informações do Aluno */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {student.studentName}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {student.class}
                    </p>
                  </div>

                  {/* Estatísticas */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700">
                        {student.tasksCompleted}/{student.totalTasks}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-semibold ${getCompletionColor(student.completionRate)}`}
                    >
                      {student.completionRate}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé com informações adicionais */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Atualizado: {eadRanking[0].lastSubmission}</span>
                <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
                  <Link href="/admin/class">
                    Ver todos os alunos →
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendário de Aulas</CardTitle>
            <CardDescription>
              Suas próximas aulas programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                <div className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-lg p-3 min-w-[60px]">
                  <span className="text-xs font-medium">SEG</span>
                  <span className="text-2xl font-bold">13</span>
                  <span className="text-xs">JAN</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">19:00 - 21:00</span>
                    <Badge variant="secondary" className="text-xs bg-blue-100">Noturno</Badge>
                  </div>
                  <p className="font-medium text-gray-900">Trilha: React Fundamentals</p>
                  <p className="text-sm text-gray-600">ADS 2º Semestre - Sala 204</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">28 alunos</Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50">📚 6 materiais</Badge>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="h-9 px-4">
                  <Link href="/professor/conteudo">
                    Ver Trilha
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                <div className="flex flex-col items-center justify-center bg-green-600 text-white rounded-lg p-3 min-w-[60px]">
                  <span className="text-xs font-medium">TER</span>
                  <span className="text-2xl font-bold">14</span>
                  <span className="text-xs">JAN</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">19:00 - 21:00</span>
                    <Badge variant="secondary" className="text-xs bg-green-100">Noturno</Badge>
                  </div>
                  <p className="font-medium text-gray-900">Trilha: Node.js Backend</p>
                  <p className="text-sm text-gray-600">ADS 3º Semestre - Sala 305</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">32 alunos</Badge>
                    <Badge variant="outline" className="text-xs bg-green-50">📚 8 materiais</Badge>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="h-9 px-4">
                  <Link href="/professor/conteudo">
                    Ver Trilha
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                <div className="flex flex-col items-center justify-center bg-purple-600 text-white rounded-lg p-3 min-w-[60px]">
                  <span className="text-xs font-medium">QUA</span>
                  <span className="text-2xl font-bold">15</span>
                  <span className="text-xs">JAN</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-600">19:30 - 21:30</span>
                    <Badge variant="secondary" className="text-xs bg-purple-100">Noturno</Badge>
                  </div>
                  <p className="font-medium text-gray-900">Trilha: Banco de Dados NoSQL</p>
                  <p className="text-sm text-gray-600">ADS 4º Semestre - Sala 108</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">25 alunos</Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50">📚 5 materiais</Badge>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="h-9 px-4">
                  <Link href="/professor/conteudo">
                    Ver Trilha
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
