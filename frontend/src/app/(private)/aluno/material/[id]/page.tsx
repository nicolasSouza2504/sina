'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Video, Download, Upload } from "lucide-react"
import { ContentViewer } from "@/components/KnowledgeTrail/ContentViewer"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'

export default function AlunoMaterialPage() {
  const params = useParams()
  const router = useRouter()
  const materialId = params.id as string

  const [material, setMaterial] = useState<any>(null)
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)

  useEffect(() => {
    // Simular carregamento do material
    const mockMaterial = {
      id: materialId,
      titulo: "Introdução ao React - Componentes Funcionais",
      tipo: "video",
      descricao: "Aprenda os conceitos fundamentais de componentes funcionais em React",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      conteudo: "Este material aborda os conceitos básicos de componentes funcionais...",
      materials: [
        {
          id: "video-1",
          title: "Vídeo Aula",
          type: "video" as const,
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          description: "Videoaula completa sobre React"
        },
        {
          id: "pdf-1",
          title: "Material PDF",
          type: "pdf" as const,
          url: "/sample.pdf",
          description: "Apostila com exercícios práticos"
        },
        {
          id: "text-1",
          title: "Resumo",
          type: "text" as const,
          content: "<h2>Componentes Funcionais em React</h2><p>Componentes funcionais são funções JavaScript que retornam JSX. Eles são a forma moderna e recomendada de criar componentes em React.</p><h3>Características principais:</h3><ul><li>Sintaxe mais simples e limpa</li><li>Suporte completo a Hooks</li><li>Melhor performance</li><li>Mais fácil de testar</li></ul>",
          description: "Resumo teórico do conteúdo"
        }
      ],
      tarefa: {
        id: "task-1",
        titulo: "Criar componente de formulário",
        instrucoes: "Crie um componente de formulário seguindo as melhores práticas aprendidas",
        prazo: "2024-01-20"
      }
    }
    setMaterial(mockMaterial)
  }, [materialId])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSubmissionFile(file)
    }
  }

  const handleSubmit = () => {
    if (!submissionFile) {
      return
    }
    console.log('Enviando arquivo:', submissionFile.name)
    router.push('/aluno/ead')
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando material...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {material.titulo}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {material.descricao}
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Múltiplos Formatos
                  </Badge>
                </div>
              </CardHeader>
            </Card>
            
            {/* Novo visualizador de conteúdo */}
            <ContentViewer materials={material.materials || []} />

            {material.tarefa && (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Atividade Relacionada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{material.tarefa.titulo}</h3>
                    <p className="text-gray-700">{material.tarefa.instrucoes}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Prazo: {new Date(material.tarefa.prazo).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-700">
                      Enviar arquivo da atividade
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept=".pdf,.zip,.doc,.docx"
                        onChange={handleFileUpload}
                        className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {submissionFile && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">{submissionFile.name}</span>
                        </div>
                      </div>
                    )}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleSubmit}
                      disabled={!submissionFile}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Enviar Atividade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Informações do Material
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipo</p>
                  <p className="text-gray-900 capitalize">{material.tipo}</p>
                </div>
                {material.duracao && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duração</p>
                    <p className="text-gray-900">{material.duracao}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActionsAluno />
      </div>
    </div>
  )
}

