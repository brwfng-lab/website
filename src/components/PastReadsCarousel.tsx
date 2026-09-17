"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image_url: string;
}

export default function PastReadsCarousel({ pastBooks }: { pastBooks: Book[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!pastBooks || pastBooks.length === 0) {
    return (
      <div className="bg-white rounded-none p-12 text-center border border-slate-200 border-dashed">
        <p className="text-slate-500">No past reads yet. We&apos;re just getting started!</p>
      </div>
    );
  }

  // Ensure we have enough items to show the lush 3D effect (at least 5 items)
  const displayBooks = pastBooks.length >= 5 ? pastBooks : [
    ...pastBooks, 
    ...Array(5 - pastBooks.length).fill(null).map((_, i) => ({
      ...pastBooks[i % pastBooks.length],
      id: `${pastBooks[i % pastBooks.length].id}-${i}-duplicate`
    }))
  ];

  const next = () => {
    setActiveIndex((current) => (current + 1) % displayBooks.length);
  };

  const prev = () => {
    setActiveIndex((current) => (current - 1 + displayBooks.length) % displayBooks.length);
  };

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center overflow-hidden group">
      
      {/* Left Button */}
      <button 
        onClick={prev}
        className="absolute left-4 md:left-12 z-50 p-3 bg-white/80 backdrop-blur border border-slate-200 shadow-lg text-slate-900 hover:bg-white transition-all hover:scale-110"
        aria-label="Previous book"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* 3D Coverflow Container */}
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center perspective-[1000px]">
        {displayBooks.map((book, index) => {
          // Calculate offset relative to active index
          let offset = index - activeIndex;
          
          // Handle wrap-around for smooth infinite carousel feel
          if (offset < -Math.floor(displayBooks.length / 2)) {
            offset += displayBooks.length;
          }
          if (offset > Math.floor(displayBooks.length / 2)) {
            offset -= displayBooks.length;
          }

          // Determine styles based on offset
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 2; // Show center + 2 on each side
          
          // Calculate transforms
          const translateX = offset * 65; // Move 65% of card width per step to overlap heavily
          const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.2; // Center 1, neighbors 0.8, 0.6...
          const zIndex = 50 - Math.abs(offset);
          const opacity = isVisible ? (isActive ? 1 : 1 - Math.abs(offset) * 0.15) : 0;

          return (
            <div 
              key={book.id} 
              onClick={() => setActiveIndex(index)}
              className={`absolute top-1/2 left-1/2 -ml-[120px] -mt-[180px] w-[240px] h-[360px] transition-all duration-500 ease-out cursor-pointer ${
                isActive ? 'shadow-2xl' : 'shadow-md'
              }`}
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                zIndex,
                opacity,
                pointerEvents: isVisible ? 'auto' : 'none'
              }}
            >
              <div className="w-full h-full relative bg-slate-900 border border-slate-200 group/card">
                {book.cover_image_url ? (
                  <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <span className="text-slate-400 text-sm">No Cover</span>
                  </div>
                )}
                
                {/* Content Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'}`}>
                  <h3 className="font-light tracking-wide text-white text-lg truncate mb-1">{book.title}</h3>
                  <p className="text-sm text-slate-300 truncate mb-4">{book.author}</p>
                  
                  {isActive && (
                    <Link 
                      href={`/reviews`} 
                      className="inline-block w-full text-center bg-white text-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Rating
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Button */}
      <button 
        onClick={next}
        className="absolute right-4 md:right-12 z-50 p-3 bg-white/80 backdrop-blur border border-slate-200 shadow-lg text-slate-900 hover:bg-white transition-all hover:scale-110"
        aria-label="Next book"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-50">
        {displayBooks.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-slate-900 w-6' : 'bg-slate-400 hover:bg-slate-600'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
