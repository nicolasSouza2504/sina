"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Video, 
  Image, 
  Music, 
  Link as LinkIcon, 
  Type,
  FileType,
  Eye,
  Download,
  X
} from 'lucide-react';
import type { TaskContentSummary } from '@/lib/interfaces/courseContentInterfaces';
import ViewTaskContentModal from './ViewTaskContentModal';

interface TaskMaterialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  materials: TaskContentSummary[];
}

const contentTypeIcons: Record<string, any> = {
  'PDF': FileText,
  'VIDEO': Video,
  'MP4': Video,
  'JPG': Image,
  'PNG': Image,
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

const contentTypeLabels: Record<string, string> = {
  'PDF': 'PDF',
  'VIDEO': 'Vídeo',
  'MP4': 'Vídeo',
  'JPG': 'Imagem',
  'PNG': 'Imagem',
  'MP3': 'Áudio',
  'DOCX': 'DOCX',
  'LINK': 'Link',
  'TEXT': 'Texto'
};

// Tipos que podem ser visualizados no modal
const canPreview = (type: string): boolean => {
  return ['PDF', 'MP4', 'JPG', 'PNG', 'MP3', 'LINK'].includes(type);
};

export default function TaskMaterialsModal({
  open,
  onOpenChange,
  taskName,
  materials
}: TaskMaterialsModalProps) {
  const [selectedContent, setSelectedContent] = useState<TaskContentSummary | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const handleViewContent = (material: TaskContentSummary) => {
    setSelectedContent(material);
    setIsViewModalOpen(true);
  };

  const handleDownload = async (material: TaskContentSummary) => {
    try {
      // Buscar o arquivo
      const response = await fetch(`/api/task-content/download?url=${encodeURIComponent(material.contentUrl)}`);
      
      if (!response.ok) {
        throw new Error('Erro ao baixar arquivo');
      }
      
      // Criar blob e fazer download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `material-${material.id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar:', error);
      // Fallback: abrir em nova aba
      window.open(material.contentUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900">
                Materiais da Tarefa
              </DialogTitle>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{taskName}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
          {materials.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-sm sm:text-base text-gray-500 font-medium">Nenhum material adicionado</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Adicione materiais para esta tarefa
              </p>
            </div>
          ) : (
            materials.map((material) => {
              const Icon = contentTypeIcons[material.contentType] || FileText;
              const colorClass = contentTypeColors[material.contentType] || contentTypeColors['TEXT'];
              const typeLabel = contentTypeLabels[material.contentType] || material.contentType;

              return (
                <div
                  key={material.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className={`p-2 sm:p-3 rounded-lg ${colorClass.split(' ')[0]} flex-shrink-0 self-start sm:self-center`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClass.split(' ')[1]}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {material.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`${colorClass} text-xs flex-shrink-0`}
                      >
                        {typeLabel}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {material.contentUrl}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {canPreview(material.contentType) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewContent(material)}
                        className={`${material.contentType === 'LINK' ? 'flex-1' : 'flex-1 sm:flex-none'} h-9 px-3 sm:px-4 border-2 hover:bg-purple-50 hover:border-purple-300 text-xs sm:text-sm`}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Visualizar</span>
                        <span className="sm:hidden">Ver</span>
                      </Button>
                    )}
                    {material.contentType !== 'LINK' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(material)}
                        className={`h-9 ${canPreview(material.contentType) ? 'w-9 sm:w-auto' : 'flex-1'} sm:px-4 border-2 hover:bg-blue-50 hover:border-blue-300 ${canPreview(material.contentType) ? 'p-0 sm:p-2' : ''}`}
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline sm:ml-2">Baixar</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-100 mt-4 sm:mt-6">
          <Button 
            onClick={() => onOpenChange(false)}
            className="h-10 sm:h-11 px-4 sm:px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl w-full sm:w-auto text-sm sm:text-base"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>

      {selectedContent && (
        <ViewTaskContentModal
          open={isViewModalOpen}
          onOpenChange={(open) => {
            setIsViewModalOpen(open);
            if (!open) {
              setSelectedContent(null);
            }
          }}
          contentName={selectedContent.name}
          contentType={selectedContent.contentType}
          contentUrl={selectedContent.contentUrl}
        />
      )}
    </Dialog>
  );
}
