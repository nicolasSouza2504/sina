"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Download,
  Loader2,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FileValidationResult, UploadProgress } from '@/lib/types/activityTypes'

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>
  onFileRemove?: () => void
  uploadedFile?: File | null
  maxFileSize?: number // in MB
  allowedFileTypes?: string[]
  isUploading?: boolean
  uploadProgress?: UploadProgress
  className?: string
}

/**
 * Advanced File Upload Component with drag & drop, validation, and progress tracking
 * Features:
 * - Drag & drop functionality
 * - File type and size validation
 * - Upload progress tracking
 * - Error handling and user feedback
 * - File preview and management
 */
export function FileUpload({
  onFileUpload,
  onFileRemove,
  uploadedFile,
  maxFileSize = 10, // 10MB default
  allowedFileTypes = ['.pdf', '.doc', '.docx', '.txt'],
  isUploading = false,
  uploadProgress,
  className
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): FileValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      errors.push(`Arquivo muito grande. Tamanho máximo: ${maxFileSize}MB`)
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedFileTypes.includes(fileExtension)) {
      errors.push(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedFileTypes.join(', ')}`)
    }

    // Warnings for large files
    if (fileSizeMB > maxFileSize * 0.8) {
      warnings.push('Arquivo próximo ao limite de tamanho')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }, [maxFileSize, allowedFileTypes])

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateFile(file)
    setValidationResult(validation)

    if (validation.isValid) {
      onFileUpload(file)
    }
  }, [validateFile, onFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleRemoveFile = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileRemove?.()
    setValidationResult(null)
  }, [onFileRemove])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />
      case 'txt':
        return <FileText className="w-8 h-8 text-gray-500" />
      default:
        return <FileText className="w-8 h-8 text-gray-500" />
    }
  }

  if (uploadedFile) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Arquivo Enviado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
            <div className="flex items-center gap-3">
              {getFileIcon(uploadedFile.name)}
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Enviado
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                disabled={isUploading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Enviar Tarefa Concluída
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            isUploading && "pointer-events-none opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <div>
                <p className="font-medium">Enviando arquivo...</p>
                {uploadProgress && (
                  <div className="mt-2">
                    <Progress value={uploadProgress.percentage} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {uploadProgress.percentage}% concluído
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">
                  Arraste seu arquivo aqui ou clique para selecionar
                </p>
                <p className="text-sm text-muted-foreground">
                  Tipos aceitos: {allowedFileTypes.join(', ')} • Máximo: {maxFileSize}MB
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Selecionar Arquivo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept={allowedFileTypes.join(',')}
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {validationResult && !validationResult.isValid && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-1">
                {validationResult.errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {validationResult && validationResult.warnings.length > 0 && (
          <Alert className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <p key={index}>{warning}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
