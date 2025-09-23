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

const techCourses = [
  { id: "cs101", name: "Computer Science Fundamentals", code: "CS101" },
  { id: "web201", name: "Web Development", code: "WEB201" },
  { id: "db301", name: "Database Systems", code: "DB301" },
  { id: "se401", name: "Software Engineering", code: "SE401" },
  { id: "ai501", name: "Artificial Intelligence", code: "AI501" },
];

const knowledgeTrailsData = {
  cs101: [
    { topic: "Programming Logic", students: 145, eads: 23 },
    { topic: "Data Structures", students: 132, eads: 18 },
    { topic: "Algorithms", students: 128, eads: 21 },
    { topic: "Object-Oriented Programming", students: 140, eads: 25 },
  ],
  web201: [
    { topic: "HTML/CSS", students: 156, eads: 28 },
    { topic: "JavaScript", students: 142, eads: 24 },
    { topic: "React", students: 138, eads: 22 },
    { topic: "Backend Development", students: 134, eads: 20 },
    { topic: "PHP", students: 125, eads: 19 },
  ],
  db301: [
    { topic: "SQL Fundamentals", students: 118, eads: 16 },
    { topic: "Database Design", students: 112, eads: 14 },
    { topic: "NoSQL", students: 108, eads: 13 },
    { topic: "Database Administration", students: 105, eads: 12 },
  ],
  se401: [
    { topic: "Software Architecture", students: 95, eads: 11 },
    { topic: "Testing", students: 92, eads: 10 },
    { topic: "DevOps", students: 88, eads: 9 },
    { topic: "Project Management", students: 85, eads: 8 },
  ],
  ai501: [
    { topic: "Machine Learning", students: 78, eads: 7 },
    { topic: "Neural Networks", students: 75, eads: 6 },
    { topic: "Natural Language Processing", students: 72, eads: 5 },
    { topic: "Computer Vision", students: 70, eads: 4 },
  ],
};

const studentEnrollmentData = [
  { month: "Jan", students: 1200 },
  { month: "Feb", students: 1350 },
  { month: "Mar", students: 1280 },
  { month: "Apr", students: 1420 },
  { month: "May", students: 1380 },
  { month: "Jun", students: 1500 },
];

const techTeachers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Full-Stack Development",
    courses: 3,
    students: 245,
  },
  {
    id: 2,
    name: "Prof. Mike Chen",
    specialization: "Database Systems",
    courses: 2,
    students: 180,
  },
  {
    id: 3,
    name: "Dr. Emma Davis",
    specialization: "AI & Machine Learning",
    courses: 4,
    students: 320,
  },
  {
    id: 4,
    name: "Prof. Alex Rodriguez",
    specialization: "Software Engineering",
    courses: 2,
    students: 165,
  },
  {
    id: 5,
    name: "Dr. Lisa Wang",
    specialization: "Frontend Development",
    courses: 3,
    students: 210,
  },
];

const activeStudents = [
  {
    id: 1,
    name: "João Silva",
    course: "Web Development",
    progress: 85,
    eadsCompleted: 12,
  },
  {
    id: 2,
    name: "Maria Santos",
    course: "Database Systems",
    progress: 92,
    eadsCompleted: 15,
  },
  {
    id: 3,
    name: "Pedro Costa",
    course: "AI & ML",
    progress: 78,
    eadsCompleted: 8,
  },
  {
    id: 4,
    name: "Ana Oliveira",
    course: "Software Engineering",
    progress: 88,
    eadsCompleted: 11,
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    course: "Computer Science",
    progress: 95,
    eadsCompleted: 18,
  },
];

const recentEADs = [
  {
    id: 1,
    title: "React Component Development",
    course: "Web Development",
    submissions: 142,
    deadline: "Dec 20, 2024",
  },
  {
    id: 2,
    title: "Database Optimization Project",
    course: "Database Systems",
    submissions: 98,
    deadline: "Dec 22, 2024",
  },
  {
    id: 3,
    title: "Machine Learning Model",
    course: "AI & ML",
    submissions: 76,
    deadline: "Dec 25, 2024",
  },
  {
    id: 4,
    title: "Software Testing Framework",
    course: "Software Engineering",
    submissions: 89,
    deadline: "Dec 28, 2024",
  },
];

export default function AdminDashboard() {
  const [selectedCourse, setSelectedCourse] = useState("cs101");
  const currentKnowledgeTrails =
    knowledgeTrailsData[selectedCourse as keyof typeof knowledgeTrailsData] ||
    [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Tech University Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Technology & Computer Science Management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Academic Year 2024-25
            </Button>
            <Avatar>
              <AvatarImage src="/admin-avatar.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> á mais do que
                ultimo semestre
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
                Tech Teachers
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Knowledge Trails by Course</CardTitle>
                <CardDescription>
                  Student enrollment and EADs by topic
                </CardDescription>
              </div>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {techCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentKnowledgeTrails}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="topic"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="students"
                  fill="hsl(var(--chart-1))"
                  name="Students"
                />
                <Bar dataKey="eads" fill="hsl(var(--chart-2))" name="EADs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Enrollment Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment Trend</CardTitle>
              <CardDescription>
                Monthly enrollment numbers for tech programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentEnrollmentData}>
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
                Recent EADs (Distance Learning Activities)
              </CardTitle>
              <CardDescription>
                Current assignments and submission status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEADs.map((ead) => (
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
                      {ead.submissions} submissions
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {ead.deadline}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tech Teachers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Tech Teachers
              </CardTitle>
              <CardDescription>
                Faculty specializations and course load
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {techTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs">
                        {teacher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {teacher.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {teacher.courses} courses
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {teacher.students} students
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Rank de Entrega dos Alunos
              </CardTitle>
              <CardDescription>
                Student progress and EAD completion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeStudents.map((student) => (
                <div key={student.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.course}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{student.progress}%</p>
                      <p className="text-xs text-muted-foreground">
                        {student.eadsCompleted} EADs
                      </p>
                    </div>
                  </div>
                  <Progress value={student.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}

        {
          <QuickActions />
        }
      </main>
    </div>
  );
}
