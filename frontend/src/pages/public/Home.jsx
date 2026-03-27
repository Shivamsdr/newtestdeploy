import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTours, getTestimonials, getPublicSettings } from '../../services/api';
import Button from '../../components/common/Button';
import TourCard from '../../components/cards/TourCard';
import TestimonialCard from '../../components/cards/TestimonialCard';
import Loader from '../../components/common/Loader';
import Carousel from '../../components/common/Carousel';
import TestimonialMarquee from '../../components/common/TestimonialMarquee';
import BookingProcess from '../../components/common/BookingProcess';
import HomeFAQSection from '../../components/common/HomeFAQSection';
import { smoothScrollToTop } from '../../utils/smoothScroll';

// Import Local Images - Replace these with your actual Goa images
import heroImage from '../../assets/images/hero-goa-beach.jpg';
import toursImage from '../../assets/images/tours-goa-churches.jpg';
import testimonialsImage from '../../assets/images/testimonials-goa-backwaters.jpg';
import ctaImage from '../../assets/images/cta-goa-sunset.jpg';
import textureImage from '../../assets/images/partners-goa-texture.jpg';

// Remove debug logs for cleaner console
// console.log('Texture image path:', textureImage);
// console.log('Hero image URL:', heroImage);
// console.log('Tours image URL:', toursImage);
// console.log('Testimonials image URL:', testimonialsImage);
// console.log('CTA image URL:', ctaImage);

const Home = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicSettings, setPublicSettings] = useState(null);
  const [search, setSearch] = useState({ q: '', date: '', time: '', exp: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [toursData, testimonialsData, settingsData] = await Promise.all([
          getTours(),
          getTestimonials(true), // Only active testimonials
          getPublicSettings(),
        ]);

        setTours(toursData.data?.tours ?? []);
        setTestimonials(testimonialsData.data?.testimonials ?? []);
        setPublicSettings(settingsData.data?.settings ?? null);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle hash scrolling after data has loaded
  useEffect(() => {
    if (!loading && window.location.hash === '#faq') {
      // Small timeout to guarantee DOM is painted after loading state clears
      setTimeout(() => {
        const el = document.getElementById('faq');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [loading]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white font-sans selection:bg-[#F5B400] selection:text-black">

      {/* 
        SECTION 1: HERO - IMMERSIVE 
        Using local imported image
      */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Panjim Church Heritage"
            className="w-full h-full object-cover"
            onLoad={() => console.log('Hero image loaded successfully')}
            onError={(e) => {
              console.error('Hero image failed to load:', e);
              console.log('Hero image URL was:', heroImage);
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
            }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 text-center pt-16 sm:pt-20 md:pt-24">

          <div className="flex items-center justify-center min-h-[30vh] sm:min-h-[40vh]">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-satisfy font-bold leading-tight sm:leading-tight tracking-normal drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-white text-center max-w-5xl mx-auto">
              <span className="block">Discover the Hidden</span>
              <span className="block mt-1 sm:mt-4">Gems of Goa</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 font-light leading-relaxed drop-shadow-lg px-4">
            Explore the colorful <span className="text-[#47E4FF] font-semibold">Latin Quarter</span>, historic <span className="text-[#47E4FF] font-semibold">churches</span>, and untold <span className="text-[#47E4FF] font-semibold">stories of Panjim</span> with our expert heritage guides.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 z-20 relative px-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const sp = new URLSearchParams();
                if (search.q) sp.set('q', search.q);
                if (search.date) sp.set('date', search.date);
                navigate({ pathname: '/tours', search: sp.toString() ? `?${sp.toString()}` : '' });
              }}
            >
              <div className="relative flex items-center w-full max-w-3xl mx-auto h-14 md:h-16 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.2)] focus-within:border-gray-300 transition-all overflow-visible z-40">

                {/* Search Icon */}
                <div className="pl-5 pr-3 text-gray-400">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Search Input Field */}
                <input
                  type="text"
                  value={search.q}
                  onChange={(e) => setSearch((s) => ({ ...s, q: e.target.value }))}
                  placeholder="Search for a tour or experience"
                  className="flex-1 w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none text-base md:text-lg h-full"
                />

                {/* Embedded Submit Button */}
                <div className="pr-1.5 md:pr-2 pl-2">
                  <button
                    type="submit"
                    className="h-11 md:h-12 px-6 md:px-8 bg-[#F5B400] text-black hover:bg-[#ffc107]  text-black font-semibold rounded-full text-sm md:text-base tracking-[0.05em] whitespace-nowrap shadow-[0_0_15px_rgba(245,180,0,0.3)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,180,0,0.5)]"
                  >
                    Search
                  </button>
                </div>

                {/* Search Suggestions (Inline) */}
                {publicSettings?.tourSuggestions?.length > 0 && (
                  <div className="absolute top-[calc(100%+16px)] left-0 w-full flex flex-wrap items-center justify-center gap-2 px-4 animate-in fade-in slide-in-from-top-2 duration-700">
                    {publicSettings.tourSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSearch(prev => ({ ...prev, q: s }));
                          navigate({ pathname: '/tours', search: `?q=${encodeURIComponent(s)}` });
                        }}
                        className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm hover:bg-[#F5B400] hover:text-black hover:border-[#F5B400] transition-all duration-300 backdrop-blur-sm font-medium"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestions Dropdown (Filtered) */}
                {search.q && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 z-50 max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {(() => {
                      const query = search.q.toLowerCase().trim();

                      // First, find all matching tours
                      const allMatches = tours.filter(t => {
                        const inTitle = t.title?.toLowerCase().includes(query) || t.name?.toLowerCase().includes(query);
                        const inTags = t.tags?.some(tag => tag.toLowerCase().includes(query));
                        const inSummary = t.summary?.toLowerCase().includes(query);
                        return inTitle || inTags || inSummary;
                      });

                      // Then, sort them: exact prefix matches first, then alphabetically
                      const matches = allMatches.sort((a, b) => {
                        const aTitle = (a.name || a.title || '').toLowerCase();
                        const bTitle = (b.name || b.title || '').toLowerCase();

                        const aStartsWith = aTitle.startsWith(query) ? 1 : 0;
                        const bStartsWith = bTitle.startsWith(query) ? 1 : 0;

                        // Put starting matches first
                        if (aStartsWith !== bStartsWith) {
                          return bStartsWith - aStartsWith;
                        }

                        // Otherwise, alphabetize
                        return aTitle.localeCompare(bTitle);
                      }).slice(0, 6); // Show up to 6 matches like Google

                      if (matches.length > 0) {
                        return matches.map((tour) => (
                          <div
                            key={tour._id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => {
                              setSearch((s) => ({ ...s, q: tour.name || tour.title }));
                              navigate(`/tours/${tour._id}`);
                            }}
                          >
                            <div className="flex flex-col text-left flex-1 pl-2 border-l-2 border-transparent group-hover:border-[#F5B400] transition-all">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-[#47E4FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-800 transition-colors">
                                  {tour.name || tour.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 ml-6">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{tour.difficulty || 'Easy'}</span>
                                {tour.tags && tour.tags.filter(t => !['half-day', 'full-day'].includes(t.toLowerCase())).length > 0 && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="text-[10px] text-gray-600">
                                      {tour.tags
                                        .filter(t => !['half-day', 'full-day'].includes(t.toLowerCase()))
                                        .slice(0, 2)
                                        .map(tag => `#${tag}`)
                                        .join(' ')}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-400 group-hover:text-gray-600 transition-colors whitespace-nowrap ml-4 flex items-center gap-1">
                              View <span className="hidden sm:inline">Tour</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </span>
                          </div>
                        ));
                      } else {
                        return (
                          <div className="px-5 py-6 flex items-center gap-3 text-gray-500">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium text-gray-800">No matches found for "{search.q}"</span>
                              <span className="text-xs mt-0.5 text-gray-500">Try searching for keywords like "heritage", "food", or "churches"</span>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 
         SECTION 2: EXPERIENCE VIBES
         Quick filters that jump to Tours with tag-based search
      */}
      <section className="relative py-20 bg-gradient-to-b from-black via-black to-[#050509]">
        <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-center text-center gap-6 mb-10">
            <div>
              <p className="text-[#F5B400] text-xs md:text-sm font-semibold tracking-[0.35em] uppercase mb-3 text-center">
                What are you looking for?
              </p>
              <h2 className="font-satisfy text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 text-center">
                Choose your <span className="text-[#F5B400]">vibe</span>
              </h2>
              <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto text-center">
                Pick an experience style and we&apos;ll show you the tours that match,
                curated using tags from our storytellers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {(publicSettings?.vibes || []).map((vibe, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const sp = new URLSearchParams();
                  if (vibe.filterKey) sp.set('q', vibe.filterKey); // Use 'q' to search tags
                  navigate({ pathname: '/tours', search: `?${sp.toString()}` });
                  smoothScrollToTop();
                }}
                className="group relative flex flex-col items-center text-center w-36 sm:w-44 lg:w-48 h-56 sm:h-64 lg:h-72 rounded-b-2xl rounded-t-full overflow-hidden transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-[#F5B400]/50 shadow-2xl shrink-0"
              >
                {/* Background Image / Icon Layer */}
                <div className="absolute inset-0 z-0 bg-[#0A0F14]">
                  {vibe.iconUrl ? (
                    vibe.iconUrl.startsWith('<svg') ? (
                      <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity" dangerouslySetInnerHTML={{ __html: vibe.iconUrl.replace(/w-\d+\s+h-\d+/g, 'w-16 h-16').replace('mb-3', '') }} />
                    ) : (
                      <img src={vibe.iconUrl} alt={vibe.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#F5B400]/30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                    </div>
                  )}
                  {/* Dark gradient fade from bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  {/* Subtle inner gold glow on hover */}
                  <div className="absolute inset-0 rounded-b-2xl rounded-t-full shadow-[inset_0_0_0_0_rgba(245,180,0,0)] group-hover:shadow-[inset_0_0_20px_2px_rgba(245,180,0,0.15)] transition-shadow duration-500 pointer-events-none"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end p-4 pb-6 mt-auto">
                  <h3 className="font-satisfy text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-[#F5B400] transition-colors drop-shadow-lg">
                    {vibe.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 leading-snug drop-shadow-md font-medium px-1">
                    {vibe.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section >


      {
        loading ? (
          <div className="min-h-[50vh] bg-black flex justify-center items-center" >
            <Loader />
          </div>
        ) : (
          <>
            {/* 
            SECTION 3: TOURS - IMMERSIVE
            Image: Fontainhas
          */}
            {tours && tours.length > 0 && (
              <section className="relative py-20 sm:py-32 md:py-40 overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img
                    src={toursImage}
                    alt="Fontainhas Streets"
                    className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black via-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-12 sm:mb-16 md:mb-20 text-center">
                    <p className="text-[#F5B400] text-sm sm:text-base font-bold tracking-[0.2em] uppercase mb-4">Curated Experiences</p>
                    <h2 className="font-satisfy text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6">
                      Discover <span className="text-[#F5B400]">Latin Quarter</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">Stroll through the colorful streets of Fontainhas and Campal. Every corner is a postcard waiting to be discovered.</p>
                  </div>

                  <div className="relative">
                    <Carousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }} autoScroll={true} scrollInterval={4000}>
                      {tours.map((tour) => (
                        <TourCard key={tour._id} tour={tour} />
                      ))}
                    </Carousel>
                  </div>

                  <div className="mt-20 text-center">
                    <Link to="/tours" onClick={smoothScrollToTop}>
                      <Button variant="outline" size="lg" className="border-[#47E4FF]/30 text-[#47E4FF] hover:bg-[#47E4FF] hover:text-black rounded-full px-12 py-4 tracking-widest uppercase text-sm font-bold transition-all duration-300">View All Tours</Button>
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* 
              SECTION: HOW IT WORKS / BOOK @ 0
            */}
            <BookingProcess />

            {/* 
             SECTION 4: TESTIMONIALS - IMMERSIVE
             Image: Mandovi River
          */}
            {testimonials.length > 0 && (
              <section className="relative py-16 sm:py-20 md:py-28 lg:py-36 overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img
                    src={testimonialsImage}
                    alt="Mandovi River Vibes"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/70"></div>
                  <div className="absolute -top-24 -left-24 w-[400px] h-[400px] sm:-top-32 sm:-left-32 sm:w-[520px] sm:h-[520px] rounded-full bg-[#F5B400]/10 blur-3xl"></div>
                  <div className="absolute -bottom-32 -right-32 w-[440px] h-[440px] sm:-bottom-40 sm:-right-40 sm:w-[560px] sm:h-[560px] rounded-full bg-white/5 blur-3xl"></div>
                  <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black via-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8 sm:mb-12 md:mb-16">
                    <p className="text-[#F5B400] text-xs sm:text-sm md:text-sm font-semibold tracking-[0.35em] uppercase mb-4">
                      Testimonials
                    </p>
                    <h2 className="font-satisfy text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-5">
                      Stories from fellow <span className="text-[#F5B400]">travellers</span>
                    </h2>
                    <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
                      Real voices. Real moments. Here's what guests say after exploring Panjim's heritage with our guides.
                    </p>
                  </div>

                  <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="w-full">
                      <TestimonialMarquee testimonials={testimonials} />
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

      {/* 
         SECTION 3: CTA - IMMERSIVE
         Image: Goa Nightview
      */}
      <section className="relative py-20 sm:py-32 md:py-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={ctaImage}
            alt="Goa Night"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
            }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-black to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="font-satisfy text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6 sm:mb-10 tracking-tighter drop-shadow-2xl">
            Your Journey <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5B400] to-white">Begins Here</span>
          </h2>
          <Link to="/tours" onClick={smoothScrollToTop}>
            <button className="px-16 py-6 bg-[#F5B400] text-black text-xl font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(245,180,0,0.4)]">
              Book Experience
            </button>
          </Link>
        </div>
      </section>

      {/* 
         SECTION: WHY TRAVELERS TRUST US
         Data driven from settings
      */}
      <section className="relative py-20 bg-[#050509] overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F5B400]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F5B400]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-satisfy text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6">
              {publicSettings?.trustHeading || 'Why Travelers Trust Us'}
            </h2>
            <p className="font-satisfy text-[#F5B400] text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
              {publicSettings?.trustSubheading || 'Small group stories, big memories — here’s what backs our walks.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Stat 1: Years Old */}
            <div className="relative group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F5B400]/30 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5B400]/0 to-[#F5B400]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              <div className="relative z-10 text-center text-zinc-50">
                <div className="text-5xl md:text-6xl font-bold text-[#F5B400] mb-2">
                  {publicSettings?.yearsOld || 8}
                  <span className="text-2xl md:text-3xl align-top ml-1">+</span>
                </div>
                <div className="h-1 w-12 bg-[#F5B400] mx-auto mb-4 opacity-50"></div>
                <h3 className="text-xl font-bold text-white mb-2">Years Old</h3>
                <p className="text-sm text-white/50 font-medium">Delivering excellence since day one</p>
              </div>
            </div>

            {/* Stat 2: Explorers */}
            <div className="relative group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F5B400]/30 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5B400]/0 to-[#F5B400]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              <div className="relative z-10 text-center">
                <div className="text-5xl md:text-6xl font-bold text-[#F5B400] mb-2">
                  {publicSettings?.explorersCount || 1098}
                  <span className="text-2xl md:text-3xl align-top ml-1">+</span>
                </div>
                <div className="h-1 w-12 bg-[#F5B400] mx-auto mb-4 opacity-50"></div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Explorers</h3>
                <p className="text-sm text-white/50 font-medium">Happy guests who walked with us</p>
              </div>
            </div>

            {/* Stat 3: Storyteller Years */}
            <div className="relative group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F5B400]/30 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5B400]/0 to-[#F5B400]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              <div className="relative z-10 text-center">
                <div className="text-5xl md:text-6xl font-bold text-[#F5B400] mb-2 uppercase tracking-wide">
                  {publicSettings?.storytellerExperienceYears || 10}
                  <span className="text-2xl md:text-3xl align-top ml-1">+</span>
                </div>
                <div className="h-1 w-12 bg-[#F5B400] mx-auto mb-4 opacity-50"></div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Storyteller Years</h3>
                <p className="text-sm text-white/50 font-medium">Years of combined guiding expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
         SECTION 4: OUR PARTNERS (Themed, Borderless, Colorful)
      */}
      <section className="relative py-24 bg-[#0a0a0d] overflow-hidden border-t border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16 text-center">
          <span className="text-[#F5B400] font-semibold tracking-[0.2em] uppercase text-sm lg:text-base block mb-3">
            Trusted By The Best
          </span>
          <h2 className="font-satisfy text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-satisfy font-bold text-white tracking-tight mb-6">
            Our Partners
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
            We partner with some of the most respected brands in global travel to deliver verified, high-quality experiences that travellers can rely on.
          </p>
        </div>

        {/* Infinite Marquee Container */}
        <div className="relative flex w-full overflow-hidden py-10 bg-black/20 backdrop-blur-sm border-y border-white/5 shadow-xl shadow-black/50">
          {/* Gradient Edges to fade the marquee smoothly (matching dark bg) */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#0a0a0d] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#0a0a0d] to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-marquee-fast hover:[animation-play-state:paused] whitespace-nowrap items-center">
            {/* We render the partners list twice to create a seamless infinite loop */}
            {[...(publicSettings?.partners || []), ...(publicSettings?.partners || [])].map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center mx-8 sm:mx-12"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/10 p-1 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-2xl hover:border-[#F5B400]/40 transition-all duration-500 overflow-hidden group">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-700 shadow-inner"
                    />
                  ) : (
                    <span className="text-white/80 group-hover:text-[#F5B400] font-bold text-xs sm:text-sm tracking-wide transition-colors text-center px-2">
                      {partner.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee-fast {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
           .animate-marquee-fast {
            animation: marquee-fast 30s linear infinite;
          }
        `}</style>
      </section>

      {/* 
         SECTION 5: FREQUENTLY ASKED QUESTIONS
      */}
      <HomeFAQSection faqs={publicSettings?.homeFaqs || []} />

    </div >
  );
};

export default Home;



