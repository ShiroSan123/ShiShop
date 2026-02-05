import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProductGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const displayImages = images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80'];

  const goTo = (index) => {
    if (index < 0) index = displayImages.length - 1;
    if (index >= displayImages.length) index = 0;
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
        <img 
          src={displayImages[currentIndex]} 
          alt="Product"
          className="w-full h-full object-cover"
        />
        
        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full shadow-lg"
              onClick={() => goTo(currentIndex - 1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full shadow-lg"
              onClick={() => goTo(currentIndex + 1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Dots indicator */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-background w-6' 
                    : 'bg-background/50 hover:bg-background/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                idx === currentIndex 
                  ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
