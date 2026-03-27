import { useState, useRef, useEffect, Children } from 'react';

const Carousel = ({ children, itemsPerView = { mobile: 1, tablet: 2, desktop: 3 }, className = '', autoScroll = true, scrollInterval = 4000 }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const currentIndexRef = useRef(0);

  // Normalize children to an array for consistent behavior
  const items = Children.toArray(children);

  // If there are too few items to create a natural scroll (e.g. only 1–3),
  // duplicate them so there is always enough content to move.
  const maxPerView =
    itemsPerView.desktop || itemsPerView.tablet || itemsPerView.mobile || 1;
  const displayItems =
    items.length > 0 && items.length <= maxPerView ? [...items, ...items] : items;

  // Auto-scroll functionality: move to the next item every scrollInterval ms
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    if (!isAutoScrolling || displayItems.length <= 1) {
      return;
    }

    autoScrollIntervalRef.current = setInterval(() => {
      autoScrollNext();
    }, scrollInterval);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isAutoScrolling, displayItems.length, scrollInterval]);

  // Auto-scroll to next item
  const autoScrollNext = () => {
    if (!scrollContainerRef.current || displayItems.length <= 1) return;

    const container = scrollContainerRef.current;
    const firstChild = container.children[0];
    if (!firstChild) return;

    const cardWidth = firstChild.offsetWidth || 0;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Calculate next position
    currentIndexRef.current = (currentIndexRef.current + 1) % displayItems.length;
    const nextScrollPosition = currentIndexRef.current * scrollAmount;

    // If we've reached the end, reset to start
    if (nextScrollPosition >= maxScroll) {
      currentIndexRef.current = 0;
      container.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        left: nextScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const checkScrollability = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      // Initial check after a short delay to ensure layout is complete
      setTimeout(checkScrollability, 100);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [displayItems]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const firstChild = container.children[0];
    if (!firstChild) return;

    const cardWidth = firstChild.offsetWidth || 0;
    const gap = 24; // gap-6 = 24px
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });

    // Update current index for auto-scroll continuity
    if (direction === 'next') {
      currentIndexRef.current = (currentIndexRef.current + 1) % displayItems.length;
    } else {
      currentIndexRef.current =
        currentIndexRef.current === 0
          ? displayItems.length - 1
          : currentIndexRef.current - 1;
    }
  };

  const totalItems = displayItems.length;
  const showArrows = totalItems > 1;

  // Calculate responsive width classes
  const getWidthClass = () => {
    if (itemsPerView.desktop === 4) {
      return 'w-[85vw] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-64px)/3)] xl:w-[calc((100%-96px)/4)]';
    } else if (itemsPerView.desktop === 3) {
      return 'w-[85vw] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-64px)/3)]';
    } else if (itemsPerView.desktop === 2) {
      return 'w-[85vw] sm:w-[calc((100%-24px)/2)]';
    }
    return 'w-[85vw]';
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsAutoScrolling(false)}
      onMouseLeave={() => setIsAutoScrolling(autoScroll)}
    >
      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={() => scroll('prev')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full p-3 shadow-2xl border border-white/10 bg-black/50 backdrop-blur-xl hover:bg-black/70 hover:border-[#F5B400]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${!canScrollLeft ? 'opacity-30' : ''
              }`}
            aria-label="Previous items"
          >
            <svg className="w-6 h-6 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('next')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full p-3 shadow-2xl border border-white/10 bg-black/50 backdrop-blur-xl hover:bg-black/70 hover:border-[#F5B400]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${!canScrollRight ? 'opacity-30' : ''
              }`}
            aria-label="Next items"
          >
            <svg className="w-6 h-6 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-6 pt-2 px-2 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {displayItems.map((child, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${getWidthClass()} transform transition-transform duration-300`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Scrollbar Hide Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Carousel;
