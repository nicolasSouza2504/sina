import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserWelcomeProps {
  name: string
  avatarUrl?: string
}

export function UserWelcome({ name, avatarUrl }: UserWelcomeProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
      <Avatar className="w-16 h-16">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">{initials}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold text-balance">Bem-vindo, {name}</h2>
        <p className="text-muted-foreground">Continue sua jornada de aprendizado</p>
      </div>
    </div>
  )
}
