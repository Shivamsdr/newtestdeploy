import { useState } from 'react';

const HomeFAQSection = ({ faqs = [] }) => {
    const [openIndex, setOpenIndex] = useState(null);

    if (!faqs || faqs.length === 0) return null;

    return (
        <section id="faq" className="relative py-24 bg-[#050509] overflow-hidden">
            {/* Background Subtle Gradient Glows to match reference aesthetics */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#47E4FF]/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#F5B400]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Common Questions from<br />
                        <span className="text-white">Smart Travelers</span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
                        Discover how our heritage tours and curated experiences help you create
                        unforgettable memories, adjust plans instantly, and explore with confidence.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer
                  ${isOpen ? 'bg-[#2A3742]' : 'bg-[#121A21] hover:bg-[#1A242E]'}
                `}
                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                            >
                                <div className="px-6 md:px-8 py-5 flex items-center justify-between gap-4">
                                    <h3 className={`text-base md:text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                                        {faq.q}
                                    </h3>
                                    <div className="text-gray-400 shrink-0">
                                        {isOpen ? (
                                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={`px-6 md:px-8 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HomeFAQSection;
