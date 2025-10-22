"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <div className="min-h-screen bg-background">
            {/* Cabeçalho */}
            <header className="border-b bg-card">
                <div className="flex h-16 items-center justify-between px-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Universidade Tecnológica - Admin
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestão de Tecnologia e Ciência da Computação
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Ano Letivo 2024-25
                        </Button>
                        <Avatar>
                            <AvatarImage src="/admin-avatar.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="p-6 space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Alunos Ativos
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.847</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">+15%</span> a mais que o último semestre
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cursos</CardTitle>
                            <Code className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Professores de Tecnologia
                            </CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">67</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">EADs Ativos</CardTitle>
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">156</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">89%</span> taxa de conclusão
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Seção de Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tendência de Matrículas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tendência de Matrículas de Estudantes</CardTitle>
                            <CardDescription>
                                Números mensais de matrículas para programas de tecnologia
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dadosMatriculaEstudantes}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="students"
                                        stroke="hsl(var(--chart-1))"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                EADs Recentes (Atividades de Ensino a Distância)
                            </CardTitle>
                            <CardDescription>
                                Tarefas atuais e status de submissão
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {eadsRecentes.map((ead) => (
                                <div
                                    key={ead.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{ead.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {ead.course}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {ead.submissions} submissões
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Prazo: {ead.deadline}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Professores de Tecnologia */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Professores de Tecnologia
                            </CardTitle>
                            <CardDescription>
                                Especializações do corpo docente e carga de cursos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {professoresTecnologia.map((professor) => (
                                <div
                                    key={professor.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="text-xs">
                                                {professor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{professor.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {professor.specialization}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {professor.courses} cursos
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {professor.students} alunos
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Alunos Ativos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Ranking de Entregas dos Alunos
                            </CardTitle>
                            <CardDescription>
                                Progresso dos estudantes e conclusão de EADs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {alunosAtivos.map((aluno) => (
                                <div key={aluno.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {aluno.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{aluno.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {aluno.course}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{aluno.progress}%</p>
                                            <p className="text-xs text-muted-foreground">
                                                {aluno.eadsCompleted} EADs
                                            </p>
                                        </div>
                                    </div>
                                    <Progress value={aluno.progress} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <QuickActions />
            </main>
        </div>
    );
}