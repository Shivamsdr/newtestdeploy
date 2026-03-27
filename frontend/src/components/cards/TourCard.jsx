import { Link } from 'react-router-dom';
import { smoothScrollToTop } from '../../utils/smoothScroll';

const TourCard = ({ tour, linkState }) => {

  return (
    <Link
      to={`/tours/${tour._id}`}
      state={linkState}
      onClick={smoothScrollToTop}
      className="group relative w-full h-[440px] sm:h-[520px] rounded-[2rem] overflow-hidden block border border-white/10 hover:border-[#F5B400]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,180,0,0.3)] bg-[#0a0a0a]"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {tour.imageCover ? (
          <img
            src={tour.imageCover || "/placeholder.svg"}
            alt={tour.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0f0f0f] flex items-center justify-center">
            <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050509] via-[#050509]/40 to-black/30 opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>

      {/* Top Elements */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 flex justify-between items-start z-10 w-full">
        <div className="flex flex-col gap-2 items-start max-w-[60%]">
          {tour.category && (
            <div className={`backdrop-blur-md rounded-full px-3 py-1 shadow-lg border border-white/20 ${tour.category === 'achievement' ? 'bg-purple-600/80 text-white' : 'bg-[#F5B400]/90 text-black'}`}>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                {tour.category === 'achievement' ? 'Award' : tour.category}
              </span>
            </div>
          )}
        </div>

        {/* Price Tag in top right */}
        <div className="bg-gradient-to-r from-blue-600 to-[#47E4FF] rounded-2xl px-4 py-2 sm:px-5 sm:py-2.5 shadow-2xl flex-shrink-0 border border-white/20 backdrop-blur-md transform group-hover:scale-110 transition-transform duration-500">
          <span className="text-white text-lg sm:text-xl font-black tracking-wider drop-shadow-md">
            ₹{tour.price?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 flex flex-col">

        {/* Title Row */}
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="font-satisfy text-2xl sm:text-3xl font-bold text-white group-hover:text-[#F5B400] transition-colors leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex-1 mt-2">
            {tour.name}
          </h3>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm mb-3 font-semibold drop-shadow-md">
          <div className="flex items-center gap-1.5 text-white/90">
            <svg className="w-3.5 h-3.5 text-[#F5B400]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            <span className="truncate max-w-[140px]">{tour.location?.name?.split(',')[0] || 'Goa'}</span>
          </div>

          <span className="text-white/40">•</span>

          {tour.dayType && (
            <>
              <div className="flex items-center gap-1.5 text-[#47E4FF]">
                <span className="uppercase tracking-wider text-[10px] sm:text-xs">{tour.dayType.replace('-', ' ')}</span>
              </div>
              <span className="text-white/40">•</span>
            </>
          )}

          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#F5B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{tour.duration} {tour.duration === 1 ? 'Hour' : 'Hours'}</span>
          </div>
        </div>

        {/* Description / Summary */}
        <p className="text-white/70 text-xs sm:text-sm mb-5 drop-shadow-md leading-relaxed">
          {tour.shortDescription || tour.summary}
        </p>

        {/* Explore Button */}
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-3 sm:py-3.5 flex items-center justify-center gap-2 group-hover:bg-[#F5B400] transition-all duration-300 group-hover:border-[#F5B400] shadow-xl mt-auto">
          <span className="text-white group-hover:text-black font-bold text-sm tracking-wide transition-colors">Book Now</span>
          <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;

