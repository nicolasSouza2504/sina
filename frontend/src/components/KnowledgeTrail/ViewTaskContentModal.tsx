"use client"

import { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import fetchTaskContent from '@/lib/api/task-content/fetchTaskContent';

interface ViewTaskContentModalProps {
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

export default function ViewTaskContentModal({
  open,
  onOpenChange,
  contentName,
  contentType,
  contentUrl
}: ViewTaskContentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentData, setContentData] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>('');
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (open && contentUrl) {
      loadContent();
    } else {
      // Reset ao fechar
      setContentData(null);
      setTextContent('');
      setError(null);
    }
  }, [open, contentUrl]);

  const loadContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Para LINK, usar contentUrl diretamente (não fazer fetch)
      if (contentType === 'LINK') {
        setContentData(contentUrl);
        setIsLoading(false);
        return;
      }

      // Para outros tipos, buscar o arquivo da API
      const { data, mimeType } = await fetchTaskContent(contentUrl);
      
      // Converter ArrayBuffer para Blob e criar URL
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      // Se for texto, ler o conteúdo
      if (contentType === 'TEXT' || mimeType.includes('text')) {
        const text = await blob.text();
        setTextContent(text);
      }
      
      setContentData(url);
    } catch (err) {
      console.error('Erro ao carregar conteúdo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar conteúdo');
    } finally {
      setIsLoading(false);
    }
  };

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
    // Em mobile, não renderizar o conteúdo - apenas mostrar informações e botão de download
    if (isMobile) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="p-4 bg-blue-50 rounded-full mb-4">
            <Icon className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
            Visualização disponível apenas no desktop
          </h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Para visualizar este conteúdo diretamente, acesse pelo computador. Você pode fazer o download para visualizar no seu dispositivo.
          </p>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Button
              onClick={handleDownload}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Arquivo
            </Button>
            
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600 font-medium mb-2">Erro ao carregar</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <Button
            onClick={loadContent}
            variant="outline"
            className="mt-4"
          >
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (!contentData) {
      return null;
    }

    // PDF
    if (contentType === 'PDF') {
      return (
        <div className="w-full h-[70vh] border-2 border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={contentData}
            className="w-full h-full"
            title={contentName}
          />
        </div>
      );
    }

    // Imagens (JPG, PNG)
    if (contentType === 'JPG' || contentType === 'PNG') {
      return (
        <div className="w-full flex justify-center items-center bg-gray-50 rounded-lg p-4">
          <img
            src={contentData}
            alt={contentName}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      );
    }

    // Vídeo (MP4, VIDEO)
    if (contentType === 'MP4' || contentType === 'VIDEO') {
      return (
        <div className="w-full border-2 border-gray-200 rounded-lg overflow-hidden bg-black">
          <video
            src={contentData}
            controls
            className="w-full max-h-[70vh]"
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      );
    }

    // Áudio (MP3) - Player
    if (contentType === 'MP3') {
      return (
        <div className="w-full flex flex-col items-center justify-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
          <Music className="h-20 w-20 text-green-600 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Áudio</h3>
          <audio
            src={contentData}
            controls
            className="w-full max-w-2xl"
            style={{
              outline: 'none',
            }}
          >
            Seu navegador não suporta o elemento de áudio.
          </audio>
        </div>
      );
    }

    // Texto (TEXT) - Apenas download
    if (contentType === 'TEXT') {
      return (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg">
          <Type className="h-20 w-20 text-gray-600 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Arquivo de Texto</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Faça o download para visualizar o conteúdo do arquivo.
          </p>
          <Button
            onClick={handleDownload}
            className="bg-gray-600 hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Arquivo
          </Button>
        </div>
      );
    }

    // DOCX (Documento Word) - Apenas download
    if (contentType === 'DOCX') {
      return (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
          <FileType className="h-20 w-20 text-orange-600 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Documento Word</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Arquivos DOCX não podem ser visualizados diretamente no navegador.
            <br />
            Faça o download para abrir no Microsoft Word ou similar.
          </p>
          <Button
            onClick={handleDownload}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Documento
          </Button>
        </div>
      );
    }

    // Link - Renderiza YouTube embed ou mostra link
    if (contentType === 'LINK') {
      const getYouTubeEmbedUrl = (url: string): string | null => {
        try {
          // Verifica se é um link do YouTube
          if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            return null;
          }

          let videoId = '';
          
          if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0] || '';
          } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
          } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0] || '';
          }
          
          if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
          }
          
          return null;
        } catch (error) {
          console.error('Erro ao processar URL do YouTube:', error);
          return null;
        }
      };

      const youtubeEmbedUrl = getYouTubeEmbedUrl(contentUrl);

      if (youtubeEmbedUrl) {
        // Renderizar vídeo do YouTube
        return (
          <div className="w-full space-y-4">
            <div className="w-full aspect-video border-2 border-gray-200 rounded-lg overflow-hidden bg-black">
              <iframe
                src={youtubeEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video"
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <LinkIcon className="h-4 w-4" />
              <a
                href={contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 hover:underline"
              >
                {contentUrl}
              </a>
            </div>
          </div>
        );
      }

      // Link normal (não YouTube)
      return (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
          <LinkIcon className="h-20 w-20 text-indigo-600 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Link Externo</h3>
          
          <div className="w-full max-w-2xl mb-6">
            <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">URL:</p>
              <a
                href={contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 hover:underline break-all text-sm"
              >
                {contentUrl}
              </a>
            </div>
          </div>

          <Button
            onClick={() => window.open(contentUrl, '_blank')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Link em Nova Aba
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">Tipo de conteúdo não suportado para visualização</p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader className="pb-3 sm:pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-10 sm:pr-12">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-lg ${colorClass.split(' ')[0]} flex-shrink-0`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colorClass.split(' ')[1]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  {contentName}
                </DialogTitle>
                <Badge 
                  variant="outline" 
                  className={`${colorClass} text-xs mt-1`}
                >
                  {contentType}
                </Badge>
              </div>
            </div>
            {!isMobile && contentData && !error && contentType !== 'LINK' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 sm:h-9 text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Baixar</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
