import type React from "react"
import { Card } from "@/components/ui/card"
import { ProgressBadge } from "@/components/KnowledgeTrail/progress_badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Activity {
  id: string
  title: string
  icon: React.ReactNode
  completed?: boolean
}

interface LearningTrackCardProps {
  title: string
  progress: number
  activities: Activity[]
  className?: string
  trilhaId?: string
  showDetailsButton?: boolean
}

export function LearningTrackCard({ title, progress, activities, className, trilhaId, showDetailsButton = false }: LearningTrackCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="bg-primary p-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-balance">{title}</h3>
          <ProgressBadge progress={progress} className="bg-primary-foreground/20 text-primary-foreground" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {activities.map((activity) => {
          const ActivityComponent = trilhaId ? (
            <Link
              href={`/trilhas/${trilhaId}/atividade/${activity.id}`}
              className="block"
            >
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-accent/50 cursor-pointer",
                  activity.completed && "bg-success/10 border-success/20",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    activity.completed ? "bg-success/20 text-success" : "bg-muted text-muted-foreground",
                  )}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className={cn("font-medium", activity.completed && "text-success")}>{activity.title}</p>
                </div>
                {activity.completed && (
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <svg className="w-3 h-3 text-success-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-accent/50 cursor-pointer",
                activity.completed && "bg-success/10 border-success/20",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg",
                  activity.completed ? "bg-success/20 text-success" : "bg-muted text-muted-foreground",
                )}
              >
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className={cn("font-medium", activity.completed && "text-success")}>{activity.title}</p>
              </div>
              {activity.completed && (
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <svg className="w-3 h-3 text-success-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          )

          return <div key={activity.id}>{ActivityComponent}</div>
        })}
      </div>
      
      {showDetailsButton && trilhaId && (
        <div className="p-4 pt-0">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/trilhas/${trilhaId}`}>
              Ver Detalhes da Trilha
            </Link>
          </Button>
        </div>
      )}
    </Card>
  )
}
