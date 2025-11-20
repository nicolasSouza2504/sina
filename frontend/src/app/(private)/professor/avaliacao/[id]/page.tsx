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
  BookOpen,
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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { UserResponseResponse } from "@/lib/interfaces/userResponseInterfaces";
import type { FeedbackRegister } from "@/lib/interfaces/feedbackInterfaces";
import type { FeedbackResponseDTO } from "@/lib/interfaces/taskUserInterfaces";
import EvaluateFeedbackService from "@/lib/api/feedback/evaluateFeedback";
import ViewSubmittedContentModal from "@/components/aluno/ViewSubmittedContentModal";
import getUserFromToken from "@/lib/auth/userToken";
import { Download } from "lucide-react";

export default function AvaliacaoIndividualPage() {
  const params = useParams();
  const router = useRouter();
  const responseId = params?.id as string;
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Estados
  const [userResponse, setUserResponse] = useState<UserResponseResponse | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [taskId, setTaskId] = useState<number | null>(null);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponseDTO | null>(null); // ✅ Estado para feedback existente
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

  // Carregar dados da URL (passados via state) e ID do professor
  useEffect(() => {
    const loadData = async () => {
      try {
        // Busca ID do professor pelo token
        const userFromToken = await getUserFromToken();
        console.log('[AvaliacaoPage] User from token:', userFromToken);
        
        if (!userFromToken?.id) {
          toast.error('Erro ao identificar professor. Faça login novamente.');
          router.push('/login');
          return;
        }
        
        setTeacherId(userFromToken.id);
        console.log('[AvaliacaoPage] Teacher ID:', userFromToken.id);
        
        // Recupera dados do sessionStorage
        const storedData = sessionStorage.getItem(`evaluation_${responseId}`);
        
        if (storedData) {
          const data = JSON.parse(storedData);
          setUserResponse(data.userResponse);
          setStudentName(data.studentName);
          setTaskId(data.taskId);
          
          // ✅ Carrega feedback se existir (vem do nível raiz)
          if (data.feedback) {
            console.log('[AvaliacaoPage] Feedback encontrado:', data.feedback);
            setFeedback(data.feedback);
            setGrade(data.feedback.grade.toString());
            setComment(data.feedback.comment || '');
          } else {
            console.log('[AvaliacaoPage] Nenhum feedback encontrado - nova avaliação');
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

    if (!teacherId) {
      toast.error('ID do professor não encontrado. Recarregue a página.');
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
        teacherId: teacherId,
        grade: gradeValue,
        comment: comment.trim() || '',
      };

      console.log('[AvaliacaoPage] Enviando feedback:', feedbackData);

      // Sempre usa o endpoint de evaluate (cria ou atualiza)
      await EvaluateFeedbackService(feedbackData);
      
      toast.success('✅ Avaliação salva com sucesso!', {
        description: `Nota: ${gradeValue.toFixed(1)}`
      });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 max-w-full">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-xl flex-shrink-0">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1 max-w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words leading-tight">
                  Avaliações
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Visualize e avalie as entregas dos alunos
                </p>
              </div>
            </div>
            <Button
              onClick={handleBack}
              variant="outline"
              className="w-full sm:w-auto h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Coluna Principal - Formulário (order-2 em mobile, order-1 em desktop) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Informações do Aluno */}
            <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-blue-600 rounded-xl flex-shrink-0">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="truncate">Informações do Aluno</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="p-1.5 sm:p-2 bg-purple-600 rounded-lg flex-shrink-0">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Aluno</p>
                    <p className="text-sm font-bold text-purple-900 truncate">{studentName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-1.5 sm:p-2 bg-gray-600 rounded-lg flex-shrink-0">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Tarefa</p>
                    <p className="text-sm font-bold text-gray-900">Tarefa #{taskId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comentário do Aluno */}
            {userResponse.comment && (
              <Card className="border-2 border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                    Comentário do Aluno
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-sm sm:text-base text-gray-700 italic bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200 break-words">
                    "{userResponse.comment}"
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Arquivos Enviados */}
            {userResponse.contents && userResponse.contents.length > 0 && (
              <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                    Arquivos Enviados ({userResponse.contents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-2">
                    {userResponse.contents.map((content, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            {content.taskContentType === 'PDF' && <FileText className="h-4 w-4 text-red-500" />}
                            {content.taskContentType === 'VIDEO' && <Video className="h-4 w-4 text-purple-500" />}
                            {content.taskContentType === 'LINK' && <Link className="h-4 w-4 text-blue-500" />}
                            {content.taskContentType === 'IMAGE' && <ImageIcon className="h-4 w-4 text-green-500" />}
                            {!['PDF', 'VIDEO', 'LINK', 'IMAGE'].includes(content.taskContentType) && <FileText className="h-4 w-4 text-gray-500" />}
                          </div>
                          <div className="min-w-0 flex-1 max-w-full">
                            <p className="font-medium text-xs sm:text-sm text-gray-900 break-words leading-tight">
                              {content.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {content.taskContentType}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Mobile: Mostra botões sempre visíveis */}
                          {/* Desktop: Mostra apenas no hover */}
                          {(!isMobile || content.taskContentType === 'LINK') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg transition-colors"
                              onClick={() => handleViewContent(content)}
                              title="Visualizar conteúdo"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {isMobile && content.taskContentType !== 'LINK' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 bg-gray-800 hover:bg-gray-900 text-white hover:text-white border border-gray-800 rounded-lg transition-colors"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/user-response-content/download?url=${encodeURIComponent(content.url)}`);
                                  if (!response.ok) throw new Error('Erro ao baixar');
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = content.name || 'download';
                                  document.body.appendChild(a);
                                  a.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(a);
                                  toast.success('Download iniciado!');
                                } catch (error) {
                                  console.error('Erro ao baixar:', error);
                                  toast.error('Erro ao baixar arquivo');
                                }
                              }}
                              title="Baixar arquivo"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {!isMobile && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 bg-gray-800 hover:bg-gray-200 text-white hover:text-black border border-gray-800 rounded-lg transition-colors"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/user-response-content/download?url=${encodeURIComponent(content.url)}`);
                                  if (!response.ok) throw new Error('Erro ao baixar');
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = content.name || 'download';
                                  document.body.appendChild(a);
                                  a.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(a);
                                  toast.success('Download iniciado!');
                                } catch (error) {
                                  console.error('Erro ao baixar:', error);
                                  toast.error('Erro ao baixar arquivo');
                                }
                              }}
                              title="Baixar arquivo"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Avaliação - Exibição ou Formulário */}
            <Card className={`border-2 ${feedback ? 'border-green-200' : 'border-purple-200'} rounded-xl shadow-sm hover:shadow-md transition-shadow`}>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className={`text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 ${feedback ? 'text-green-900' : ''}`}>
                  <div className="p-2 bg-blue-600 rounded-xl flex-shrink-0">
                    <Star className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${feedback ? 'text-green-600' : 'text-purple-600'}`} />
                  </div>
                  <span className="truncate">{feedback ? 'Avaliação Realizada' : 'Avaliação'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {feedback ? (
                  /* Exibição dos dados da avaliação */
                  <div className="space-y-4 sm:space-y-6">
                    {/* Nota */}
                    <div className="p-4 sm:p-6 bg-green-50 rounded-lg sm:rounded-xl border-2 border-green-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide mb-1">Nota Atribuída</p>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            <span className="text-3xl sm:text-4xl font-bold text-green-900">
                              {feedback.grade.toFixed(1)}
                            </span>
                            <span className="text-base sm:text-lg text-green-700">/10.0</span>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 flex-shrink-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Avaliado
                        </Badge>
                      </div>
                      
                      {/* Professor que avaliou */}
                      <div className="pt-3 sm:pt-4 border-t border-green-200">
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Avaliado por</p>
                        <p className="text-sm font-medium text-green-900 truncate">{feedback.teacher.nome}</p>
                        <p className="text-xs text-green-600 truncate">{feedback.teacher.email}</p>
                      </div>
                    </div>

                    {/* Comentário */}
                    {feedback.comment && (
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700">
                          Comentário do Professor
                        </Label>
                        <div className="p-3 sm:p-4 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{feedback.comment}</p>
                        </div>
                      </div>
                    )}

                    {/* Botão Voltar */}
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="w-full sm:w-auto order-2 sm:order-1 h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl font-semibold text-sm sm:text-base"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para Avaliações
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Formulário de avaliação */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nota */}
                      <div className="space-y-2">
                        <Label htmlFor="grade" className="text-xs sm:text-sm font-semibold text-gray-700">
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
                          className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 rounded-xl text-sm sm:text-base"
                        />
                        <p className="text-xs text-gray-500">
                          Digite uma nota de 0 a 10
                        </p>
                      </div>
                      
                      {/* Preview da Nota */}
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700">
                          Preview
                        </Label>
                        <div className="h-12 flex items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xl sm:text-2xl font-bold text-blue-900">
                              {grade || '0.0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Comentário */}
                  <div className="space-y-2">
                    <Label htmlFor="comment" className="text-xs sm:text-sm font-semibold text-gray-700">
                      Comentário
                    </Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Adicione um comentário sobre a entrega do aluno..."
                      rows={4}
                      className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 rounded-xl resize-none text-sm sm:text-base"
                    />
                  </div>

                  {/* Botão Voltar */}
                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl font-semibold text-sm sm:text-base"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar para Avaliações
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving || !grade}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl font-semibold text-sm sm:text-base"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {userResponse.feedback ? 'Atualizar' : 'Salvar'}
                        </>
                      )}
                    </Button>
                  </div>
              </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral - Resumo (order-1 em mobile, order-2 em desktop) */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          {/* Status Atual */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                Status Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {feedback ? (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-green-900">
                      Já Avaliado
                    </span>
                  </div>
                  
                  <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Nota Atual:</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        {feedback.grade.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {feedback.comment && (
                    <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Comentário Atual:</p>
                      <p className="text-sm text-gray-800 italic line-clamp-3">
                        "{feedback.comment}"
                      </p>
                    </div>
                  )}

                  <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Avaliado por:</p>
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {feedback.teacher.nome}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {feedback.teacher.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-orange-50 border-2 border-orange-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-orange-900">
                      Pendente de Avaliação
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Esta entrega ainda não foi avaliada. Preencha o formulário {isMobile ? 'abaixo' : 'ao lado'} para adicionar uma nota e comentário.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">
                  Entregue em {userResponse.createdAt ? new Date(userResponse.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4 flex-shrink-0" />
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
    </div>
  );
}
