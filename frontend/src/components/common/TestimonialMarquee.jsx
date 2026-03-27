import React, { useMemo } from 'react';

// Card: Optimized for performance - removed backdrop-blur, simplified shadows/transitions
const TestimonialCard = React.memo(({ testimonial }) => {
    const rating = testimonial.rating || 5;
    const message = testimonial.message || testimonial.review;

    return (
        <div className="w-full flex-shrink-0 mb-6 p-6 rounded-2xl bg-[#111111]/90 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
                {testimonial.image ? (
                    <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5B400] to-[#ffc107] flex items-center justify-center text-black font-bold text-lg ring-2 ring-white/20">
                        {testimonial.name?.charAt(0) || 'U'}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm tracking-wide truncate pr-4">
                        {testimonial.name}
                    </h4>
                    <div className="flex text-[#F5B400] text-xs gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < rating ? 'opacity-100' : 'opacity-30'}>★</span>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-white/80 text-sm leading-relaxed italic relative">
                <span className="text-[#F5B400]/40 text-xl font-serif absolute -top-2 -left-2">"</span>
                {message}
            </p>
        </div>
    );
});

TestimonialCard.displayName = 'TestimonialCard';

// Column component that handles the vertical scrolling
const TestimonialColumn = React.memo(({ testimonials, duration = '60s', reverse = false, className = '' }) => {
    // Ensure we have enough items for smooth scroll by duplicating
    const items = useMemo(() => {
        return testimonials.length < 5
            ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
            : [...testimonials, ...testimonials]; // Duplicate at least once for seamless loop
    }, [testimonials]);

    return (
        <div className={`relative h-[600px] sm:h-[700px] md:h-[800px] overflow-hidden group ${className}`}>
            <div
                className={`flex flex-col will-change-transform translate-z-0 group-hover:[animation-play-state:paused] ${reverse ? 'animate-scrollY-reverse' : 'animate-scrollY'}`}
                style={{ animationDuration: duration }}
            >
                {items.map((t, i) => (
                    <TestimonialCard key={`${t._id}-${i}`} testimonial={t} />
                ))}
            </div>
        </div>
    );
});

TestimonialColumn.displayName = 'TestimonialColumn';

const TestimonialMarquee = ({ testimonials = [] }) => {
    // Split testimonials into 3 chunks for columns
    const { col1, col2, col3 } = useMemo(() => {
        const chunkSize = Math.ceil(testimonials.length / 3);
        return {
            col1: testimonials.slice(0, chunkSize),
            col2: testimonials.slice(chunkSize, chunkSize * 2),
            col3: testimonials.slice(chunkSize * 2)
        };
    }, [testimonials]);

    // Fallback if empty cols
    const safeCol1 = col1.length ? col1 : testimonials;
    const safeCol2 = col2.length ? col2 : testimonials;
    const safeCol3 = col3.length ? col3 : testimonials;

    return (
        <div className="relative">
            {/* Global Blending Vignettes (Bottom/Left/Right) - using simpler gradients */}
            <div className="absolute inset-x-0 top-0 h-32 sm:h-40 z-20 pointer-events-none bg-gradient-to-b from-black to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-black via-black/90 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-black via-black/60 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-black via-black/60 to-transparent z-20 pointer-events-none" />

            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px] sm:h-[700px] md:h-[800px] overflow-hidden"
                style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
            >
                <TestimonialColumn testimonials={safeCol1} duration="55s" />
                <TestimonialColumn testimonials={safeCol2} duration="65s" reverse={true} className="hidden md:block translate-y-[-50px]" />
                <TestimonialColumn testimonials={safeCol3} duration="60s" className="hidden lg:block" />
            </div>
        </div>
    );
};

export default React.memo(TestimonialMarquee);
