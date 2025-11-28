"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface MobileScrollButtonsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemCount: number;
  threshold?: number;
}

export function MobileScrollButtons({ 
  containerRef, 
  itemCount, 
  threshold = 5 
}: MobileScrollButtonsProps) {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Verifica se pode scrollar
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 10);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);

    return () => container.removeEventListener('scroll', checkScroll);
  }, [containerRef, itemCount]);

  // Não mostra os botões se não for mobile ou se tiver menos itens que o threshold
  if (!isMobile || itemCount <= threshold) {
    return null;
  }

  const scrollUp = () => {
    const container = containerRef.current;
    if (!container) return;

    // Pega o primeiro item visível
    const items = container.children;
    if (items.length === 0) return;

    const itemHeight = (items[0] as HTMLElement).offsetHeight + 12; // 12px é o gap (space-y-3)
    
    container.scrollBy({
      top: -itemHeight,
      behavior: 'smooth'
    });
  };

  const scrollDown = () => {
    const container = containerRef.current;
    if (!container) return;

    // Pega o primeiro item visível
    const items = container.children;
    if (items.length === 0) return;

    const itemHeight = (items[0] as HTMLElement).offsetHeight + 12; // 12px é o gap (space-y-3)
    
    container.scrollBy({
      top: itemHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-3 md:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={scrollUp}
        disabled={!canScrollUp}
        className="h-8 px-3 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
      >
        <ChevronUp className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Anterior</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={scrollDown}
        disabled={!canScrollDown}
        className="h-8 px-3 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
      >
        <span className="text-xs font-medium">Próximo</span>
        <ChevronDown className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
