import { Link } from 'react-router-dom';
import { smoothScrollToTop } from '../../utils/smoothScroll';

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50">
      <Link
        to="/tours"
        onClick={smoothScrollToTop}
        className="flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#F5B400] text-black shadow-[0_0_20px_rgba(245,180,0,0.5)] hover:shadow-[0_0_30px_rgba(245,180,0,0.8)] hover:bg-[#ffc107] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5B400] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 z-[100]"
        aria-label="Book a tour"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-base sm:text-lg font-bold tracking-wide">Book Now</span>
      </Link>
    </div>
  );
};

export default FloatingContact;

