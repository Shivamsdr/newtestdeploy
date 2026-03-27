import { useState, useEffect } from 'react';
import { getPublicSettings } from '../../services/api';

const About = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData] = await Promise.all([
          getPublicSettings()
        ]);

        if (settingsData?.data?.settings) {
          setSettings(settingsData.data.settings);
          if (settingsData.data.settings.aboutVideoUrl) {
            setVideoUrl(settingsData.data.settings.aboutVideoUrl);
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    fetchData();
  }, []);

  // Helper to determine if it's an embeddable link
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : null;
    }

    return null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* ... Hero Section code remains same ... */}
      {/* Creative Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black/90"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5B400]/5 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1 px-3 border border-[#F5B400]/30 rounded-full text-[#F5B400] text-xs font-semibold tracking-widest uppercase mb-6 bg-[#F5B400]/5 backdrop-blur-sm">
            Est. 2018
          </span>
          <h1 className="font-satisfy text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            Curating <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5B400] to-[#E6A800]">Memories</span>,<br />
            Preserving History.
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            We don't just show you places; we transport you through time. Experience Goa's soul through stories whispered by ancient walls and vibrant streets.
          </p>


        </div>
      </div>

      {/* Video Section */}
      <div className="relative z-20 -mt-20 px-4 mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-gray-900 aspect-video group">
            {videoUrl ? (
              embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="About Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster="/assets/logo.png"
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/10">
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm">Video coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <h2 className="font-satisfy text-3xl md:text-4xl font-bold text-white">
              More than just a <span className="text-[#F5B400]">Tour Company</span>
            </h2>
            <div className="space-y-6 text-white/70 leading-relaxed text-lg">
              <p>
                Walk with History was born from a simple passion: to share the untold stories of Goa. Beyond the beaches and parties lies a treasure trove of heritage, art, and culture waiting to be explored.
              </p>
              <p>
                Our curated experiences are designed for the curious traveler. Whether you're a history buff, a culture vulture, or simply someone who loves a good story, we invite you to walk with us.
              </p>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <span className="block text-3xl font-bold text-white mb-1">
                  {settings?.yearsOld || 8}+
                </span>
                <span className="text-sm text-[#F5B400] uppercase tracking-wider">Years Experience</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-white mb-1">
                  {settings?.explorersCount || 1098}+
                </span>
                <span className="text-sm text-[#F5B400] uppercase tracking-wider">Explorers</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-white mb-1">
                  {settings?.storytellerExperienceYears || 10}+
                </span>
                <span className="text-sm text-[#F5B400] uppercase tracking-wider">Storyteller Years</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#F5B400]/20 rounded-full blur-3xl rounded-tr-none"></div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-4 translate-y-8">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#F5B400]/30 transition-all duration-500">
                  <svg className="w-8 h-8 text-[#F5B400] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <h3 className="font-satisfy text-white font-bold mb-2">Heritage</h3>
                  <p className="text-white/60 text-sm">Ancient architecture and colonial history.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#F5B400]/30 transition-all duration-500">
                  <svg className="w-8 h-8 text-[#F5B400] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <h3 className="font-satisfy text-white font-bold mb-2">Culture</h3>
                  <p className="text-white/60 text-sm">Local stories, festivals, and traditions.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#F5B400]/30 transition-all duration-500">
                  <svg className="w-8 h-8 text-[#F5B400] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <h3 className="font-satisfy text-white font-bold mb-2">Places</h3>
                  <p className="text-white/60 text-sm">Hidden gems and iconic landmarks.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#F5B400]/30 transition-all duration-500">
                  <svg className="w-8 h-8 text-[#F5B400] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className="font-satisfy text-white font-bold mb-2">People</h3>
                  <p className="text-white/60 text-sm">Connect with the community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Footer Social Links */}
      <div className="py-12 bg-black flex justify-center space-x-6 border-t border-white/5">
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#E1306C] transition-colors hover:scale-110 transform duration-300">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#1877F2] transition-colors hover:scale-110 transform duration-300">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#FF0000] transition-colors hover:scale-110 transform duration-300">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
        </a>
      </div>
    </div >
  );
};
export default About;



