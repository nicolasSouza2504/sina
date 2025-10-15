import { cn } from "@/lib/utils"

interface ProgressBadgeProps {
  progress: number
  className?: string
}

export function ProgressBadge({ progress, className }: ProgressBadgeProps) {
  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-success text-success-foreground"
    if (progress >= 60) return "bg-warning text-warning-foreground"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-sm font-medium",
        getProgressColor(progress),
        className,
      )}
    >
      {progress}% Concluído
    </div>
  )
}
