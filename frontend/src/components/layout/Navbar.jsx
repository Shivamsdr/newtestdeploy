import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { smoothScrollToTop } from '../../utils/smoothScroll';



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    smoothScrollToTop();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out ${isScrolled ? 'bg-[#050509]/80 backdrop-blur-md border-b border-white/5 shadow-xl py-2 md:py-3' : 'bg-transparent py-4 md:py-6 border-transparent'
        }`}
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="flex items-center justify-between">

          {/* Left side - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="relative z-10"
              onClick={() => { setIsOpen(false); smoothScrollToTop(); }}
            >
              <img
                src="/assets/logo.png"
                alt="Walk with History"
                className={`w-auto object-contain transition-all duration-700 ease-in-out ${isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-[110px]'}`}
              />
            </Link>
          </div>

          {/* Right side navigation & actions - Desktop */}
          <div className="hidden lg:flex items-center lg:space-x-6 xl:space-x-8">
            <Link
              to="/"
              className="text-white/90 hover:text-[#47E4FF] text-[15px] font-medium transition-all duration-300 relative group"
              onClick={smoothScrollToTop}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5B400] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/tours"
              className="text-white/90 hover:text-[#47E4FF] text-[15px] font-medium transition-all duration-300 relative group"
              onClick={smoothScrollToTop}
            >
              Experiences
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5B400] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="text-white/90 hover:text-[#47E4FF] text-[15px] font-medium transition-all duration-300 relative group"
              onClick={smoothScrollToTop}
            >
              About us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5B400] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/corporate"
              className="text-white/90 hover:text-[#47E4FF] text-[15px] font-medium transition-all duration-300 relative group"
              onClick={smoothScrollToTop}
            >
              Corporate Tours
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5B400] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/explore-goa"
              className="text-white/90 hover:text-[#47E4FF] text-[15px] font-medium transition-all duration-300 relative group"
              onClick={smoothScrollToTop}
            >
              Explore Goa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5B400] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/contact"
              className="text-white/90 hover:text-[#47E4FF] text-[15px] font-medium transition-all duration-300 relative group"
              onClick={smoothScrollToTop}
            >
              Contact us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5B400] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={smoothScrollToTop}
                className="ml-4 px-4 py-2 text-white/80 text-sm font-medium hover:text-[#47E4FF] transition-colors border border-white/10 rounded-full hover:border-[#F5B400]/50"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div className="px-4 pt-8 pb-3 space-y-4">
          <Link
            to="/"
            onClick={() => { setIsOpen(false); smoothScrollToTop(); }}
            className="block px-3 py-4 text-center text-lg font-medium text-white hover:text-[#47E4FF] border-b border-white/10"
          >
            Home
          </Link>
          <Link
            to="/tours"
            onClick={() => { setIsOpen(false); smoothScrollToTop(); }}
            className="block px-3 py-4 text-center text-lg font-medium text-white hover:text-[#47E4FF] border-b border-white/10"
          >
            Experiences
          </Link>
          <Link
            to="/about"
            onClick={() => { setIsOpen(false); smoothScrollToTop(); }}
            className="block px-3 py-4 text-center text-lg font-medium text-white hover:text-[#47E4FF] border-b border-white/10"
          >
            About us
          </Link>
          <Link
            to="/corporate"
            onClick={() => { setIsOpen(false); smoothScrollToTop(); }}
            className="block px-3 py-4 text-center text-lg font-medium text-white hover:text-[#47E4FF] border-b border-white/10"
          >
            Corporate Tours
          </Link>
          <Link
            to="/explore-goa"
            onClick={() => { setIsOpen(false); smoothScrollToTop(); }}
            className="block px-3 py-4 text-center text-lg font-medium text-white hover:text-[#47E4FF] border-b border-white/10"
          >
            Explore Goa
          </Link>
          <Link
            to="/contact"
            onClick={() => { setIsOpen(false); smoothScrollToTop(); }}
            className="block px-3 py-4 text-center text-lg font-medium text-white hover:text-[#47E4FF] border-b border-white/10"
          >
            Contact us
          </Link>

          <div className="mt-8 px-4 flex flex-col gap-4">
            <Link to="/tours" onClick={() => { setIsOpen(false); smoothScrollToTop(); }}>
              <button className="w-full px-6 py-3 bg-[#F5B400] text-black hover:bg-[#ffc107]  font-bold rounded-full shadow-[0_0_15px_rgba(71,228,255,0.3)] border-none">
                Book Now
              </button>
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => { setIsOpen(false); smoothScrollToTop(); }}
                className="w-full block text-center px-4 py-3 text-white/70 border border-white/10 rounded-full hover:bg-white/5 mt-3"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

