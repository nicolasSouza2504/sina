"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, FileText, Video, Image, Music, Link as LinkIcon, Type, FileType } from 'lucide-react';
import type { TaskContentFormData, TaskContentType } from '@/lib/interfaces/taskContentInterfaces';

interface CreateTaskContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number;
  taskName: string;
  onSubmit: (data: TaskContentFormData) => Promise<void>;
}

const contentTypeMap: Record<string, TaskContentType> = {
  'PDF': 'PDF',
  'Vídeo (MP4)': 'MP4',
  'Imagem (JPG)': 'JPG',
  'Imagem (PNG)': 'PNG',
  'Áudio (MP3)': 'MP3',
  'Link': 'LINK',
  'Texto e DOCX': 'TEXT'
};

// Mapeamento de tipos aceitos por cada opção
const acceptedFileTypes: Record<TaskContentType, string> = {
  'PDF': '.pdf',
  'VIDEO': '.mp4',
  'MP4': '.mp4',
  'JPG': '.jpg,.jpeg',
  'PNG': '.png',
  'MP3': '.mp3',
  'DOCX': '.txt,.docx',
  'LINK': '',
  'TEXT': '.txt,.docx'
};

const contentTypeIcons: Record<TaskContentType, any> = {
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

const contentTypeColors: Record<TaskContentType, string> = {
  'PDF': 'text-red-600',
  'VIDEO': 'text-purple-600',
  'MP4': 'text-purple-600',
  'JPG': 'text-blue-600',
  'PNG': 'text-blue-600',
  'MP3': 'text-green-600',
  'DOCX': 'text-orange-600',
  'LINK': 'text-indigo-600',
  'TEXT': 'text-gray-600'
};

export default function CreateTaskContentModal({
  open,
  onOpenChange,
  taskId,
  taskName,
  onSubmit
}: CreateTaskContentModalProps) {
  const [formData, setFormData] = useState<TaskContentFormData>({
    name: '',
    taskContentType: 'PDF',
    file: null,
    link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        taskContentType: 'PDF',
        file: null,
        link: ''
      });
      setFileName('');
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedTypes = acceptedFileTypes[formData.taskContentType];
      
      if (acceptedTypes && !acceptedTypes.split(',').some(type => fileExtension === type)) {
        alert(`Tipo de arquivo inválido. Tipos aceitos: ${acceptedTypes}`);
        e.target.value = ''; // Limpar input
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.name.trim()) {
      return;
    }

    // Se for LINK, validar URL ao invés de arquivo
    if (formData.taskContentType === 'LINK') {
      if (!formData.link?.trim()) {
        alert('Por favor, insira a URL do link');
        return;
      }
    } else {
      // Para outros tipos, validar arquivo
      if (!formData.file) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Icon = contentTypeIcons[formData.taskContentType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-600 rounded-xl">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Adicionar Material
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Faça upload de conteúdo para a tarefa
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Contexto da Tarefa */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Tarefa</span>
              </div>
              <p className="text-sm text-purple-700 font-medium">{taskName}</p>
            </div>

            {/* Nome do Material */}
            <div className="space-y-2">
              <Label htmlFor="content-name" className="text-sm font-semibold text-gray-700">
                Nome do Material <span className="text-red-500">*</span>
              </Label>
              <Input
                id="content-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Apostila de Introdução, Vídeo Aula 01..."
                className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors rounded-xl"
                disabled={isSubmitting}
              />
            </div>

            {/* Tipo de Conteúdo */}
            <div className="space-y-2">
              <Label htmlFor="content-type" className="text-sm font-semibold text-gray-700">
                Tipo de Conteúdo <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={Object.keys(contentTypeMap).find(key => contentTypeMap[key] === formData.taskContentType)} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  taskContentType: contentTypeMap[value] 
                }))}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF" className="py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="Vídeo (MP4)" className="py-3">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-purple-600" />
                      Vídeo (MP4)
                    </div>
                  </SelectItem>
                  <SelectItem value="Imagem (JPG)" className="py-3">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-blue-600" />
                      Imagem (JPG)
                    </div>
                  </SelectItem>
                  <SelectItem value="Imagem (PNG)" className="py-3">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-blue-600" />
                      Imagem (PNG)
                    </div>
                  </SelectItem>
                  <SelectItem value="Áudio (MP3)" className="py-3">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-green-600" />
                      Áudio (MP3)
                    </div>
                  </SelectItem>
                  <SelectItem value="Link" className="py-3">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-indigo-600" />
                      Link
                    </div>
                  </SelectItem>
                  <SelectItem value="Texto e DOCX" className="py-3">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4 text-gray-600" />
                      Texto e DOCX
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo de Link (apenas para tipo LINK) */}
            {formData.taskContentType === 'LINK' ? (
              <div className="space-y-2">
                <Label htmlFor="content-link" className="text-sm font-semibold text-gray-700">
                  URL do Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="content-link"
                  type="url"
                  placeholder="https://exemplo.com ou https://youtube.com/watch?v=..."
                  value={formData.link || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  disabled={isSubmitting}
                  className="h-12 border-2 border-gray-300 focus:border-indigo-500 rounded-xl"
                />
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">💡 Dica:</span> Links do YouTube serão renderizados como vídeo embed
                </p>
              </div>
            ) : (
              /* Upload de Arquivo (para outros tipos) */
              <div className="space-y-2">
                <Label htmlFor="content-file" className="text-sm font-semibold text-gray-700">
                  Arquivo <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <input
                    id="content-file"
                    type="file"
                    accept={acceptedFileTypes[formData.taskContentType]}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="content-file"
                    className={`flex items-center justify-center gap-3 h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      formData.file
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {formData.file ? (
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={`h-8 w-8 ${contentTypeColors[formData.taskContentType]}`} />
                        <span className="text-sm font-medium text-gray-700">{fileName}</span>
                        <span className="text-xs text-gray-500">Clique para alterar</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          Clique para selecionar o arquivo
                        </span>
                        <span className="text-xs text-gray-500">
                          Ou arraste e solte aqui
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                {/* Informação sobre tipos aceitos */}
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Tipos aceitos:</span> {acceptedFileTypes[formData.taskContentType] || 'Todos os tipos'}
                </p>
              </div>
            )}
          </div>

          {/* Footer com Botões */}
          <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 mt-6">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-xl"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className="h-12 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={
                isSubmitting || 
                !formData.name.trim() || 
                (formData.taskContentType === 'LINK' ? !formData.link?.trim() : !formData.file)
              }
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Material
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
