import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCorporateCards, getPublicSettings } from '../../services/api';
import Loader from '../../components/common/Loader';

const Corporate = () => {
    const [cards, setCards] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cardsRes, authSettingsRes] = await Promise.all([
                    getCorporateCards(true), // active only
                    getPublicSettings()
                ]);
                setCards(cardsRes.data?.corporateCards || []);
                setSettings(authSettingsRes.data?.settings || null);
            } catch (error) {
                console.error('Failed to fetch corporate data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    // Hook for the image slider (only if multiple images)
    useEffect(() => {
        if (!settings?.corporateHeaderImages || settings.corporateHeaderImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                (prev + 1) % settings.corporateHeaderImages.length
            );
        }, 5000); // 5 seconds per slide

        return () => clearInterval(interval);
    }, [settings?.corporateHeaderImages]);

    const headerImages = settings?.corporateHeaderImages?.length > 0
        ? settings.corporateHeaderImages
        : ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80'];

    return (
        <div className="bg-black text-white min-h-screen pt-24 pb-16 font-sans">
            {/* Hero Section */}
            <section className="relative w-full py-20 overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
                {/* Background Carousel */}
                {headerImages.map((imgUrl, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            backgroundImage: `url('${imgUrl}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    ></div>
                ))}
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="font-satisfy text-4xl md:text-6xl font-bold tracking-tight mb-6 mt-10 text-white">
                        Team Building Activities in Goa
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
                        How Make It Happen Turns Team Building in Goa into Unforgettable Goan Experiences
                    </p>
                    <a href="#enquire" className="inline-block px-8 py-4 bg-[#F5B400] text-black font-bold text-lg rounded-full hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(245,180,0,0.4)]">
                        Enquire Now
                    </a>
                </div>
            </section>

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-20">



                {/* Corporate Cards Grid */}
                <section>
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="font-satisfy text-3xl font-bold text-white">Our Corporate Experiences</h2>
                        <div className="h-1 flex-1 bg-white/10 ml-6 rounded-full"></div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center"><Loader /></div>
                    ) : cards.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cards.map((card) => (
                                <div key={card._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#F5B400]/50 transition-all group shadow-lg">
                                    <div className="h-56 overflow-hidden relative">
                                        <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-satisfy text-xl font-bold text-white mb-3 group-hover:text-[#47E4FF] transition-colors">{card.title}</h3>
                                        <p className="text-white/60 text-sm mb-6 line-clamp-4">{card.description}</p>
                                        <a href="#enquire" className="text-[#F5B400] font-semibold text-sm hover:underline flex items-center gap-2">
                                            Enquire for this event
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-white/50 border border-white/10 rounded-xl">
                            Experiences coming soon!
                        </div>
                    )}
                </section>

                {/* How It Works */}
                <section className="bg-white/5 p-10 md:p-14 rounded-3xl border border-white/10">
                    <h2 className="font-satisfy text-3xl font-bold text-[#F5B400] mb-12 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-[#F5B400]/20 rounded-full flex items-center justify-center mb-6 border border-[#F5B400]/40 group-hover:bg-[#F5B400] group-hover:text-black transition-all">
                                <span className="text-2xl font-bold text-[#F5B400] group-hover:text-black">1</span>
                            </div>
                            <h3 className="font-satisfy text-xl font-bold mb-3">Enquire</h3>
                            <p className="text-white/60 text-sm">Reach out online. A consultant gets in touch to figure out what your team wants.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-[#F5B400]/20 rounded-full flex items-center justify-center mb-6 border border-[#F5B400]/40 group-hover:bg-[#F5B400] group-hover:text-black transition-all">
                                <span className="text-2xl font-bold text-[#F5B400] group-hover:text-black">2</span>
                            </div>
                            <h3 className="font-satisfy text-xl font-bold mb-3">Customize</h3>
                            <p className="text-white/60 text-sm">The crew builds a plan mixing activities and logistics around your budget.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-[#F5B400]/20 rounded-full flex items-center justify-center mb-6 border border-[#F5B400]/40 group-hover:bg-[#F5B400] group-hover:text-black transition-all">
                                <span className="text-2xl font-bold text-[#F5B400] group-hover:text-black">3</span>
                            </div>
                            <h3 className="font-satisfy text-xl font-bold mb-3">Execute</h3>
                            <p className="text-white/60 text-sm">Our on-ground team takes over so you can focus on your people.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-[#F5B400]/20 rounded-full flex items-center justify-center mb-6 border border-[#F5B400]/40 group-hover:bg-[#F5B400] group-hover:text-black transition-all">
                                <span className="text-2xl font-bold text-[#F5B400] group-hover:text-black">4</span>
                            </div>
                            <h3 className="font-satisfy text-xl font-bold mb-3">Feedback</h3>
                            <p className="text-white/60 text-sm">Share what worked to keep experiences improving.</p>
                        </div>
                    </div>
                    <div className="mt-12 text-center">
                        <a href="#enquire" className="inline-block px-8 py-3 bg-[#F5B400] text-black font-bold rounded-full hover:bg-yellow-400 transition-all">
                            Enquire Now
                        </a>
                    </div>
                </section>

                {/* Why Choose Us component previously here */}

                {/* FAQ Section */}
                <section>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-satisfy text-3xl font-bold text-center text-white mb-10">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {settings?.corporateFaqs?.length > 0 ? (
                                settings.corporateFaqs.map((faq, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                        <h3 className="font-satisfy text-lg font-bold text-[#F5B400] mb-2">{faq.q}</h3>
                                        <p className="text-white/70">{faq.a}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-white/50 italic py-6 border border-white/10 rounded-xl">FAQs coming soon!</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Contact/Enquire Section */}
                <section id="enquire" className="bg-gradient-to-r from-[#F5B400]/10 to-transparent border border-[#F5B400]/20 p-10 md:p-16 rounded-3xl text-center">
                    <h2 className="font-satisfy text-3xl md:text-5xl font-bold text-white mb-6">Ready to Make It Happen?</h2>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
                        Recharge your team, fire up fresh ideas, or celebrate those big wins. We turn Goa into more than just a place. It becomes part of your team’s journey.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/contact" className="px-10 py-4 bg-[#F5B400] text-black font-bold text-lg rounded-full hover:bg-yellow-400 transition-all shadow-lg flex items-center gap-2">
                            Enquire Now
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Corporate;



