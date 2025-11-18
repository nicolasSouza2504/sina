import { UserWelcome } from "@/components/KnowledgeTrail/user_welcome"
import { LearningTrackCard } from "@/components/KnowledgeTrail/learning_track_card"
import QuickActionsAluno from '@/components/admin/quickActionsAluno';
import { Database, Code, BarChart3, BookOpen, Video, FileText } from "lucide-react"

export default function TrilhasPage() {
  const learningTracks = [
    {
      id: "1",
      title: "Desenvolvimento Web - Fundamentos",
      progress: 75,
      activities: [
        {
          id: "1-1",
          title: "Introdução ao HTML e CSS",
          icon: <Code className="w-5 h-5" />,
          completed: false,
        },
        {
          id: "1-2",
          title: "JavaScript Básico",
          icon: <Code className="w-5 h-5" />,
          completed: true,
        },
        {
          id: "1-3",
          title: "Projeto Prático - Landing Page",
          icon: <FileText className="w-5 h-5" />,
          completed: false,
        },
      ],
    },
    {
      id: "2",
      title: "Banco de Dados e SQL",
      progress: 100,
      activities: [
        {
          id: "2-1",
          title: "Fundamentos de Banco de Dados",
          icon: <Database className="w-5 h-5" />,
          completed: true,
        },
        {
          id: "2-2",
          title: "Consultas SQL Avançadas",
          icon: <Database className="w-5 h-5" />,
          completed: true,
        },
        {
          id: "2-3",
          title: "Modelagem de Dados",
          icon: <BarChart3 className="w-5 h-5" />,
          completed: true,
        },
      ],
    },
    {
      id: "3",
      title: "React e Desenvolvimento Frontend",
      progress: 45,
      activities: [
        {
          id: "3-1",
          title: "Introdução ao React",
          icon: <Code className="w-5 h-5" />,
          completed: true,
        },
        {
          id: "3-2",
          title: "Hooks e Estado",
          icon: <Code className="w-5 h-5" />,
          completed: false,
        },
        {
          id: "3-3",
          title: "Projeto - Dashboard Interativo",
          icon: <BarChart3 className="w-5 h-5" />,
          completed: false,
        },
      ],
    },
    {
      id: "4",
      title: "Cursos Complementares",
      progress: 20,
      activities: [
        {
          id: "4-1",
          title: "Git e Controle de Versão",
          icon: <BookOpen className="w-5 h-5" />,
          completed: true,
        },
        {
          id: "4-2",
          title: "Metodologias Ágeis",
          icon: <Video className="w-5 h-5" />,
          completed: false,
        },
        {
          id: "4-3",
          title: "Soft Skills para Desenvolvedores",
          icon: <BookOpen className="w-5 h-5" />,
          completed: false,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-balance">Minhas Trilhas de Conhecimento</h1>

          <UserWelcome name="Ana Silva" avatarUrl="/professional-woman-developer.png" />
        </header>

        <main className="space-y-6">
          {learningTracks.map((track) => (
            <LearningTrackCard
              key={track.id}
              title={track.title}
              progress={track.progress}
              activities={track.activities}
              trilhaId={track.id}
              showDetailsButton={true}
            />
          ))}
        </main>

        <QuickActionsAluno />

        <footer className="mt-12 text-center">
          <p className="text-muted-foreground">Continue aprendendo e desenvolvendo suas habilidades! 🚀</p>
        </footer>
      </div>
    </div>
  )
}
