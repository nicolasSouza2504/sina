"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Star,
  User,
  FileText,
  Download,
  Loader2,
  Video,
  Link,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { FeedbackFormData, FeedbackResponse, UserResponseResponse } from "@/lib/interfaces/userResponseInterfaces";
import CreateFeedbackService from "@/lib/api/feedback/createFeedback";
import UpdateFeedbackService from "@/lib/api/feedback/updateFeedback";
import { toast } from "sonner";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userResponse: UserResponseResponse;
  studentName: string;
  studentEmail: string;
  taskId: number;
}

export function FeedbackModal({
  open,
  onOpenChange,
  userResponse,
  studentName,
  studentEmail,
  taskId,
}: FeedbackModalProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    comment: "",
    grade: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Inicializa formulário com dados existentes se houver feedback
  useEffect(() => {
    if (userResponse.feedback) {
      setFormData({
        comment: userResponse.feedback.comment || "",
        grade: userResponse.feedback.grade || 0,
      });
      setIsEditing(true);
    } else {
      setFormData({
        comment: "",
        grade: 0,
      });
      setIsEditing(false);
    }
  }, [userResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      toast.error("O comentário é obrigatório");
      return;
    }

    if (formData.grade < 0 || formData.grade > 10) {
      toast.error("A nota deve estar entre 0 e 10");
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData = {
        userResponseId: userResponse.id,
        comment: formData.comment.trim(),
        grade: formData.grade,
      };

      let result;
      if (isEditing && userResponse.feedback) {
        // Atualiza feedback existente
        result = await UpdateFeedbackService(userResponse.feedback.id, feedbackData);
        toast.success("✅ Avaliação atualizada com sucesso!");
      } else {
        // Cria novo feedback
        result = await CreateFeedbackService(feedbackData);
        toast.success("✅ Avaliação salva com sucesso!");
      }

      // Atualiza o userResponse com o feedback retornado
      userResponse.feedback = result;
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar feedback:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao salvar avaliação");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (content: any) => {
    try {
      const response = await fetch(`/api/task-content/download?url=${encodeURIComponent(content.contentUrl)}`);
      if (!response.ok) throw new Error('Erro ao baixar arquivo');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = content.name || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      // Fallback: abre em nova aba
      window.open(content.contentUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-xl ${
              isEditing ? 'bg-green-600' : 'bg-blue-600'
            }`}>
              {isEditing ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <Star className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {isEditing ? "Editar Avaliação" : "Avaliar Entrega"}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Tarefa #{taskId} - {studentName}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Aluno */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Aluno</p>
                  <p className="font-semibold text-gray-900">{studentName}</p>
                  <p className="text-sm text-gray-600">{studentEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Status da Avaliação</p>
                  {isEditing ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Avaliação Realizada
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pendente de Avaliação
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comentário do Aluno */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Label className="text-sm font-semibold text-blue-900 mb-2 block">
              Comentário do Aluno
            </Label>
            <p className="text-blue-800">
              {userResponse.comment || "Sem comentário"}
            </p>
          </div>

          {/* Arquivos Enviados */}
          {userResponse.contents && userResponse.contents.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">
                Arquivos Enviados ({userResponse.contents.length})
              </Label>
              <div className="space-y-2">
                {userResponse.contents?.map((content, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      {content.taskContentType === 'PDF' && <FileText className="h-4 w-4 text-red-500" />}
                      {content.taskContentType === 'VIDEO' && <Video className="h-4 w-4 text-purple-500" />}
                      {content.taskContentType === 'LINK' && <Link className="h-4 w-4 text-blue-500" />}
                      {content.taskContentType === 'IMAGE' && <Image className="h-4 w-4 text-green-500" />}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(content.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de Avaliação */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-sm font-semibold text-gray-700">
                  Nota <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: parseFloat(e.target.value) || 0 })}
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                  placeholder="0.0"
                  required
                />
                <p className="text-xs text-gray-600">Nota de 0 a 10</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Avaliação Anterior
                </Label>
                <div className="h-12 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        {userResponse.feedback?.grade.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Sem avaliação anterior</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="text-sm font-semibold text-gray-700">
                Comentário do Professor <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="min-h-[120px] border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl resize-none"
                placeholder="Digite seu feedback sobre a entrega do aluno..."
                required
              />
              {isEditing && (
                <p className="text-xs text-blue-600">
                  💡 Editando avaliação existente
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 h-11 rounded-xl font-semibold ${
                  isEditing 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Atualizar Avaliação
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Salvar Avaliação
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
