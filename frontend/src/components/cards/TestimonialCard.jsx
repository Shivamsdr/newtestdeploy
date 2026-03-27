const TestimonialCard = ({ testimonial }) => {
  // Support both new API structure (message, rating, image) and legacy (review, location)
  const message = testimonial.message || testimonial.review;
  const rating = testimonial.rating || 5;

  return (
    <div className="group relative bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-xl hover:shadow-[#FDB913]/20 hover:shadow-2xl p-6 h-full transition-all duration-500 ease-out cursor-pointer border border-[#FDB913]/10 backdrop-blur-sm hover:transform hover:-translate-y-2 hover:border-[#FDB913]/30">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FDB913]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Quote icon */}
      <div className="absolute top-4 right-4 text-[#FDB913]/20 group-hover:text-[#FDB913]/40 transition-colors duration-300">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.995 3.638-3.995 5.849h3.983v10h-9.984z" />
        </svg>
      </div>
      
      <div className="flex items-center mb-4 relative z-10">
        {testimonial.image ? (
          <div className="relative">
            <img
              src={testimonial.image || "/placeholder.svg"}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FDB913]/20 group-hover:ring-[#FDB913]/40 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FDB913]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FDB913]/10 to-[#FDB913]/5 flex items-center justify-center text-[#FDB913] font-semibold text-lg border border-[#FDB913]/20 group-hover:from-[#FDB913]/20 group-hover:to-[#FDB913]/10 transition-all duration-300">
            {testimonial.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <div className="ml-4">
          <h4 className="font-semibold text-gray-100 text-lg group-hover:text-[#FDB913] transition-colors duration-300">
            {testimonial.name}
          </h4>
          {testimonial.location && (
            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {testimonial.location}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex mb-3 relative z-10">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm transition-all duration-300 ${i < rating ? 'text-amber-400 hover:scale-125 hover:text-amber-300' : 'text-gray-600'} ${i < rating ? 'drop-shadow-sm' : ''}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            ★
          </span>
        ))}
      </div>
      
      <p className="text-gray-300 italic leading-relaxed text-base transition-all duration-300 group-hover:text-gray-100 relative z-10">
        <span className="absolute left-0 top-0 text-[#FDB913]/20 group-hover:text-[#FDB913]/40 transition-colors duration-300">"</span>
        {message}
        <span className="absolute right-0 bottom-0 text-[#FDB913]/20 group-hover:text-[#FDB913]/40 transition-colors duration-300">"</span>
      </p>
    </div>
  );
};

export default TestimonialCard;
