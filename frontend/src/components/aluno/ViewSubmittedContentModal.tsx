"use client"

import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  FileText, 
  Video, 
  Image as ImageIcon, 
  Music, 
  Link as LinkIcon, 
  Type,
  FileType,
  Download,
  Loader2,
  AlertCircle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import fetchUserResponseContentClient from '@/lib/api/user-response-content/fetchUserResponseContent.client';

interface ViewSubmittedContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentName: string;
  contentType: string;
  contentUrl: string;
}

const contentTypeIcons: Record<string, any> = {
  'PDF': FileText,
  'VIDEO': Video,
  'MP4': Video,
  'JPG': ImageIcon,
  'PNG': ImageIcon,
  'MP3': Music,
  'DOCX': FileType,
  'LINK': LinkIcon,
  'TEXT': Type
};

const contentTypeColors: Record<string, string> = {
  'PDF': 'bg-red-100 text-red-700 border-red-200',
  'VIDEO': 'bg-purple-100 text-purple-700 border-purple-200',
  'MP4': 'bg-purple-100 text-purple-700 border-purple-200',
  'JPG': 'bg-blue-100 text-blue-700 border-blue-200',
  'PNG': 'bg-blue-100 text-blue-700 border-blue-200',
  'MP3': 'bg-green-100 text-green-700 border-green-200',
  'DOCX': 'bg-orange-100 text-orange-700 border-orange-200',
  'LINK': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'TEXT': 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function ViewSubmittedContentModal({
  open,
  onOpenChange,
  contentName,
  contentType,
  contentUrl
}: ViewSubmittedContentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentData, setContentData] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>('');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const loadContent = useCallback(async () => {
    if (!contentUrl) {
      console.log('[ViewSubmittedContentModal] contentUrl vazio, abortando carregamento');
      return;
    }

    console.log('[ViewSubmittedContentModal] Iniciando carregamento:', { contentType, contentUrl });
    setIsLoading(true);
    setError(null);

    try {
      // Para LINK, usar contentUrl diretamente
      if (contentType === 'LINK') {
        console.log('[ViewSubmittedContentModal] Tipo LINK, usando URL diretamente');
        setContentData(contentUrl);
        setIsLoading(false);
        return;
      }

      console.log('[ViewSubmittedContentModal] Buscando arquivo da API...');
      // Buscar o arquivo da API usando o endpoint /user-response-content/find
      const { data, mimeType } = await fetchUserResponseContentClient(contentUrl);
      console.log('[ViewSubmittedContentModal] Arquivo recebido:', { mimeType, size: data.byteLength });
      
      // Converter ArrayBuffer para Blob e criar URL
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      console.log('[ViewSubmittedContentModal] Blob URL criada:', url);
      
      // Se for texto, ler o conteúdo
      if (contentType === 'TEXT' || mimeType.includes('text')) {
        const text = await blob.text();
        setTextContent(text);
      }
      
      setContentData(url);
      console.log('[ViewSubmittedContentModal] Conteúdo carregado com sucesso');
    } catch (err) {
      console.error('[ViewSubmittedContentModal] Erro ao carregar conteúdo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar conteúdo';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [contentUrl, contentType]);

  useEffect(() => {
    if (open && contentUrl) {
      loadContent();
    } else {
      // Reset ao fechar
      setContentData(null);
      setTextContent('');
      setError(null);
    }
  }, [open, contentUrl, loadContent]);

  const handleDownload = () => {
    if (contentData) {
      const a = document.createElement('a');
      a.href = contentData;
      a.download = contentName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const Icon = contentTypeIcons[contentType] || FileText;
  const colorClass = contentTypeColors[contentType] || contentTypeColors['TEXT'];

  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Carregando seu arquivo...</p>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600 font-semibold mb-2">Erro ao carregar arquivo</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <Button 
            onClick={loadContent} 
            className="mt-4"
            variant="outline"
          >
            Tentar Novamente
          </Button>
        </div>
      );
    }

    // Content loaded
    if (!contentData) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Nenhum conteúdo disponível</p>
        </div>
      );
    }

    // Renderizar baseado no tipo
    switch (contentType) {
      case 'PDF':
        return (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex-1 min-h-0">
              <iframe
                src={contentData}
                className="w-full h-full rounded-lg border-2 border-gray-200"
                title={contentName}
              />
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button 
                onClick={handleDownload}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        );

      case 'VIDEO':
      case 'MP4':
        return (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex-1 min-h-0 flex items-center justify-center bg-black rounded-lg">
              <video
                controls
                className="w-full h-full max-w-full rounded-lg"
                src={contentData}
              >
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button 
                onClick={handleDownload}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Vídeo
              </Button>
            </div>
          </div>
        );

      case 'JPG':
      case 'PNG':
        return (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex-1 min-h-0 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <img
                src={contentData}
                alt={contentName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button 
                onClick={handleDownload}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Imagem
              </Button>
            </div>
          </div>
        );

      case 'MP3':
        return (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex-1 min-h-0 bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center">
              <Music className="h-16 w-16 text-gray-400 mb-4" />
              <audio
                src={contentData}
                controls
                className="w-full max-w-md"
              >
                Seu navegador não suporta a tag de áudio.
              </audio>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button 
                onClick={handleDownload}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Áudio
              </Button>
            </div>
          </div>
        );

      case 'TEXT':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {textContent}
              </pre>
            </div>
            <Button 
              onClick={handleDownload}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Texto
            </Button>
          </div>
        );

      case 'LINK':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-8 border-2 border-blue-200">
              <LinkIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <p className="text-center text-gray-700 mb-4">Link externo</p>
              <p className="text-sm text-gray-600 text-center break-all mb-6">
                {contentData}
              </p>
              <Button 
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <a href={contentData} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Link
                </a>
              </Button>
            </div>
          </div>
        );

      case 'DOCX':
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-8 border-2 border-orange-200">
              <FileType className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <p className="text-center text-gray-700 mb-2">Documento Word</p>
              <p className="text-sm text-gray-600 text-center mb-6">
                Faça o download para visualizar
              </p>
              <Button 
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Documento
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-center text-gray-700 mb-6">
                Tipo de arquivo não suportado para visualização
              </p>
              <Button 
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Arquivo
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${
        isMobile 
          ? 'w-[98vw] max-w-[98vw] min-h-[80vh] h-[90vh]' 
          : 'w-[95vw] max-w-[1200px] min-h-[80vh] h-[85vh]'
      } overflow-hidden flex flex-col`}>
        <DialogHeader className="border-b border-gray-100 pb-4 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Arquivo Enviado
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${colorClass} border-2 font-semibold`}>
                  <Icon className="w-3 h-3 mr-1" />
                  {contentType}
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-2 border-green-200 font-semibold">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Enviado
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2 break-all">
                {contentName}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 min-h-0">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
