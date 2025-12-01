import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Semester } from "@/lib/types/courseTypes"
import { cn } from "@/lib/utils"
import { Lock, CheckCircle, Brain, AlertTriangle } from 'lucide-react'

interface SemesterCardProps {
  semester: Semester
  courseId: string
}

/**
 * SemesterCard Component
 * Displays a single semester within a course, showing its progress, status, and contained learning tracks.
 * Features:
 * - Semester title and description
 * - Progress bar and completion status
 * - Locked/unlocked indicator
 * - List of learning tracks within the semester
 * - Navigation to the semester detail page
 */
export function SemesterCard({ semester, courseId }: SemesterCardProps) {
  const isRecommended = semester.status === 'active'
  const isCompleted = semester.status === 'completed'
  const isInactive = semester.status === 'inactive'

  return (
    <Link href={`/cursos/${courseId}/semestre/${semester.id}`} className="block">
      <Card className={cn(
        "hover:shadow-md transition-shadow duration-200",
        isInactive && "opacity-75 hover:opacity-90"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            {semester.title}
            {isCompleted ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" /> Concluído
              </Badge>
            ) : isRecommended ? (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Em Progresso
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <AlertTriangle className="w-3 h-3 mr-1" /> Disponível
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {semester.description}
            {isInactive && (
              <span className="block text-xs text-yellow-600 mt-1">
                ⚠️ Recomendado completar semestres anteriores primeiro
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <Progress value={semester.progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground mt-1">{semester.progress}% Concluído</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-1 text-muted-foreground">
              <Brain className="w-4 h-4" /> Trilhas de Conhecimento:
            </h4>
            {semester.learningTracks.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {semester.learningTracks.map(track => (
                  <li key={track.id}>{track.title} ({track.progress}%)</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {semester.totalTracks} trilhas disponíveis
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
