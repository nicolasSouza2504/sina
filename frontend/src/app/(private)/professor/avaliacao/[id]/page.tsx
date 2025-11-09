'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Star,
  User,
  FileText,
  Video,
  Link,
  ExternalLink,
  Loader2,
  Calendar,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import type { UserResponseResponse, FeedbackRegister } from "@/lib/interfaces/userResponseInterfaces";
import CreateFeedbackService from "@/lib/api/feedback/createFeedback";
import UpdateFeedbackService from "@/lib/api/feedback/updateFeedback";
import ViewSubmittedContentModal from "@/components/aluno/ViewSubmittedContentModal";

export default function AvaliacaoIndividualPage() {
  const params = useParams();
  const router = useRouter();
  const responseId = params?.id as string;

  // Estados
  const [userResponse, setUserResponse] = useState<UserResponseResponse | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [taskId, setTaskId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados do formulário
  const [grade, setGrade] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  
  // Estados do modal de visualização
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{
    name: string;
    type: string;
    url: string;
  } | null>(null);

  // Carregar dados da URL (passados via state)
  useEffect(() => {
    const loadData = () => {
      try {
        // Recupera dados do sessionStorage
        const storedData = sessionStorage.getItem(`evaluation_${responseId}`);
        
        if (storedData) {
          const data = JSON.parse(storedData);
          setUserResponse(data.userResponse);
          setStudentName(data.studentName);
          setTaskId(data.taskId);
          
          // Se já existe feedback, preenche o formulário
          if (data.userResponse.feedback) {
            setGrade(data.userResponse.feedback.grade.toString());
            setComment(data.userResponse.feedback.comment || '');
          }
        } else {
          toast.error('Dados da avaliação não encontrados');
          router.push('/professor/avaliacao');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados da avaliação');
        router.push('/professor/avaliacao');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [responseId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userResponse) {
      toast.error('Dados da resposta não encontrados');
      return;
    }

    const gradeValue = parseFloat(grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 10) {
      toast.error('A nota deve ser um número entre 0 e 10');
      return;
    }

    setIsSaving(true);

    try {
      const feedbackData: FeedbackRegister = {
        userResponseId: userResponse.id,
        grade: gradeValue,
        comment: comment.trim() ? comment.trim() : '',
      };

      if (userResponse.feedback) {
        // Atualizar feedback existente
        await UpdateFeedbackService(userResponse.feedback.id, feedbackData);
        toast.success('✅ Avaliação atualizada com sucesso!', {
          description: `Nota: ${gradeValue.toFixed(1)}`
        });
      } else {
        // Criar novo feedback
        await CreateFeedbackService(feedbackData);
        toast.success('✅ Avaliação criada com sucesso!', {
          description: `Nota: ${gradeValue.toFixed(1)}`
        });
      }

      // Limpa o sessionStorage
      sessionStorage.removeItem(`evaluation_${responseId}`);
      
      // Volta para a tela de avaliação
      router.push('/professor/avaliacao');
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      toast.error('❌ Erro ao salvar avaliação', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    // Limpa o sessionStorage ao voltar
    sessionStorage.removeItem(`evaluation_${responseId}`);
    router.push('/professor/avaliacao');
  };

  const handleViewContent = (content: { name: string; taskContentType: string; url: string }) => {
    setSelectedContent({
      name: content.name,
      type: content.taskContentType,
      url: content.url
    });
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados da avaliação...</p>
        </div>
      </div>
    );
  }

  if (!userResponse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md border-2 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Dados não encontrados</h2>
              <p className="text-gray-600 mb-4">Não foi possível carregar os dados da avaliação.</p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
      {/* Header com Botão Voltar */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="mb-4 border-2 border-gray-200 hover:border-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Avaliações
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600 rounded-xl">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {userResponse.feedback ? 'Editar Avaliação' : 'Avaliar Entrega'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {userResponse.feedback ? 'Atualize a nota e comentário da avaliação' : 'Adicione nota e comentário para a entrega do aluno'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Formulário */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Aluno */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Informações do Aluno
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Aluno</p>
                  <p className="text-sm font-bold text-purple-900">{studentName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-2 bg-gray-600 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Tarefa</p>
                  <p className="text-sm font-bold text-gray-900">Tarefa #{taskId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comentário do Aluno */}
          {userResponse.comment && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Comentário do Aluno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 italic bg-blue-50 p-4 rounded-lg border border-blue-200">
                  "{userResponse.comment}"
                </p>
              </CardContent>
            </Card>
          )}

          {/* Arquivos Enviados */}
          {userResponse.contents && userResponse.contents.length > 0 && (
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Arquivos Enviados ({userResponse.contents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userResponse.contents.map((content, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        {content.taskContentType === 'PDF' && <FileText className="h-4 w-4 text-red-500" />}
                        {content.taskContentType === 'VIDEO' && <Video className="h-4 w-4 text-purple-500" />}
                        {content.taskContentType === 'LINK' && <Link className="h-4 w-4 text-blue-500" />}
                        {content.taskContentType === 'IMAGE' && <ImageIcon className="h-4 w-4 text-green-500" />}
                        {!['PDF', 'VIDEO', 'LINK', 'IMAGE'].includes(content.taskContentType) && <FileText className="h-4 w-4 text-gray-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {content.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {content.taskContentType}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleViewContent(content)}
                          title="Visualizar conteúdo"
                        >
                          <Eye className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(content.url, '_blank')}
                          title="Abrir em nova aba"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulário de Avaliação */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-600" />
                Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nota */}
                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-sm font-semibold text-gray-700">
                      Nota <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="grade"
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="0.0 a 10.0"
                      required
                      className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors rounded-xl"
                    />
                    <p className="text-xs text-gray-500">
                      Digite uma nota de 0 a 10
                    </p>
                  </div>

                  {/* Preview da Nota */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Preview da Nota
                    </Label>
                    <div className="h-12 flex items-center justify-center bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-2xl font-bold text-purple-900">
                          {grade || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comentário */}
                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-sm font-semibold text-gray-700">
                    Comentário (opcional)
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adicione um comentário sobre a entrega do aluno..."
                    rows={4}
                    className="border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors rounded-xl resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Forneça feedback construtivo para o aluno
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSaving}
                    className="w-full sm:w-auto order-2 sm:order-1 h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving || !grade}
                    className="w-full sm:w-auto order-1 sm:order-2 h-12 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {userResponse.feedback ? 'Atualizar Avaliação' : 'Salvar Avaliação'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral - Resumo */}
        <div className="space-y-6">
          {/* Status Atual */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Status Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userResponse.feedback ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-900">
                      Já Avaliado
                    </span>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Nota Atual:</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-xl font-bold text-gray-900">
                        {userResponse.feedback.grade.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {userResponse.feedback.comment && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Comentário Atual:</p>
                      <p className="text-sm text-gray-800 italic">
                        "{userResponse.feedback.comment}"
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Avaliado por:</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {userResponse.feedback.teacher.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {userResponse.feedback.teacher.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-orange-50 border-2 border-orange-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-900">
                      Pendente de Avaliação
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Esta entrega ainda não foi avaliada. Preencha o formulário ao lado para adicionar uma nota e comentário.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Entregue em {userResponse.createdAt ? new Date(userResponse.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>
                  {userResponse.contents?.length || 0} arquivo(s) enviado(s)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Visualização de Conteúdo */}
      {selectedContent && (
        <ViewSubmittedContentModal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          contentName={selectedContent.name}
          contentType={selectedContent.type}
          contentUrl={selectedContent.url}
        />
      )}
    </div>
  );
}
