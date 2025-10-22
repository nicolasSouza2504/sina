"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  Star,
  Eye
} from 'lucide-react';
import { mockSubmissionService, StudentSubmission } from '@/lib/services/mockSubmissionService';
import { toast } from 'sonner';

interface StudentSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
}

export function StudentSubmissionsModal({
  isOpen,
  onClose,
  taskId,
  taskTitle
}: StudentSubmissionsModalProps) {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [grade, setGrade] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'reviewed' | 'approved' | 'rejected'>('reviewed');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      loadSubmissions();
    }
  }, [isOpen, taskId]);

  const loadSubmissions = () => {
    const taskSubmissions = mockSubmissionService.getSubmissionsByTask(taskId);
    setSubmissions(taskSubmissions);
  };

  const handleSelectSubmission = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || '');
    setGrade(submission.grade?.toString() || '');
    setReviewStatus(submission.status === 'pending' ? 'reviewed' : submission.status);
  };

  const handleSubmitReview = () => {
    if (!selectedSubmission) return;

    if (!grade || isNaN(parseFloat(grade)) || parseFloat(grade) < 0 || parseFloat(grade) > 10) {
      toast.error('Nota inválida', {
        description: 'Por favor, insira uma nota entre 0 e 10.'
      });
      return;
    }

    if (!feedback.trim()) {
      toast.error('Feedback obrigatório', {
        description: 'Por favor, forneça um feedback para o aluno.'
      });
      return;
    }

    const updated = mockSubmissionService.reviewSubmission(
      selectedSubmission.id,
      feedback,
      parseFloat(grade),
      reviewStatus,
      'Professor Carlos' // TODO: Pegar do contexto do usuário
    );

    if (updated) {
      toast.success('Avaliação enviada com sucesso', {
        description: `Feedback e nota foram registrados para ${selectedSubmission.studentName}.`
      });
      loadSubmissions();
      setSelectedSubmission(null);
      setFeedback('');
      setGrade('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: StudentSubmission['status']) => {
    const statusMap = {
      pending: { label: 'Pendente', variant: 'default' as const, icon: Clock, color: 'text-yellow-600' },
      reviewed: { label: 'Avaliado', variant: 'secondary' as const, icon: CheckCircle, color: 'text-blue-600' },
      approved: { label: 'Aprovado', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejected: { label: 'Reprovado', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    };

    const config = statusMap[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const reviewedCount = submissions.filter(s => s.status !== 'pending').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Materiais Entregues
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Tarefa: {taskTitle}
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Badge variant="outline" className="px-3 py-1">
              {submissions.length} {submissions.length === 1 ? 'entrega' : 'entregas'}
            </Badge>
            <Badge variant="default" className="px-3 py-1 bg-yellow-500">
              {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {reviewedCount} avaliada{reviewedCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Entregas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Entregas dos Alunos
            </h3>
            
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Nenhuma entrega ainda</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {submissions.map((submission) => (
                  <Card
                    key={submission.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedSubmission?.id === submission.id
                        ? 'border-2 border-blue-500 bg-blue-50'
                        : 'hover:shadow-md hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectSubmission(submission)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {submission.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {submission.studentName}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(submission.status)}
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700 truncate">
                          📎 {submission.fileName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Tamanho: {formatFileSize(submission.fileSize)}
                        </p>
                        {submission.grade !== undefined && (
                          <p className="text-gray-700 flex items-center gap-1 mt-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">Nota: {submission.grade.toFixed(1)}</span>
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Painel de Avaliação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Avaliar Entrega
            </h3>

            {selectedSubmission ? (
              <Card className="border-2 border-blue-200">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3">
                      {selectedSubmission.studentName}
                    </h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arquivo:</span>
                        <span className="font-medium">{selectedSubmission.fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Enviado em:</span>
                        <span className="font-medium">{formatDate(selectedSubmission.submittedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tamanho:</span>
                        <span className="font-medium">{formatFileSize(selectedSubmission.fileSize)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsPreviewOpen(true)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => toast.info('Download simulado', { description: `Arquivo: ${selectedSubmission.fileName}` })}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Nota (0-10) *</Label>
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Ex: 8.5"
                      className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status da Avaliação *</Label>
                    <select
                      id="status"
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value as any)}
                      className="w-full h-12 px-4 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl bg-white"
                    >
                      <option value="reviewed">Avaliado</option>
                      <option value="approved">Aprovado</option>
                      <option value="rejected">Reprovado</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback para o Aluno *</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Forneça um feedback detalhado sobre a entrega do aluno..."
                      rows={6}
                      className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Enviar Avaliação
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-center">
                    Selecione uma entrega à esquerda para avaliar
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="px-6">
            Fechar
          </Button>
        </div>
      </DialogContent>

      {/* Modal de Preview do Material */}
      {selectedSubmission && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Visualizar Material - {selectedSubmission.studentName}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {selectedSubmission.fileName}
              </p>
            </DialogHeader>

            <div className="mt-4">
              {/* Preview baseado no tipo de arquivo */}
              {selectedSubmission.fileType === 'application/pdf' ? (
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <div className="p-8 text-center space-y-4">
                    <FileText className="h-16 w-16 text-blue-600 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Documento PDF
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {selectedSubmission.fileName}
                      </p>
                      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto text-left">
                        <h4 className="font-semibold mb-3">Prévia do Conteúdo:</h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p>📄 Este é um exemplo de material enviado pelo aluno.</p>
                          <p>📝 Trabalho sobre: <span className="font-semibold">{taskTitle}</span></p>
                          <p>👤 Aluno: <span className="font-semibold">{selectedSubmission.studentName}</span></p>
                          <p>📅 Data de entrega: {formatDate(selectedSubmission.submittedAt)}</p>
                          <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs text-gray-600 mb-2">Conteúdo simulado do documento:</p>
                            <p className="italic">
                              "Este trabalho apresenta os conceitos fundamentais abordados durante as aulas, 
                              incluindo exemplos práticos e aplicações reais dos temas estudados. 
                              O desenvolvimento foi realizado seguindo as diretrizes estabelecidas..."
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-center mt-6">
                      <Button 
                        variant="outline"
                        onClick={() => toast.info('Download simulado', { description: selectedSubmission.fileName })}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => toast.info('Abrir em nova aba', { description: 'Funcionalidade simulada' })}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir em Nova Aba
                      </Button>
                    </div>
                  </div>
                </div>
              ) : selectedSubmission.fileType === 'application/zip' ? (
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <div className="p-8 text-center space-y-4">
                    <FileText className="h-16 w-16 text-purple-600 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Arquivo Compactado (ZIP)
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {selectedSubmission.fileName}
                      </p>
                      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto text-left">
                        <h4 className="font-semibold mb-3">Conteúdo do arquivo:</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            📁 <span className="font-mono">src/</span>
                          </li>
                          <li className="flex items-center gap-2 ml-6">
                            📄 <span className="font-mono">index.html</span> <span className="text-gray-500">(2.3 KB)</span>
                          </li>
                          <li className="flex items-center gap-2 ml-6">
                            📄 <span className="font-mono">styles.css</span> <span className="text-gray-500">(1.8 KB)</span>
                          </li>
                          <li className="flex items-center gap-2 ml-6">
                            📄 <span className="font-mono">script.js</span> <span className="text-gray-500">(4.5 KB)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            📄 <span className="font-mono">README.md</span> <span className="text-gray-500">(1.2 KB)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => toast.info('Download simulado', { description: selectedSubmission.fileName })}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar ZIP
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <div className="p-8 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Prévia não disponível para este tipo de arquivo
                    </p>
                    <Button 
                      variant="outline"
                      className="mt-4"
                      onClick={() => toast.info('Download simulado', { description: selectedSubmission.fileName })}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Arquivo
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}

