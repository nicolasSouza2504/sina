"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
} from "recharts";
import {
    Users,
    Calendar,
    TrendingUp,
    GraduationCap,
    AlertCircle,
    Code,
    Database,
    Monitor,
    CheckCircle2,
    XCircle,
    Eye,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    Clock,
    Star,
    ArrowUp,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import QuickActions, {
    QuickActionsProps,
} from "@/components/admin/quickActions";

const cursostecnologia = [
    { id: "cs101", name: "Fundamentos da Ciência da Computação", code: "CC101" },
    { id: "web201", name: "Desenvolvimento Web", code: "DW201" },
    { id: "db301", name: "Sistemas de Banco de Dados", code: "BD301" },
    { id: "se401", name: "Engenharia de Software", code: "ES401" },
    { id: "ai501", name: "Inteligência Artificial", code: "IA501" },
];

const dadosTrilhasConhecimento = {
    cs101: [
        { topic: "Lógica de Programação", students: 145, eads: 23 },
        { topic: "Estruturas de Dados", students: 132, eads: 18 },
        { topic: "Algoritmos", students: 128, eads: 21 },
        { topic: "Programação Orientada a Objetos", students: 140, eads: 25 },
    ],
    web201: [
        { topic: "HTML/CSS", students: 156, eads: 28 },
        { topic: "JavaScript", students: 142, eads: 24 },
        { topic: "React", students: 138, eads: 22 },
        { topic: "Desenvolvimento Backend", students: 134, eads: 20 },
        { topic: "PHP", students: 125, eads: 19 },
    ],
    db301: [
        { topic: "Fundamentos SQL", students: 118, eads: 16 },
        { topic: "Design de Banco de Dados", students: 112, eads: 14 },
        { topic: "NoSQL", students: 108, eads: 13 },
        { topic: "Administração de Banco de Dados", students: 105, eads: 12 },
    ],
    se401: [
        { topic: "Arquitetura de Software", students: 95, eads: 11 },
        { topic: "Testes", students: 92, eads: 10 },
        { topic: "DevOps", students: 88, eads: 9 },
        { topic: "Gerenciamento de Projetos", students: 85, eads: 8 },
    ],
    ai501: [
        { topic: "Aprendizado de Máquina", students: 78, eads: 7 },
        { topic: "Redes Neurais", students: 75, eads: 6 },
        { topic: "Processamento de Linguagem Natural", students: 72, eads: 5 },
        { topic: "Visão Computacional", students: 70, eads: 4 },
    ],
};

const dadosMatriculaEstudantes = [
    { month: "Jan", students: 1200 },
    { month: "Fev", students: 1350 },
    { month: "Mar", students: 1280 },
    { month: "Abr", students: 1420 },
    { month: "Mai", students: 1380 },
    { month: "Jun", students: 1500 },
];

const professoresTecnologia = [
    {
        id: 1,
        name: "Dra. Sarah Johnson",
        specialization: "Desenvolvimento Full-Stack",
        courses: 3,
        students: 245,
    },
    {
        id: 2,
        name: "Prof. Mike Chen",
        specialization: "Sistemas de Banco de Dados",
        courses: 2,
        students: 180,
    },
    {
        id: 3,
        name: "Dra. Emma Davis",
        specialization: "IA e Aprendizado de Máquina",
        courses: 4,
        students: 320,
    },
    {
        id: 4,
        name: "Prof. Alex Rodriguez",
        specialization: "Engenharia de Software",
        courses: 2,
        students: 165,
    },
    {
        id: 5,
        name: "Dra. Lisa Wang",
        specialization: "Desenvolvimento Frontend",
        courses: 3,
        students: 210,
    },
];

const alunosAtivos = [
    {
        id: 1,
        name: "João Silva",
        course: "Desenvolvimento Web",
        progress: 85,
        eadsCompleted: 12,
    },
    {
        id: 2,
        name: "Maria Santos",
        course: "Sistemas de Banco de Dados",
        progress: 92,
        eadsCompleted: 15,
    },
    {
        id: 3,
        name: "Pedro Costa",
        course: "IA e AM",
        progress: 78,
        eadsCompleted: 8,
    },
    {
        id: 4,
        name: "Ana Oliveira",
        course: "Engenharia de Software",
        progress: 88,
        eadsCompleted: 11,
    },
    {
        id: 5,
        name: "Carlos Ferreira",
        course: "Ciência da Computação",
        progress: 95,
        eadsCompleted: 18,
    },
];

const eadsRecentes = [
    {
        id: 1,
        title: "Desenvolvimento de Componentes React",
        course: "Desenvolvimento Web",
        submissions: 142,
        deadline: "20 Dez 2024",
    },
    {
        id: 2,
        title: "Projeto de Otimização de Banco de Dados",
        course: "Sistemas de Banco de Dados",
        submissions: 98,
        deadline: "22 Dez 2024",
    },
    {
        id: 3,
        title: "Modelo de Aprendizado de Máquina",
        course: "IA e AM",
        submissions: 76,
        deadline: "25 Dez 2024",
    },
    {
        id: 4,
        title: "Framework de Testes de Software",
        course: "Engenharia de Software",
        submissions: 89,
        deadline: "28 Dez 2024",
    },
];

export default function DashboardAdmin() {
    const [cursoSelecionado, setCursoSelecionado] = useState("cs101");
    const trilhasConhecimentoAtual =
        dadosTrilhasConhecimento[cursoSelecionado as keyof typeof dadosTrilhasConhecimento] ||
        [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Cabeçalho */}
            <header className="border-b bg-white">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Universidade Tecnológica - Admin
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Gestão de Tecnologia e Ciência da Computação
                        </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Button variant="outline" className="h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Ano Letivo 2024-25</span>
                            <span className="sm:hidden">2024-25</span>
                        </Button>
                        <Avatar>
                            <AvatarImage src="/admin-avatar.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Alunos Ativos
                            </CardTitle>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">2.847</div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-green-600 font-semibold">+15%</span> a mais que o último semestre
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Cursos</CardTitle>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Code className="h-5 w-5 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">24</div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-blue-600 font-semibold">5</span> ativos este semestre
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Professores de Tecnologia
                            </CardTitle>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">67</div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-green-600 font-semibold">89%</span> taxa de ocupação
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">EADs Ativos</CardTitle>
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Monitor className="h-5 w-5 text-amber-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">156</div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="text-green-600 font-semibold">89%</span> taxa de conclusão
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Seção de Gráficos */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Filtro de Curso */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Análise por Curso</h2>
                            <p className="text-sm text-gray-600 mt-1">Visualize dados específicos de cada curso de tecnologia</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={cursoSelecionado} onValueChange={setCursoSelecionado}>
                                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl w-full sm:w-[250px]">
                                    <SelectValue placeholder="Selecione um curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cursostecnologia.map((curso) => (
                                        <SelectItem key={curso.id} value={curso.id} className="py-3">
                                            <div className="flex items-center gap-2">
                                                <Code className="h-4 w-4 text-purple-600" />
                                                <div>
                                                    <div className="font-medium">{curso.name}</div>
                                                    <div className="text-xs text-gray-500">{curso.code}</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                                <Search className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Filtrar</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Tendência de Matrículas */}
                        <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Tendência de Matrículas de Estudantes
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                    Números mensais de matrículas para programas de tecnologia
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dadosMatriculaEstudantes}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#ffffff',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px'
                                            }} 
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="students"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={{ fill: '#2563eb', r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Database className="h-5 w-5 text-purple-600" />
                                    EADs Recentes (Atividades de Ensino a Distância)
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                    Tarefas atuais e status de submissão
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {eadsRecentes.map((ead) => (
                                    <div
                                        key={ead.id}
                                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                                                {ead.title}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {ead.course}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {ead.submissions} <span className="text-xs text-gray-600 font-normal">submissões</span>
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{ead.deadline}</span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-blue-100 group-hover:bg-blue-100 transition-colors"
                                                title="Visualizar detalhes"
                                            >
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Professores de Tecnologia */}
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                                Professores de Tecnologia
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                                Especializações do corpo docente e carga de cursos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {professoresTecnologia.map((professor) => (
                                <div
                                    key={professor.id}
                                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-all group"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            <AvatarFallback className="text-xs font-semibold bg-green-100 text-green-700">
                                                {professor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                                                {professor.name}
                                            </p>
                                            <p className="text-xs text-gray-600 truncate">
                                                {professor.specialization}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {professor.courses} <span className="text-xs text-gray-600 font-normal">cursos</span>
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {professor.students} alunos
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                                                title="Visualizar detalhes"
                                            >
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-green-100 transition-colors"
                                                title="Editar professor"
                                            >
                                                <Edit className="h-4 w-4 text-green-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Alunos Ativos */}
                    <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Ranking de Entregas dos Alunos
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                                Progresso dos estudantes e conclusão de EADs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {alunosAtivos.map((aluno, index) => (
                                <div key={aluno.id} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                <AvatarFallback className="text-xs font-semibold bg-blue-100 text-blue-700">
                                                    {aluno.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {aluno.name}
                                                </p>
                                                <p className="text-xs text-gray-600 truncate">
                                                    {aluno.course}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <div className="text-right">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-gray-900">{aluno.progress}%</span>
                                                    {aluno.progress >= 90 && (
                                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {aluno.eadsCompleted} EADs
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                                                title="Visualizar progresso"
                                            >
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                            <span>Progresso</span>
                                            <span className="font-semibold">{aluno.progress}%</span>
                                        </div>
                                        <Progress 
                                            value={aluno.progress} 
                                            className="h-2" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Trilhas de Conhecimento por Curso */}
                <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Database className="h-5 w-5 text-purple-600" />
                            Trilhas de Conhecimento - {cursostecnologia.find(c => c.id === cursoSelecionado)?.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                            Progresso dos estudantes nas trilhas do curso selecionado
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {trilhasConhecimentoAtual.map((trilha, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all group">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                                                {trilha.topic}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <Users className="h-3 w-3" />
                                                    <span>{trilha.students} alunos</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <Monitor className="h-3 w-3" />
                                                    <span>{trilha.eads} EADs</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-900">{trilha.students}</p>
                                                <p className="text-xs text-gray-600">estudantes</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-purple-100 transition-colors"
                                                title="Visualizar trilha"
                                            >
                                                <Eye className="h-4 w-4 text-purple-600" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                            <span>Taxa de Progresso</span>
                                            <span className="font-semibold">{Math.round((trilha.eads / trilha.students) * 100)}%</span>
                                        </div>
                                        <Progress 
                                            value={(trilha.eads / trilha.students) * 100} 
                                            className="h-2" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Ações Rápidas */}
                <div className="mt-8">
                    <QuickActions />
                </div>
            </main>
        </div>
    );
}