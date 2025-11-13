"use client"

import React, { useState, use } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Upload,
  FileText,
  AlertCircle,
  Download,
  Eye
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PDFViewer } from "@/components/KnowledgeTrail/PDFViewer"
import { FileUpload } from "@/components/KnowledgeTrail/FileUpload"
import { useActivityProgress } from "@/hooks/useActivityProgress"
import { cn } from "@/lib/utils"
import QuickActionsAluno from '@/components/admin/quickActionsAluno'

const getIcon = (type: string) => {
  switch (type) {
    case "video": return <Play className="w-4 h-4" />
    case "exercise": return <FileText className="w-4 h-4" />
    case "quiz": return <CheckCircle className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Iniciante": return "bg-green-100 text-green-800"
    case "Intermediário": return "bg-yellow-100 text-yellow-800"
    case "Avançado": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "teórica": return "bg-blue-100 text-blue-800"
    case "prática": return "bg-purple-100 text-purple-800"
    case "projeto": return "bg-orange-100 text-orange-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

interface ActivityPageProps {
  params: Promise<{
    trilhaId: string
    atividadeId: string
  }>
}

/**
 * Activity Page Component
 * Features:
 * - PDF viewer with advanced controls
 * - File upload system for task submission
 * - Progress tracking and completion status
 * - Resource management and navigation
 * - Error handling and loading states
 */
export default function ActivityPage({ params }: ActivityPageProps) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("content")
  const {
    activity,
    progress,
    submission,
    isUploading,
    uploadProgress,
    isLoading,
    error,
    completeActivity,
    uploadFile,
    updateProgress,
    markAsCompleted
  } = useActivityProgress(resolvedParams.atividadeId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando atividade...</p>
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Atividade não encontrada"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const handleFileUpload = async (file: File) => {
    await uploadFile(file)
  }

  const handleMarkComplete = async () => {
    await markAsCompleted()
  }

  const pdfResource = activity.resources.find(resource => resource.type === 'pdf')
  const hasPDF = !!pdfResource

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href={`/trilhas/${resolvedParams.trilhaId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para a Trilha
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/trilhas" className="hover:underline">Trilhas</Link>
            <span>/</span>
            <Link href={`/trilhas/${resolvedParams.trilhaId}`} className="hover:underline">{activity.trilhaTitle}</Link>
            <span>/</span>
            <span className="font-medium">{activity.title}</span>
          </div>
        </div>

        {/* Activity header card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{activity.title}</CardTitle>
                <p className="text-muted-foreground mb-4">{activity.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getTypeColor(activity.type)}>
                    {activity.type}
                  </Badge>
                  <Badge className={getDifficultyColor(activity.difficulty)}>
                    {activity.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.duration}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                {activity.completed ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Concluída
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Em Progresso
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm text-muted-foreground">{progress?.progress || 0}%</span>
              </div>
              <Progress value={progress?.progress || 0} className="h-2" />
            </div>
            
            {!activity.completed && (
              <div className="flex gap-3">
                {hasPDF && (
                  <Button 
                    onClick={() => setActiveTab("content")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Material
                  </Button>
                )}
                
                {!activity.requiresUpload && (
                  <Button 
                    onClick={handleMarkComplete}
                    className="flex items-center gap-2"
                    disabled={isUploading}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar como Concluída
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main content with tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Conteúdo
            </TabsTrigger>
            {hasPDF && (
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Material PDF
              </TabsTrigger>
            )}
            {activity.requiresUpload && (
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Enviar Tarefa
              </TabsTrigger>
            )}
          </TabsList>

          {/* Content tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo da Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {activity.content ? (
                    <div dangerouslySetInnerHTML={{ __html: activity.content }} />
                  ) : (
                    <p className="text-muted-foreground">
                      Nenhum conteúdo adicional disponível para esta atividade.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Recursos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activity.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                          {getIcon(resource.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                          {resource.isRequired && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Obrigatório
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {resource.type === 'pdf' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setActiveTab("pdf")}
                          >
                            Abrir
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            Acessar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PDF tab */}
          {hasPDF && (
            <TabsContent value="pdf">
              <PDFViewer
                pdfUrl={pdfResource?.url || '/mock-pdfs/html-css-basics.pdf'}
                title={pdfResource?.title || 'Material de Estudo'}
                className="w-full"
              />
            </TabsContent>
          )}

          {/* Upload tab */}
          {activity.requiresUpload && (
            <TabsContent value="upload">
              <div className="space-y-6">
                {submission ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Tarefa Enviada
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Sua tarefa foi enviada com sucesso! Aguarde a avaliação do instrutor.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ) : (
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    uploadedFile={null}
                    maxFileSize={activity.maxFileSize}
                    allowedFileTypes={activity.allowedFileTypes}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress || undefined}
                    className="w-full"
                  />
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Quick Actions */}
        <QuickActionsAluno />
      </div>
    </div>
  )
}