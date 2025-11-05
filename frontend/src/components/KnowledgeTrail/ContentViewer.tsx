'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Video, BookOpen, Download, ExternalLink } from "lucide-react"

interface ContentMaterial {
  id: string
  title: string
  type: 'pdf' | 'video' | 'text'
  url?: string
  content?: string
  description?: string
}

interface ContentViewerProps {
  materials: ContentMaterial[]
}

export function ContentViewer({ materials }: ContentViewerProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<ContentMaterial | null>(
    materials.length > 0 ? materials[0] : null
  )

  const renderMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
      case 'text':
        return <BookOpen className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const renderContent = (material: ContentMaterial) => {
    switch (material.type) {
      case 'pdf':
        return (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              {material.url ? (
                <iframe
                  src={material.url}
                  className="w-full h-[600px] rounded-lg border-2 border-gray-300"
                  title={material.title}
                />
              ) : (
                <div className="py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Documento PDF</p>
                  <p className="text-sm text-gray-500 mt-2">{material.description}</p>
                </div>
              )}
            </div>
            {material.url && (
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir em Nova Aba
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href={material.url} download>
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </a>
                </Button>
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            {material.url ? (
              <div className="bg-black rounded-lg overflow-hidden">
                {material.url.includes('youtube.com') || material.url.includes('youtu.be') ? (
                  <iframe
                    src={material.url.replace('watch?v=', 'embed/')}
                    className="w-full aspect-video"
                    title={material.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    className="w-full aspect-video"
                    src={material.url}
                  >
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center py-24">
                <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Vídeo Educacional</p>
                <p className="text-sm text-gray-500 mt-2">{material.description}</p>
              </div>
            )}
          </div>
        )

      case 'text':
        return (
          <div className="prose max-w-none">
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
              {material.content ? (
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: material.content }}
                />
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Conteúdo em Texto</p>
                  <p className="text-sm text-gray-500 mt-2">{material.description}</p>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Tipo de conteúdo não suportado</p>
          </div>
        )
    }
  }

  if (materials.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Nenhum material disponível</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Materiais de Estudo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={materials[0]?.id} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${materials.length}, 1fr)` }}>
              {materials.map((material) => (
                <TabsTrigger
                  key={material.id}
                  value={material.id}
                  onClick={() => setSelectedMaterial(material)}
                  className="flex items-center gap-2"
                >
                  {renderMaterialIcon(material.type)}
                  <span className="hidden sm:inline">{material.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {materials.map((material) => (
              <TabsContent key={material.id} value={material.id} className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
                    {material.description && (
                      <p className="text-sm text-gray-600 mb-4">{material.description}</p>
                    )}
                  </div>
                  {renderContent(material)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

