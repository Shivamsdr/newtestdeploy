import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTours, getPublicSettings } from '../../services/api';
import Loader from '../../components/common/Loader';
import TourCard from '../../components/cards/TourCard';

// Import Local Background Image - Replace with your actual Goa image
import toursPageImage from '../../assets/images/tours-goa-churches.jpg';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [filters, setFilters] = useState(() => ({
    q: params.get('q') || '',
    date: params.get('date') || '',
    time: params.get('time') || '',
    exp: params.get('exp') || '',
    category: params.get('category') || '',
    dayType: params.get('dayType') || '',
  }));

  useEffect(() => {
    // keep inputs synced when user navigates with query params
    setFilters({
      q: params.get('q') || '',
      date: params.get('date') || '',
      time: params.get('time') || '',
      exp: params.get('exp') || '',
      category: params.get('category') || '',
      dayType: params.get('dayType') || '',
    });
  }, [params]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getPublicSettings();
        if (res.data?.settings?.tourSuggestions) {
          setSuggestions(res.data.settings.tourSuggestions);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        // Pass current filters to backend
        const queryParams = {
          q: filters.q,
          date: filters.date,
          exp: filters.exp,
          category: filters.category,
          dayType: filters.dayType,
        };
        const data = await getTours(queryParams);
        setTours(data.data?.tours || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters]); // Re-fetch when filters change

  // if (loading) return <Loader />; // Removed to prevent unmounting inputs
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  // Client-side filtering is no longer needed for category, handled globally by backend
  const filteredTours = tours;

  const applyFiltersToUrl = (next) => {
    const sp = new URLSearchParams();
    if (next.q) sp.set('q', next.q);
    if (next.date) sp.set('date', next.date);
    if (next.time) sp.set('time', next.time);
    if (next.exp) sp.set('exp', next.exp);
    if (next.category) sp.set('category', next.category);
    if (next.dayType) sp.set('dayType', next.dayType);
    navigate({ pathname: '/tours', search: sp.toString() ? `?${sp.toString()}` : '' }, { replace: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050509] to-black">
      {/* Main Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 pt-16 sm:pt-24 pb-16">

        {/* Page Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="font-satisfy text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-xl">
            Explore <span className="text-[#F5B400]">Panjim's</span> Stories
          </h1>
          <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium">
            Find the perfect heritage walk or cultural experience matching your vibe.
          </p>
        </div>

        {/* Search / Filters */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12 z-20 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyFiltersToUrl(filters);
            }}
          >
            <div className="bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.8)] p-1.5 sm:p-2">
              <div className="flex items-center relative w-full">
                <div className="flex-1 relative flex items-center bg-transparent rounded-full px-4 py-2 sm:py-3 transition-colors w-full">
                  <svg className="w-5 h-5 flex-shrink-0 text-[#F5B400]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                    placeholder="Search for a heritage walk or experience..."
                    className="w-full bg-transparent text-white placeholder-white/50 outline-none text-base md:text-lg ml-3"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {filters.q && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-white/5">
                    {(() => {
                      const query = filters.q.toLowerCase().trim();

                      // Find all matches
                      const allMatches = tours.filter(t => {
                        const inTitle = t.title?.toLowerCase().includes(query) || t.name?.toLowerCase().includes(query);
                        const inTags = t.tags?.some(tag => tag.toLowerCase().includes(query));
                        const inSummary = t.summary?.toLowerCase().includes(query);
                        return inTitle || inTags || inSummary;
                      });

                      // Sort exact prefix matches first, then alphabetically
                      const matches = allMatches.sort((a, b) => {
                        const aTitle = (a.name || a.title || '').toLowerCase();
                        const bTitle = (b.name || b.title || '').toLowerCase();

                        const aStartsWith = aTitle.startsWith(query) ? 1 : 0;
                        const bStartsWith = bTitle.startsWith(query) ? 1 : 0;

                        if (aStartsWith !== bStartsWith) {
                          return bStartsWith - aStartsWith;
                        }

                        return aTitle.localeCompare(bTitle);
                      }).slice(0, 6);

                      if (matches.length > 0) {
                        return matches.map((tour) => (
                          <div
                            key={tour._id}
                            className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => {
                              setFilters((f) => ({ ...f, q: tour.name || tour.title }));
                              applyFiltersToUrl({ ...filters, q: tour.name || tour.title });
                              setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
                            }}
                          >
                            <div className="flex flex-col text-left flex-1 pl-2 border-l-2 border-transparent group-hover:border-[#F5B400] transition-all">
                              <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-[#47E4FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="text-sm font-medium text-white group-hover:text-[#47E4FF] transition-colors">
                                  {tour.name || tour.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 ml-5">
                                <span className="text-[10px] text-white/50 uppercase tracking-wider">{tour.difficulty || 'Easy'}</span>
                                {tour.tags && tour.tags.filter(t => !['half-day', 'full-day'].includes(t.toLowerCase())).length > 0 && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                    <span className="text-[10px] text-[#F5B400]/80">
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
                            <span className="text-[10px] sm:text-xs text-white/40 group-hover:text-[#47E4FF] transition-colors whitespace-nowrap ml-4 flex items-center gap-1">
                              Search <span className="hidden sm:inline">Tour</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </span>
                          </div>
                        ));
                      } else {
                        return (
                          <div className="px-5 py-6 flex items-center gap-3 text-white/50">
                            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium text-white/80">No matches found for "{filters.q}"</span>
                              <span className="text-xs mt-0.5">Try searching for keywords like "heritage", "food", or "churches"</span>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-700">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFilters(f => ({ ...f, q: s }));
                    applyFiltersToUrl({ ...filters, q: s });
                  }}
                  className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-[#F5B400]/20 hover:text-[#F5B400] hover:border-[#F5B400]/30 transition-all duration-300 font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>



        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-[#F5B400]/80 text-sm font-semibold tracking-wide">
            {loading ? 'Searching...' : `${filteredTours.length} ${filteredTours.length === 1 ? 'tour' : 'tours'} found`}
          </p>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex justify-center items-center">
            <Loader minHeightClass="min-h-0" />
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-2">No tours available</h3>
            <p className="text-white/60 text-sm sm:text-base">Check back soon for amazing heritage experiences!</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-2">No tours found</h3>
            <p className="text-white/60 text-sm sm:text-base">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour._id}
                tour={tour}
                linkState={{
                  preselectedDate: filters.date || undefined,
                  preselectedTime: filters.time || undefined,
                  searchedExperience: filters.exp || undefined,
                  searchedQuery: filters.q || undefined,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;



