"use client"

import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  X, 
  FileText, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface SubmitTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  taskUserId: number | null;
  onSubmitSuccess: () => void;
}

export default function SubmitTaskModal({
  open,
  onOpenChange,
  taskName,
  taskUserId,
  onSubmitSuccess
}: SubmitTaskModalProps) {
  const [commentary, setCommentary] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validações
    if (!taskUserId) {
      toast.error('Erro ao identificar a tarefa. Recarregue a página e tente novamente.');
      return;
    }

    if (files.length === 0) {
      toast.error('Adicione pelo menos um arquivo para enviar');
      return;
    }

    if (!commentary.trim()) {
      toast.error('Adicione um comentário sobre sua entrega');
      return;
    }

    try {
      setIsSubmitting(true);

      // Importação dinâmica do serviço (server action)
      const { default: SubmitTaskResponseService } = await import('@/lib/api/user-response/submitTaskResponse');

      const result = await SubmitTaskResponseService({
        taskUserId,
        commentary: commentary.trim(),
        files
      });

      toast.success('✅ Atividade enviada com sucesso!', {
        description: `${files.length} arquivo(s) enviado(s)`
      });

      // Limpar formulário
      setCommentary('');
      setFiles([]);
      
      // Fechar modal
      onOpenChange(false);
      
      // Callback de sucesso
      onSubmitSuccess();
    } catch (error) {
      console.error('Erro ao enviar atividade:', error);
      toast.error('❌ Erro ao enviar atividade', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`${
          isMobile 
            ? 'w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh]' 
            : 'w-[90vw] max-w-[600px] max-h-[85vh]'
        } overflow-y-auto`}>
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Enviar Atividade
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              {taskName}
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Alerta informativo */}
            <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    Atenção
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Após enviar, você não poderá editar ou remover sua resposta. Certifique-se de que todos os arquivos estão corretos.
                  </p>
                </div>
              </div>
            </div>

            {/* Comentário */}
            <div className="space-y-2">
              <Label htmlFor="commentary" className="text-sm font-semibold text-gray-900">
                Comentário sobre a entrega *
              </Label>
              <Textarea
                id="commentary"
                placeholder="Descreva sua entrega, dificuldades encontradas, observações..."
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                {commentary.length} caracteres
              </p>
            </div>

            {/* Upload de arquivos */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">
                Arquivos da atividade *
              </Label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.zip,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700">
                    Clique para selecionar arquivos
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, ZIP, DOC, DOCX, JPG, PNG, MP4, MP3, TXT
                  </p>
                </label>
              </div>

              {/* Lista de arquivos selecionados */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Arquivos selecionados ({files.length})
                  </p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          disabled={isSubmitting}
                          className="h-8 w-8 p-0 hover:bg-red-100 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-gray-100 pt-4 flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto order-2 sm:order-1 h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || files.length === 0 || !commentary.trim()}
              className="w-full sm:w-auto order-1 sm:order-2 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Enviar Atividade
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
