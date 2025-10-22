"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, Plus, Edit3, Users, BookOpen, Calendar, FileText, Database, AlertCircle, Grid3X3, Code } from 'lucide-react';
import Link from 'next/link';

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  onClick?: () => void;
}

interface QuickActionsFooterProps {
  actions?: QuickAction[];
  title?: string;
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    title: 'Gerenciar Estudantes',
    description: 'Gerenciar cadastro e informações dos estudantes',
    icon: Users,
    href: '/admin/students',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: 'Gerenciar Cursos',
    description: 'Criar e editar cursos disponíveis',
    icon: Code,
    href: '/professor/cursos',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Gerenciar Turmas',
    description: 'Organizar turmas e grupos de alunos',
    icon: Code,
    href: '/admin/class',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    title: 'Gerenciar EADs',
    description: 'Gerenciar conteúdo de ensino a distância',
    icon: Database,
    href: '/professor/conteudo',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    title: 'Relatórios',
    description: 'Visualizar relatórios e estatísticas',
    icon: AlertCircle,
    href: '/relatorios',
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    title: 'Dashboard',
    description: 'Acesso rápido ao painel principal',
    icon: Grid3X3,
    href: '/professor/dashboard',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  }
];

export function QuickActionsFooter({ 
  actions = defaultActions, 
  title = "Ações Rápidas",
  className = ""
}: QuickActionsFooterProps) {
  return (
    <div className={`mt-12 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <Card 
            key={index}
            className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 cursor-pointer"
          >
            <CardContent className="p-6">
              {action.onClick ? (
                <button 
                  onClick={action.onClick}
                  className="w-full text-left"
                >
                  <ActionContent action={action} />
                </button>
              ) : (
                <Link href={action.href} className="block">
                  <ActionContent action={action} />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ActionContent({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  
  return (
    <>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {action.title}
          </h3>
          <p className="text-sm text-gray-600">
            {action.description}
          </p>
        </div>
      </div>
    </>
  );
}

// Quick actions predefinidas para diferentes contextos
export const professorQuickActions: QuickAction[] = [
  {
    title: 'Gerenciar Estudantes',
    description: 'Gerenciar cadastro e informações dos estudantes',
    icon: Users,
    href: '/admin/students',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: 'Gerenciar Cursos',
    description: 'Criar e editar cursos disponíveis',
    icon: Code,
    href: '/professor/cursos',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Gerenciar Turmas',
    description: 'Organizar turmas e grupos de alunos',
    icon: Code,
    href: '/admin/class',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    title: 'Gerenciar EADs',
    description: 'Gerenciar conteúdo de ensino a distância',
    icon: Database,
    href: '/professor/conteudo',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    title: 'Relatórios',
    description: 'Visualizar relatórios e estatísticas',
    icon: AlertCircle,
    href: '/relatorios',
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    title: 'Dashboard',
    description: 'Acesso rápido ao painel principal',
    icon: Grid3X3,
    href: '/professor/dashboard',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  }
];

export const studentQuickActions: QuickAction[] = [
  {
    title: 'Minhas Trilhas',
    description: 'Ver suas trilhas de aprendizado',
    icon: BookOpen,
    href: '/trilhas',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: 'Calendário',
    description: 'Ver próximas aulas e atividades',
    icon: Calendar,
    href: '/calendario',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Minhas Entregas',
    description: 'Acompanhar materiais enviados',
    icon: FileText,
    href: '/entregas',
    color: 'bg-purple-500 hover:bg-purple-600'
  }
];

