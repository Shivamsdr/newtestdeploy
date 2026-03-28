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
    <div className="min-h-screen bg-[#0a0806] text-[#E8DCC4] font-sans selection:bg-[#F5B400] selection:text-black overflow-x-hidden">
      
      {/* Hero Section - Classic Heritage Frame */}
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-16 px-4">
        {/* Subtle texture/bg */}
        <div className="absolute inset-0 z-0 bg-[url('/assets/images/partners-goa-texture.jpg')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806] via-transparent to-[#0a0806] z-0"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center border-y border-[#F5B400]/20 py-16 px-4">
          <span className="inline-block tracking-[0.3em] text-[#F5B400] uppercase text-xs md:text-sm font-bold mb-6">
            Est. 2017
          </span>
          <h1 className="font-satisfy text-6xl md:text-8xl text-[#F8F4E6] mb-8 drop-shadow-lg leading-tight">
            Crafting <span className="text-[#F5B400]">Experiences</span>,<br />
            Keeping Heritage Alive.
          </h1>
          <p className="font-serif text-lg md:text-2xl text-[#E8DCC4]/70 max-w-2xl mx-auto leading-relaxed italic">
            "We don't just show you places; we transport you through time. Experience Goa's soul through stories whispered by ancient walls and vibrant streets."
          </p>
        </div>
      </div>

      {/* The Story - Column Layout */}
      <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 z-10">
        <div className="text-center mb-16">
          <h2 className="font-satisfy text-4xl md:text-5xl text-[#F5B400] mb-4">Our Heritage & Roots</h2>
          <div className="w-24 h-px bg-[#F5B400]/30 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 font-serif text-lg leading-relaxed text-[#E8DCC4]/80">
          <div className="space-y-6">
            <p className="first-letter:text-6xl first-letter:font-satisfy first-letter:text-[#F5B400] first-letter:float-left first-letter:mr-4 first-letter:-mt-2">
              Welcome to <strong className="text-[#F8F4E6] font-normal">Walk With History</strong>—a heartfelt journey born from the seventh generation of a proud Goan family. We are Puja Mapxencar and Rohan Bandekar, two cousins whose roots run deep in Goa's timeless soil. Our story is one of family heritage, whispered tales, and a shared love for bringing history to life.
            </p>
            <p>
              Growing up, we were enchanted by the stories passed down from our ancestors—tales of resilience during the Portuguese era and the vibrant cultural mosaic of Goa. For us, these narratives were more than history lessons; they were living memories that sparked a calling.
            </p>
          </div>
          <div className="space-y-6">
            <p>
              In founding Walk With History in 2017, we chose to embrace a different rhythm of travel—one that is slow, immersive, and deeply connected to the land. We don't believe in traditional guides; instead, we are storytellers who invite our guests to step into the past. 
            </p>
            <p>
              As we share each tale, we want you to imagine yourself right there in history's embrace.
            </p>
          </div>
        </div>
      </div>

      {/* Video Portrait Section */}
      <div className="relative max-w-5xl mx-auto px-4 py-8 mb-16 z-10">
        <div className="p-4 md:p-6 bg-[#1a140f] border border-[#F5B400]/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center border border-[#0a0806]">
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
              <div className="text-center">
                <p className="font-serif text-[#E8DCC4]/40 italic text-lg">Awaiting visual history...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* The Legacy / Stats */}
      <div className="relative bg-[#16120c] py-20 border-y border-[#F5B400]/10 z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-16 lg:gap-32">
          <div className="text-center group">
            <span className="block font-satisfy text-6xl md:text-7xl text-[#F5B400] mb-2 drop-shadow-md group-hover:scale-105 transition-transform duration-500">
              {settings?.yearsOld || 8}+
            </span>
            <span className="font-serif text-sm tracking-[0.2em] text-[#E8DCC4]/60 uppercase">Years of Legacy</span>
          </div>
          <div className="text-center group">
            <span className="block font-satisfy text-6xl md:text-7xl text-[#F5B400] mb-2 drop-shadow-md group-hover:scale-105 transition-transform duration-500">
              {settings?.explorersCount || 1098}+
            </span>
            <span className="font-serif text-sm tracking-[0.2em] text-[#E8DCC4]/60 uppercase">Fellow Explorers</span>
          </div>
          <div className="text-center group">
            <span className="block font-satisfy text-6xl md:text-7xl text-[#F5B400] mb-2 drop-shadow-md group-hover:scale-105 transition-transform duration-500">
              {settings?.storytellerExperienceYears || 10}+
            </span>
            <span className="font-serif text-sm tracking-[0.2em] text-[#E8DCC4]/60 uppercase">Years of Lore</span>
          </div>
        </div>
      </div>

      {/* Vision & Call to Action */}
      <div className="relative max-w-4xl mx-auto px-4 py-24 text-center z-10">
        <h2 className="font-satisfy text-4xl md:text-5xl text-[#F5B400] mb-10">A Window into Goa's Soul</h2>
        <div className="font-serif text-lg md:text-xl leading-relaxed text-[#E8DCC4]/80 space-y-6">
          <p>
            Our vision is to offer travelers a window into Goa's soul. We celebrate offbeat paths, local artisans, and the beauty of unhurried exploration. We want our guests to experience Goa as we do—not just as visitors, but as part of a living, breathing community.
          </p>
          <p>
            Through these shared experiences, we aim to support local shopkeepers and artisans, ensuring that the heartbeat of Goa continues to thrive.
          </p>
          <div className="py-8 border-t border-[#F5B400]/20 mt-8 pt-10">
            <p className="italic text-[#F5B400] font-medium text-xl">
              "For us, it's about giving back to the land and the people who make Goa extraordinary. We invite you to walk with us, to slow down, and to uncover the magic woven into Goa's very soul. Come be part of our story, and let's create timeless memories together."
            </p>
          </div>
        </div>
      </div>

      {/* Minimal Heritage Footer Links */}
      <div className="py-12 bg-[#0a0806] border-t border-[#F5B400]/10 flex justify-center space-x-8">
        <a href="https://www.instagram.com/walkwithhistorygoa/" target="_blank" rel="noopener noreferrer" className="text-[#E8DCC4]/40 hover:text-[#F5B400] transition-colors transform duration-300">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
        </a>
        <a href="https://www.facebook.com/walkwithistorygoa/" target="_blank" rel="noopener noreferrer" className="text-[#E8DCC4]/40 hover:text-[#F5B400] transition-colors transform duration-300">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
        </a>
        <a href="https://www.youtube.com/@walkwithhistorygoa" target="_blank" rel="noopener noreferrer" className="text-[#E8DCC4]/40 hover:text-[#F5B400] transition-colors transform duration-300">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
        </a>
      </div>
    </div>
  );
};

export default About;
