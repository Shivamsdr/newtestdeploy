import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/api';
import Loader from '../../components/common/Loader';
import toursImage from '../../assets/images/tours-goa-churches.jpg';

const employmentTypeLabel = (type) => type || '—';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs(true);
        setJobs(data.data?.jobs ?? []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const applyHref = (job) => {
    if (job.applicationUrl) return job.applicationUrl;
    if (job.applicationEmail) return `mailto:${job.applicationEmail}`;
    return '/contact';
  };

  const applyLabel = (job) => {
    if (job.applicationUrl) return 'Apply online';
    if (job.applicationEmail) return 'Apply by email';
    return 'Get in touch';
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white font-sans selection:bg-[#F5B400] selection:text-black">
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={toursImage}
            alt="Careers"
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
            Join the team
          </p>
          <h1 className="font-satisfy text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-5">
            Careers &amp; <span className="text-[#F5B400]">Job Openings</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Help us share Goa’s heritage with the world. Find your next role with Walk with History.
          </p>
        </div>
      </section>

      {/* Job list */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <Loader />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">No openings at the moment. Check back later or get in touch.</p>
              <Link to="/contact" className="inline-block mt-6 text-[#F5B400] font-semibold hover:underline">
                Contact us
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#F5B400]/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h2 className="font-satisfy text-xl md:text-2xl font-bold text-white mb-2">
                          {job.title}
                        </h2>
                        <div className="flex flex-wrap gap-3 text-sm text-white/60">
                          {job.department && (
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-4 h-4 text-[#F5B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {job.department}
                            </span>
                          )}
                          {job.location && (
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-4 h-4 text-[#F5B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </span>
                          )}
                          {job.employmentType && (
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-4 h-4 text-[#F5B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {employmentTypeLabel(job.employmentType)}
                            </span>
                          )}
                        </div>
                        <p className="mt-4 text-white/70 text-sm md:text-base leading-relaxed line-clamp-3">
                          {job.description}
                        </p>
                      </div>
                      <a
                        href={applyHref(job)}
                        target={job.applicationUrl ? '_blank' : undefined}
                        rel={job.applicationUrl ? 'noopener noreferrer' : undefined}
                        className="flex-shrink-0 px-6 py-3 bg-[#F5B400] text-black hover:bg-[#ffc107]  text-black font-semibold rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(245,180,0,0.3)] hover:shadow-[0_0_35px_rgba(245,180,0,0.5)]"
                      >
                        {applyLabel(job)}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Careers;



