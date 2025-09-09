"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";

const roles = [
  { id: 2, name: "STUDENT" },
  { id: 3, name: "TEACHER" },
  { id: 1, name: "ADMIN" },
];

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

export default function RegisterModal() {
  const [students, setStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    roleId: "2", // Default para STUDENT
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Criar FormData para multipart/form-data
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("cpf", formData.cpf);
    submitData.append("roleId", formData.roleId);

    if (selectedImage) {
      submitData.append("image", selectedImage);
      submitData.append("nameImage", selectedImage.name);
    }

    try {
      // Aqui você faria a chamada para sua API
      console.log("[v0] Dados do formulário para envio:", {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        roleId: formData.roleId,
        hasImage: !!selectedImage,
        imageName: selectedImage?.name,
      });

      // Mock: adicionar novo estudante à lista local
      const roleObj = roles.find(
        (r) => r.id === Number.parseInt(formData.roleId)
      );
      const newStudent = {
        id: students.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        ...formData,
        roleId: Number.parseInt(formData.roleId),
        role: {
          id: roleObj!.id,
          name: roleObj!.name,
          createdAt: new Date().toISOString(),
          updatedAt: null,
        },
        nameImage: selectedImage?.name || null,
      };

      setStudents([...students, newStudent]);

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        cpf: "",
        roleId: "2",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("[v0] Erro ao cadastrar aluno:", error);
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
            <DialogDescription>
              Preencha os dados do aluno para cadastro no sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Digite o nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="email@techuni.edu.br"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder="Digite a senha"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cpf: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  placeholder="00000000000"
                  maxLength={11}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleId">Tipo de Usuário</Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) =>
                  setFormData({ ...formData, roleId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Foto do Aluno</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Imagem
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview && (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={imagePreview || "/placeholder.svg"} />
                    <AvatarFallback>IMG</AvatarFallback>
                  </Avatar>
                )}
              </div>
              {selectedImage && (
                <p className="text-xs text-muted-foreground">
                  Arquivo selecionado: {selectedImage.name}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Cadastrar Aluno</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
