import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlog, getBlogs } from '../../services/api';
import Loader from '../../components/common/Loader';

const RECENT_COUNT = 5;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        window.scrollTo(0, 0); // Ensure scroll to top on nav
        const [blogRes, blogsRes] = await Promise.all([
          getBlog(id),
          getBlogs(true),
        ]);
        const current = blogRes.data?.blog ?? null;
        const all = blogsRes.data?.blogs ?? [];
        setBlog(current);
        let categoryMatch = all.filter((b) => b._id !== id && b.category === current?.category);
        if (categoryMatch.length === 0) {
          categoryMatch = all.filter((b) => b._id !== id);
        }
        setRecentBlogs(categoryMatch.slice(0, RECENT_COUNT));
      } catch (err) {
        setError(err.message || 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <p className="text-white/70 mb-6">{error || 'Post not found.'}</p>
        <Link to="/explore-goa" className="text-[#F5B400] font-semibold hover:underline">
          ← Back to Explore Goa
        </Link>
      </div>
    );
  }

  const dateStr = new Date(blog.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white font-sans selection:bg-[#F5B400] selection:text-black pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/explore-goa"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#47E4FF] text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Explore Goa
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Main Article Content */}
          <article className="flex-1 min-w-0 max-w-[800px]">
            {/* Header */}
            <header className="mb-8">
              <div className="mb-4">
                <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${blog.category === 'achievement' ? 'border-[#F5B400] text-[#F5B400] bg-[#F5B400]/10' : 'border-[#47E4FF] text-[#47E4FF] bg-[#47E4FF]/10'}`}>
                  {blog.category === 'achievement' ? 'Achievement / Award' : 'Story & Guide'}
                </span>
              </div>
              <h1 className="font-satisfy text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>{dateStr}</span>
                {/* Add author if available later */}
              </div>
            </header>

            {/* Featured Image - Visible */}
            {blog.coverImage && (
              <div className="mb-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              </div>
            )}

            {/* Content Body */}
            {blog.excerpt && (
              <p className="text-xl text-white/90 leading-relaxed mb-8 font-medium italic border-l-4 border-[#F5B400] pl-4">
                {blog.excerpt}
              </p>
            )}

            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/80 prose-li:text-white/80 prose-strong:text-white prose-a:text-[#F5B400] prose-a:no-underline hover:prose-a:underline">
              <div className="whitespace-pre-line text-white/80 leading-relaxed">{blog.content}</div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <Link
                to="/explore-goa"
                className="inline-flex items-center gap-2 text-[#F5B400] font-semibold hover:underline"
              >
                ← All posts
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-lg flex flex-col gap-8">

              {/* Call to Action Container */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#121A21] to-[#0A0F14] border border-white/5 p-6 text-center shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#F5B400]/0 to-[#F5B400]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="text-xl font-bold text-white mb-2 font-satisfy">Ready to Walk?</h3>
                <p className="text-sm text-gray-400 mb-6 font-light">Join our storytellers for an immersive heritage walk.</p>
                <Link to="/tours" onClick={() => window.scrollTo(0, 0)} className="inline-block w-full">
                  <button className="w-full py-3 bg-[#F5B400] text-black text-sm font-extrabold rounded-lg hover:bg-white transition-all duration-300 shadow-[0_4px_14px_0_rgba(245,180,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:-translate-y-0.5 transform">
                    Book Now @ ₹0
                  </button>
                </Link>
              </div>

              <div>
                <h3 className="font-satisfy text-sm font-semibold tracking-[0.2em] uppercase text-[#F5B400] mb-5 pb-2 border-b border-white/10">
                  More {blog?.category === 'achievement' ? 'Achievements' : 'Recent Reads'}
                </h3>
                {recentBlogs.length === 0 ? (
                  <p className="text-white/50 text-sm">No other posts yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {recentBlogs.map((b) => (
                      <li key={b._id} className="group">
                        <Link to={`/explore-goa/${b._id}`} className="flex gap-4 items-center p-2 -mx-2 rounded-xl hover:bg-white/[0.04] transition-colors duration-200 border border-transparent hover:border-white/5 overflow-hidden">
                          {/* Thumbnail in sidebar */}
                          {b.coverImage ? (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden relative shadow-md">
                              <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-md">
                              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white group-hover:text-[#47E4FF] text-sm font-medium leading-snug transition-colors line-clamp-2 mb-1.5">
                              {b.title}
                            </h4>
                            <span className="text-xs text-gray-500 font-medium">
                              {new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                  <Link
                    to="/explore-goa"
                    className="inline-block px-5 py-2.5 rounded-full border border-[#F5B400]/30 text-[#F5B400] text-xs font-bold tracking-wide uppercase hover:bg-[#F5B400] hover:text-black transition-all"
                  >
                    View Library
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;


