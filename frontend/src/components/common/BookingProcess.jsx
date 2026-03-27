import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicSettings } from '../../services/api';
import { smoothScrollToTop } from '../../utils/smoothScroll';

const steps = [
    {
        title: "Choose Your Vibe",
        desc: "Browse our curated collection of immersive heritage walks and pick your perfect experience."
    },
    {
        title: "Reserve @ ₹0",
        desc: "Secure your spot instantly. No credit card required upfront—we trust our travellers!"
    },
    {
        title: "Walk with History",
        desc: "Immerse yourself in untold stories and hidden gems guided by our expert storytellers."
    },
    {
        title: "Pay Before Arrival",
        desc: "We will reach out to you 24 hours before your tour to collect payment and finalize our walk."
    }
];

const BookingProcess = () => {
    const [bgImage, setBgImage] = useState('/assets/images/cta-goa-sunset.jpg');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await getPublicSettings();
                if (res.data?.settings?.floatingBookNowBg) {
                    setBgImage(res.data.settings.floatingBookNowBg);
                }
            } catch (err) {
                console.error('Failed to fetch floating form background', err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <section className="bg-[#050509] text-white overflow-hidden font-sans border-t border-b border-white/5 relative flex lg:h-screen lg:min-h-[850px] lg:max-h-[1080px] w-full items-center py-16 lg:py-0">
            {/* Background Details */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#F5B400]/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#47E4FF]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col h-full justify-center">

                {/* Header Section */}
                <div className="text-center mb-10 lg:mb-12">
                    <span className="text-[#F5B400] font-semibold tracking-[0.2em] uppercase text-sm lg:text-base">How it works</span>
                    <h2 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-satisfy font-bold tracking-tight mt-3">
                        Book Tour in 4 Easy Steps
                    </h2>
                </div>

                {/* Content Section: Image Left, Steps Right */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center flex-1 min-h-0">

                    {/* Left: Image Card */}
                    <div className="w-full lg:w-[55%] lg:h-full lg:max-h-[80vh] flex items-center justify-center">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl w-full h-full max-w-3xl mx-auto aspect-square lg:aspect-auto">
                            <img
                                src={bgImage}
                                alt="Booking Tour Landscape"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />

                            {/* Glassmorphism Bottom Box */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 flex items-center justify-between">
                                    <p className="text-white text-xs sm:text-sm font-medium leading-snug max-w-[60%] mr-3">
                                        Plan your heritage adventure in minutes with our simple and secure <br className="hidden lg:block" /> <strong className="font-bold text-[#F5B400]">Book @ ₹0</strong> system.
                                    </p>
                                    <Link to="/tours" onClick={smoothScrollToTop} className="shrink-0 flex items-center justify-center">
                                        <button className="px-4 py-2 bg-[#F5B400] text-black text-xs sm:text-sm font-extrabold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,180,0,0.4)] whitespace-nowrap">
                                            Book Now @ ₹0
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Steps */}
                    <div className="w-full lg:w-[45%] flex flex-col justify-center h-full xl:pl-8">
                        <div className="mb-2 lg:mb-4">
                            {/* Removed redundant heading from the right column since it's now at the top of the section */}
                        </div>

                        <div className="space-y-3 lg:space-y-5">
                            {steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-4 lg:gap-6 p-4 lg:p-5 rounded-2xl transition-all duration-300 border ${idx === 0 ? 'bg-white/5 border-white/10 shadow-[0_0_20px_rgba(245,180,0,0.1)]' : 'border-transparent hover:bg-white/5 hover:border-white/5'}`}
                                >
                                    {/* Number Badge */}
                                    <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-lg lg:text-xl font-bold shrink-0 shadow-lg ${idx === 0 ? 'bg-[#F5B400] text-black' : 'bg-[#111] text-[#F5B400] border border-white/10'}`}>
                                        {idx + 1}
                                    </div>

                                    {/* Text Content */}
                                    <div className="pt-1 lg:pt-2">
                                        <h4 className={`text-base lg:text-xl font-bold mb-1 lg:mb-2 ${idx === 0 ? 'text-white' : 'text-gray-200'}`}>{step.title}</h4>
                                        <p className="text-gray-400 text-xs lg:text-base leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BookingProcess;
