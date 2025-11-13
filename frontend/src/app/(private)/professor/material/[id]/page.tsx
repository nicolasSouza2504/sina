"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  FileText,
  Video,
  Link as LinkIcon,
  Download,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { mockCourseService, MockMaterial } from '@/lib/services/mockCourseService';

// Função para converter URLs do YouTube para formato embed
function getYouTubeEmbedUrl(url: string): string {
  try {
    // Se já é uma URL embed, retorna como está
    if (url.includes('embed/')) {
      return url;
    }
    
    // Extrai o ID do vídeo de diferentes formatos de URL do YouTube
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
    
    return url; // Retorna a URL original se não conseguir extrair o ID
  } catch (error) {
    console.error('Erro ao converter URL do YouTube:', error);
    return url;
  }
}

export default function VisualizarMaterial() {
  const params = useParams();
  const router = useRouter();
  const materialId = params?.id as string;
  
  const [material, setMaterial] = useState<MockMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API integration to fetch material
    setMaterial(null);
    setLoading(false);
  }, [materialId]);

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-6 w-6" />;
      case 'link': return <LinkIcon className="h-6 w-6" />;
      case 'file': return <FileText className="h-6 w-6" />;
      default: return <BookOpen className="h-6 w-6" />;
    }
  };

  const getMaterialTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return '📄 Texto/Artigo';
      case 'video': return '🎥 Vídeo';
      case 'link': return '🔗 Link Externo';
      case 'file': return '📁 Arquivo';
      default: return 'Material';
    }
  };

  const downloadFile = () => {
    if (!material || !material.url) return;
    
    // Se for base64, cria um download
    if (material.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = material.url;
      link.download = material.title + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Abre em nova aba
      window.open(material.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Material não encontrado</h3>
            <p className="text-gray-600 mb-6">O material que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link href="/professor/conteudo">
                Voltar ao Gerenciar Conteúdo
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="flex gap-4">
          {material.type === 'file' && material.url && (
            <Button onClick={downloadFile} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Baixar Arquivo
            </Button>
          )}
          {(material.type === 'link' || material.type === 'video') && material.url && (
            <Button onClick={() => window.open(material.url, '_blank')} variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Link
            </Button>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm text-white">
                {getMaterialIcon(material.type)}
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  {material.title}
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                  {getMaterialTypeLabel(material.type)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Conteúdo baseado no tipo */}
          {material.type === 'text' && material.content && (
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                  {material.content}
                </pre>
              </div>
            </div>
          )}

          {material.type === 'video' && material.url && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                {material.url.includes('youtube.com') || material.url.includes('youtu.be') ? (
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={getYouTubeEmbedUrl(material.url)}
                      title={material.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={(e) => {
                        console.error('Erro ao carregar vídeo do YouTube:', e);
                      }}
                    ></iframe>
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-500">
                        Se o vídeo não carregar, clique{' '}
                        <button 
                          onClick={() => window.open(material.url, '_blank')}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          aqui para assistir no YouTube
                        </button>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Vídeo externo</p>
                    <Button onClick={() => window.open(material.url, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Assistir Vídeo
                    </Button>
                  </div>
                )}
              </div>
              {material.content && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-gray-700">{material.content}</p>
                </div>
              )}
            </div>
          )}

          {material.type === 'link' && material.url && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <LinkIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Link do recurso:</p>
                    <p className="text-blue-600 font-medium break-all mb-4">{material.url}</p>
                    <Button onClick={() => window.open(material.url, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir Link
                    </Button>
                  </div>
                </div>
              </div>
              {material.content && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-gray-700">{material.content}</p>
                </div>
              )}
            </div>
          )}

          {material.type === 'file' && material.url && (
            <div className="space-y-4">
              {/* Visualizador de PDF integrado */}
              {material.url.startsWith('data:application/pdf') || material.url.toLowerCase().endsWith('.pdf') ? (
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-green-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Visualizador de PDF</p>
                        {material.content && (
                          <p className="text-sm text-gray-600">{material.content}</p>
                        )}
                      </div>
                    </div>
                    <Button onClick={downloadFile} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                  
                  <div className="relative w-full" style={{ height: '800px' }}>
                    <iframe
                      src={material.url}
                      className="w-full h-full"
                      title={material.title}
                      style={{ border: 'none' }}
                    />
                  </div>
                </div>
              ) : (
                // Para outros tipos de arquivo (DOC, XLS, etc)
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold mb-2">Documento Disponível</p>
                    {material.content && (
                      <p className="text-gray-600 mb-4">{material.content}</p>
                    )}
                    <div className="flex gap-3 justify-center">
                      <Button onClick={downloadFile}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Arquivo
                      </Button>
                      {material.url.startsWith('http') && (
                        <Button onClick={() => window.open(material.url, '_blank')} variant="outline">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir em Nova Aba
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      💡 Dica: Use o Google Docs Viewer para visualizar documentos Word, Excel e PowerPoint online
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

