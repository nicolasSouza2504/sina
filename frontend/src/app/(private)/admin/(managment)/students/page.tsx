"use client";
import QuickActions from "@/components/admin/quickActions";
import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Users, GraduationCap } from "lucide-react";
import { useState, useRef } from "react";
import RegisterModal from "@/components/admin/students/registerModal";

const studentsData = [
  {
    id: 1,
    createdAt: "2024-08-27T22:49:29.536+00:00",
    updatedAt: null,
    name: "João Silva Santos",
    email: "joao.silva@techuni.edu.br",
    password: "$2a$10$HlpT4sOF2P6fDqCesWZ4fOaLkWpNUnBawtoN3gH8zBLHMA.QLg5su",
    role: {
      id: 2,
      createdAt: "2024-08-27T22:49:29.442+00:00",
      updatedAt: null,
      name: "STUDENT",
    },
    roleId: 2,
    cpf: "12345678901",
    nameImage: "joao_silva.jpg",
  },
  {
    id: 2,
    createdAt: "2024-08-28T10:30:15.123+00:00",
    updatedAt: null,
    name: "Maria Santos Oliveira",
    email: "maria.santos@techuni.edu.br",
    password: "$2a$10$HlpT4sOF2P6fDqCesWZ4fOaLkWpNUnBawtoN3gH8zBLHMA.QLg5su",
    role: {
      id: 2,
      createdAt: "2024-08-27T22:49:29.442+00:00",
      updatedAt: null,
      name: "STUDENT",
    },
    roleId: 2,
    cpf: "98765432109",
    nameImage: "maria_santos.jpg",
  },
  {
    id: 3,
    createdAt: "2024-08-29T14:15:30.789+00:00",
    updatedAt: null,
    name: "Pedro Costa Lima",
    email: "pedro.costa@techuni.edu.br",
    password: "$2a$10$HlpT4sOF2P6fDqCesWZ4fOaLkWpNUnBawtoN3gH8zBLHMA.QLg5su",
    role: {
      id: 2,
      createdAt: "2024-08-27T22:49:29.442+00:00",
      updatedAt: null,
      name: "STUDENT",
    },
    roleId: 2,
    cpf: "11122233344",
    nameImage: null,
  },
  {
    id: 4,
    createdAt: "2024-08-30T09:45:12.456+00:00",
    updatedAt: null,
    name: "Ana Carolina Ferreira",
    email: "ana.ferreira@techuni.edu.br",
    password: "$2a$10$HlpT4sOF2P6fDqCesWZ4fOaLkWpNUnBawtoN3gH8zBLHMA.QLg5su",
    role: {
      id: 2,
      createdAt: "2024-08-27T22:49:29.442+00:00",
      updatedAt: null,
      name: "STUDENT",
    },
    roleId: 2,
    cpf: "55566677788",
    nameImage: "ana_ferreira.jpg",
  },
];

export default function CadastroUserPage() {
  const [students, setStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cpf.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gerenciamento de Alunos
            </h1>
            <p className="text-sm text-muted-foreground">
              Universidade de Tecnologia - Sistema de Gestão
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {students.length} Alunos Cadastrados
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Alunos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> novos este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alunos Ativos
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.filter((s) => s.role.name === "STUDENT").length}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">98%</span> taxa de atividade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Novos Cadastros
              </CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle>Lista de Alunos</CardTitle>
                <CardDescription>
                  Gerencie os alunos cadastrados no sistema
                </CardDescription>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <RegisterModal></RegisterModal>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {student.nameImage ? (
                            <AvatarImage
                              src={`/uploads/${student.nameImage}`}
                            />
                          ) : null}
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {student.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{formatCPF(student.cpf)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.role.name === "STUDENT"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {student.role.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(student.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum aluno encontrado com os critérios de busca.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {<QuickActions />}
    </div>
  );
}
