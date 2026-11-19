import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { imageConfig } from '../config/imageConfig';

const HeroBanner = () => {
  const slides = imageConfig.heroBanners;

  // Extended slides with clone of first slide for seamless right-to-left loop
  const extendedSlides = [...slides, slides[0]];
  const totalSlides = extendedSlides.length; // 5 items

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef(null);

  // Transition to next slide (right-to-left)
  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Transition to previous slide
  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Handle transition end for infinite looping
  const handleTransitionEnd = () => {
    // If reached the cloned first slide at index = slides.length (4), snap back to 0 seamlessly without animation
    if (currentIndex === slides.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  // Re-enable transition after seamless snap
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Automatic right-to-left sliding interval (4.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    slideTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [isPaused, nextSlide]);

  // Handle dot click
  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Active dot index (modulo slides.length so clone maps to index 0)
  const activeDotIndex = currentIndex % slides.length;

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FAF6EE] select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional Hero Banner Slider"
    >
      {/* Slider Viewport Container */}
      <div className="relative w-full overflow-hidden">
        {/* Track with exact percentage calculations:
            width = 500% (for 5 slides)
            translation = -(currentIndex * 100 / 5)% = -(currentIndex * 20)%
        */}
        <div
          className="flex will-change-transform"
          style={{
            width: `${totalSlides * 100}%`,
            transform: `translateX(-${(currentIndex * 100) / totalSlides}%)`,
            transition: isTransitioning
              ? 'transform 800ms cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              style={{ width: `${100 / totalSlides}%` }}
              className="flex-shrink-0 relative overflow-hidden"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-auto block object-cover select-none"
                loading={idx === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Previous & Next Chevron Navigation Arrows (hover accessible) */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm z-20 hover:scale-105 active:scale-95"
          aria-label="Previous banner"
          title="Previous"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm z-20 hover:scale-105 active:scale-95"
          aria-label="Next banner"
          title="Next"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Center Navigation Dots */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-2 sm:space-x-2.5 z-20 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
          {slides.map((slide, dotIdx) => {
            const isActive = activeDotIndex === dotIdx;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#FFF98D] shadow-sm'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white/90'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}: ${slide.title || slide.alt}`}
                aria-current={isActive ? 'true' : 'false'}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
