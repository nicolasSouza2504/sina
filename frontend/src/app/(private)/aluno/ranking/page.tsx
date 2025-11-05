'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Users, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'

export default function AlunoRankingPage() {
  const router = useRouter()

  const mockRanking = [
    { posicao: 1, nome: "Maria Silva", pontos: 2850, avatar: "MS", curso: "ADS 2º Semestre" },
    { posicao: 2, nome: "João Santos", pontos: 2700, avatar: "JS", curso: "ADS 3º Semestre" },
    { posicao: 3, nome: "Ana Costa", pontos: 2650, avatar: "AC", curso: "ADS 2º Semestre" },
    { posicao: 4, nome: "Pedro Oliveira", pontos: 2500, avatar: "PO", curso: "ADS 4º Semestre" },
    { posicao: 5, nome: "Carla Mendes", pontos: 2400, avatar: "CM", curso: "ADS 3º Semestre" },
    { posicao: 6, nome: "Lucas Ferreira", pontos: 2350, avatar: "LF", curso: "ADS 2º Semestre" },
    { posicao: 7, nome: "Julia Alves", pontos: 2300, avatar: "JA", curso: "ADS 4º Semestre" },
    { posicao: 8, nome: "Você", pontos: 2200, avatar: "EU", curso: "ADS 2º Semestre", isCurrentUser: true }
  ]

  const getRankIcon = (posicao: number) => {
    if (posicao === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (posicao === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (posicao === 3) return <Medal className="w-6 h-6 text-amber-600" />
    return <span className="text-lg font-bold text-gray-400">#{posicao}</span>
  }

  const getRankBadgeColor = (posicao: number) => {
    if (posicao === 1) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (posicao === 2) return "bg-gray-100 text-gray-800 border-gray-200"
    if (posicao === 3) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-gray-50 text-gray-600 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/aluno/dashboard')}
                className="text-white hover:bg-amber-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">Ranking EAD</h1>
            <p className="text-amber-100">Confira sua posição no ranking de atividades EAD</p>
          </div>
        </div>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Top Alunos
            </CardTitle>
            <CardDescription>Ranking baseado em atividades EAD completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRanking.map((aluno) => (
                <div
                  key={aluno.posicao}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    aluno.isCurrentUser
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                      : 'bg-white border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    {getRankIcon(aluno.posicao)}
                  </div>
                  
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {aluno.avatar}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${aluno.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                        {aluno.nome}
                        {aluno.isCurrentUser && (
                          <Badge className="ml-2 bg-blue-600 text-white">Você</Badge>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">{aluno.curso}</p>
                  </div>

                  <div className="text-right">
                    <Badge className={`${getRankBadgeColor(aluno.posicao)} px-3 py-1`}>
                      {aluno.pontos.toLocaleString()} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">{mockRanking.length}</p>
              <p className="text-sm text-gray-600">Alunos no Ranking</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-gray-900">{mockRanking[0]?.pontos.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Maior Pontuação</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">
                {mockRanking.find(a => a.isCurrentUser)?.posicao}º
              </p>
              <p className="text-sm text-gray-600">Sua Posição</p>
            </CardContent>
          </Card>
        </div>

        <QuickActionsAluno />
      </div>
    </div>
  )
}

