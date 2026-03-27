import { Link } from 'react-router-dom';
import { smoothScrollToTop } from '../../utils/smoothScroll';

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-gray-300 mt-auto border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F5B400]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/logo.png"
                alt="Walk with History"
                className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(245,180,0,0.3)]"
              />
              <h3 className="text-xl font-bold text-[#F5B400]">Walk with History</h3>
            </div>
            <p className="text-[#47E4FF] font-semibold tracking-wide text-sm">
              HERITAGE TOURS IN GOA
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Embark on a journey through time. Discover the rich heritage, hidden stories, and cultural soul of Goa with our expert-guided experiences.
            </p>

            {/* Social Links */}
            <div className="flex space-x-5 pt-2">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E1306C] transition-colors hover:-translate-y-1 transform duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors hover:-translate-y-1 transform duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF0000] transition-colors hover:-translate-y-1 transform duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white border-b border-[#F5B400]/30 inline-block pb-1">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={smoothScrollToTop}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={smoothScrollToTop}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tours
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={smoothScrollToTop}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/explore-goa" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={smoothScrollToTop}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Explore Goa
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={(e) => {
                  if (window.location.pathname === '/') {
                    const el = document.getElementById('faq');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/policies" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={smoothScrollToTop}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Policies
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={smoothScrollToTop}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={smoothScrollToTop}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#47E4FF] transition-colors duration-200 flex items-center group" onClick={smoothScrollToTop}>
                  <span className="w-1.5 h-1.5 bg-[#F5B400] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white border-b border-[#F5B400]/30 inline-block pb-1">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#F5B400] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <Link to="/contact" className="hover:text-white transition-colors" onClick={smoothScrollToTop}>Contact Us</Link>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#F5B400] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">Panjim, Goa, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Walk with History. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
