import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../services/api';
import Loader from '../../components/common/Loader';
import toursImage from '../../assets/images/tours-goa-churches.jpg';

const ExploreGoa = () => {
  const [regularBlogs, setRegularBlogs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogs(true);
        const allBlogs = data.data?.blogs ?? [];
        setRegularBlogs(allBlogs.filter(b => b.category !== 'achievement'));
        setAchievements(allBlogs.filter(b => b.category === 'achievement'));
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white font-sans selection:bg-[#F5B400] selection:text-black">
      {/* Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={toursImage}
            alt="Explore Goa"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)';
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#F5B400] text-xs md:text-sm font-semibold tracking-[0.35em] uppercase mb-4">
            Stories &amp; Guides
          </p>
          <h1 className="font-satisfy text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-5">
            Explore <span className="text-[#F5B400]">Goa</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Curated reads on heritage, culture, food, and hidden gems—your inspiration before the walk.
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="relative pb-16 pt-8 md:pt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <Loader />
            </div>
          ) : regularBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">No posts yet. Check back soon for stories from Goa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/explore-goa/${blog._id}`}
                  className="group block rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-[#F5B400]/50 hover:bg-white/[0.06] transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#F5B400]/20 to-[#1a1a1a] flex items-center justify-center">
                        <span className="text-[#F5B400]/50 text-4xl font-serif">Goa</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 md:p-6">
                    <h2 className="font-satisfy text-xl font-bold text-white mb-2 group-hover:text-[#47E4FF] transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">
                      {blog.excerpt || blog.content?.slice(0, 120) + '…'}
                    </p>
                    <span className="inline-flex items-center gap-2 mt-4 text-[#F5B400] text-sm font-semibold">
                      Read more
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Achievements grid */}
      {!loading && achievements.length > 0 && (
        <section className="relative py-16 md:py-24 bg-[#050509]">
          {/* Section Background Subtle Glows */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#47E4FF]/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#F5B400]/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#F5B400] text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">Hall of Fame</span>
              <h2 className="font-satisfy text-3xl md:text-5xl font-bold text-white mb-6">Achievements & Awards</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement) => (
                <Link
                  key={achievement._id}
                  to={`/explore-goa/${achievement._id}`}
                  className="group block rounded-2xl overflow-hidden border border-[#F5B400]/10 bg-gradient-to-br from-[#121A21] to-[#0A0F14] hover:border-[#F5B400]/50 transition-all duration-300 shadow-xl hover:shadow-[0_0_40px_rgba(245,180,0,0.15)] relative"
                >
                  {/* Gold gradient sheen overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#F5B400]/0 to-[#F5B400]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="relative aspect-[16/10] overflow-hidden">
                    {achievement.coverImage ? (
                      <img
                        src={achievement.coverImage}
                        alt={achievement.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#F5B400]/20 to-[#1a1a1a] flex items-center justify-center">
                        <span className="text-[#F5B400]/50 text-4xl font-serif">Award</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F14]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Badge Overlay */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#F5B400] to-[#ffc107] text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      Achievement
                    </div>
                  </div>
                  <div className="p-5 md:p-6 border-t border-white/5">
                    <h2 className="font-satisfy text-xl font-bold text-white mb-3 group-hover:text-[#47E4FF] transition-colors leading-snug">
                      {achievement.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed font-light">
                      {achievement.excerpt || achievement.content?.slice(0, 120) + '…'}
                    </p>
                    <span className="inline-flex items-center gap-2 mt-5 text-[#F5B400] text-sm font-semibold">
                      Read more
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ExploreGoa;


