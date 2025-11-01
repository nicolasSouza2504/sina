"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Copy, Phone, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface RegisterModalProps {
  onStudentAdded?: (student: any) => void;
}

export default function RegisterModal({ onStudentAdded }: RegisterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    course: '',
    semester: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.cpf) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      phone: formData.phone,
      course: formData.course,
      semester: formData.semester,
      createdAt: new Date().toISOString(),
      role: { name: 'STUDENT' }
    };

    onStudentAdded?.(newStudent);
    
    setFormData({
      name: '',
      email: '',
      cpf: '',
      phone: '',
      course: '',
      semester: ''
    });
    
    setIsOpen(false);
    toast.success('Aluno cadastrado com sucesso!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Novo Aluno
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 bg-blue-600 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-gray-900">Cadastrar Novo Aluno</span>
                <p className="text-sm font-normal text-gray-600 mt-1">
                  Preencha os dados do novo aluno
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite o nome completo"
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email *
                </Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(formData.email);
                      toast.success('Email copiado para a área de transferência');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="exemplo@email.com"
                    className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700">
                  CPF *
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course" className="text-sm font-semibold text-gray-700">
                  Curso
                </Label>
                <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desenvolvimento-web">Desenvolvimento Web</SelectItem>
                    <SelectItem value="ciencia-computacao">Ciência da Computação</SelectItem>
                    <SelectItem value="engenharia-software">Engenharia de Software</SelectItem>
                    <SelectItem value="sistemas-informacao">Sistemas de Informação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-sm font-semibold text-gray-700">
                  Semestre
                </Label>
                <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                    <SelectValue placeholder="Selecione um semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Semestre</SelectItem>
                    <SelectItem value="2">2º Semestre</SelectItem>
                    <SelectItem value="3">3º Semestre</SelectItem>
                    <SelectItem value="4">4º Semestre</SelectItem>
                    <SelectItem value="5">5º Semestre</SelectItem>
                    <SelectItem value="6">6º Semestre</SelectItem>
                    <SelectItem value="7">7º Semestre</SelectItem>
                    <SelectItem value="8">8º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <User className="h-4 w-4 mr-2" />
                Cadastrar Aluno
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
