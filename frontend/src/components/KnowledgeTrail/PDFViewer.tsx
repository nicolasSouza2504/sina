"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Maximize2, 
  Minimize2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PDFViewerProps {
  pdfUrl: string
  title: string
  onPageChange?: (page: number) => void
  onZoomChange?: (zoom: number) => void
  className?: string
}

/**
 * Advanced PDF Viewer Component with zoom, rotation, and navigation controls
 * Features:
 * - Zoom in/out with custom levels
 * - Page rotation (0°, 90°, 180°, 270°)
 * - Fullscreen mode
 * - Page navigation
 * - Download functionality
 * - Loading states and error handling
 */
export function PDFViewer({ 
  pdfUrl, 
  title, 
  onPageChange, 
  onZoomChange, 
  className 
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const zoomLevels = [50, 75, 100, 125, 150, 200, 300]
  
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    // Simulate PDF loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTotalPages(15) // Mock total pages
    }, 1500)

    return () => clearTimeout(timer)
  }, [pdfUrl])

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoom)
    if (currentIndex < zoomLevels.length - 1) {
      const newZoom = zoomLevels[currentIndex + 1]
      setZoom(newZoom)
      onZoomChange?.(newZoom)
    }
  }

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoom)
    if (currentIndex > 0) {
      const newZoom = zoomLevels[currentIndex - 1]
      setZoom(newZoom)
      onZoomChange?.(newZoom)
    }
  }

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
  }

  const handleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      onPageChange?.(newPage)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title}.pdf`
    link.click()
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar PDF</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full overflow-hidden", className)} ref={containerRef}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline">PDF</Badge>
        </div>
      </CardHeader>

      {/* Controls */}
      <div className="border-b bg-muted/50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= zoomLevels[0]}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-sm font-medium min-w-[60px] text-center">
              {zoom}%
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= zoomLevels[zoomLevels.length - 1]}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Rotation */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              title="Rotacionar"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Page Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-medium min-w-[80px] text-center">
                {currentPage} / {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <CardContent className="p-0">
        <div className="relative h-[600px] bg-muted/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Carregando PDF...</p>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#page=${currentPage}&zoom=${zoom}&rotation=${rotation}`}
              className="w-full h-full border-0"
              title={title}
              onError={() => setError('Não foi possível carregar o PDF')}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
