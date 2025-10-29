"use client"

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
  ExternalLink,
  Download,
  X
} from 'lucide-react';
import type { TaskContentSummary } from '@/lib/interfaces/courseContentInterfaces';

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
  'LINK': 'Link',
  'TEXT': 'Texto'
};

export default function TaskMaterialsModal({
  open,
  onOpenChange,
  taskName,
  materials
}: TaskMaterialsModalProps) {
  
  const handleOpenContent = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Materiais da Tarefa
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">{taskName}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {materials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 font-medium">Nenhum material adicionado</p>
              <p className="text-sm text-gray-400 mt-1">
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
                  className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-lg ${colorClass.split(' ')[0]}`}>
                    <Icon className={`h-6 w-6 ${colorClass.split(' ')[1]}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        Material {material.id}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`${colorClass} text-xs`}
                      >
                        {typeLabel}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {material.contentUrl}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenContent(material.contentUrl)}
                      className="h-9 px-4 border-2 hover:bg-purple-50 hover:border-purple-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenContent(material.contentUrl)}
                      className="h-9 px-4 border-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <Button 
            onClick={() => onOpenChange(false)}
            className="h-11 px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
