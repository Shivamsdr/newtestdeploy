import React from 'react';
import { smoothScrollToTop } from '../../utils/smoothScroll';

const TermsAndConditions = () => {
    smoothScrollToTop();

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-[#F5B400] selection:text-black pt-20 sm:pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <p className="text-[#F5B400] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3">
                        Legal
                    </p>
                    <h1 className="font-satisfy text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Terms & <span className="text-[#F5B400]">Conditions</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Please read these terms carefully before booking a tour with us. They outline your rights and obligations as a guest.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8 sm:space-y-12">

                    {/* Section 1 */}
                    <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="text-[#F5B400] mr-3">01.</span> Introduction
                        </h2>
                        <div className="prose prose-invert prose-sm sm:prose-base text-gray-400 max-w-none">
                            <p>
                                Welcome to Walk with History. By booking a tour or using our website, you agree to comply with and be bound by the following terms and conditions. If you disagree with any part of these terms, please do not use our services.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="text-[#F5B400] mr-3">02.</span> Booking & Payments
                        </h2>
                        <div className="prose prose-invert prose-sm sm:prose-base text-gray-400 max-w-none">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>All bookings are subject to availability and confirmation by Walk with History.</li>
                                <li>Full payment or a specified deposit must be made at the time of booking to secure your spot.</li>
                                <li>Prices are listed in INR and are subject to change without prior notice, though confirmed bookings will be honored at the booked price.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="text-[#F5B400] mr-3">03.</span> Cancellations & Refunds
                        </h2>
                        <div className="prose prose-invert prose-sm sm:prose-base text-gray-400 max-w-none">
                            <p className="mb-4">
                                We understand that plans change. Our cancellation policy is designed to be fair to both our guests and our guides.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong className="text-white">48+ Hours Notice:</strong> Eligible for a full refund or rescheduling.</li>
                                <li><strong className="text-white">Less than 48 Hours:</strong> Non-refundable, as we have already reserved resources for you.</li>
                                <li><strong className="text-white">No Shows:</strong> Guests who do not arrive at the meeting point on time will be considered no-shows and are not eligible for refunds.</li>
                                <li><strong className="text-white">Operator Cancellation:</strong> If we cancel due to extreme weather or safety concerns, you will receive a 100% refund.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="text-[#F5B400] mr-3">04.</span> Guest Conduct
                        </h2>
                        <div className="prose prose-invert prose-sm sm:prose-base text-gray-400 max-w-none">
                            <p>
                                To ensure a safe and enjoyable experience for everyone, we ask that you:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-3">
                                <li>Respect local customs, culture, and privacy of residents in heritage areas.</li>
                                <li>Follow the instructions of the tour guide at all times.</li>
                                <li>Refrain from disruptive behavior. We reserve the right to remove any guest who poses a threat to safety or enjoyment of others without refund.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="text-[#F5B400] mr-3">05.</span> Liability
                        </h2>
                        <div className="prose prose-invert prose-sm sm:prose-base text-gray-400 max-w-none">
                            <p>
                                Walk with History acts as an intermediary for certain services. We are not liable for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-3">
                                <li>Loss, theft, or damage to personal property during the tour.</li>
                                <li>Personal injury or accidents, except where caused by our direct negligence.</li>
                                <li>Delays or itinerary changes due to unforeseen circumstances (traffic, road closures, etc.).</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="text-[#F5B400] mr-3">06.</span> Intellectual Property
                        </h2>
                        <div className="prose prose-invert prose-sm sm:prose-base text-gray-400 max-w-none">
                            <p>
                                All content on this website, including text, images, and logos, is the property of Walk with History. You may not use, reproduce, or distribute any content without our prior written permission.
                            </p>
                        </div>
                    </section>

                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center border-t border-white/10 pt-8">
                    <p className="text-gray-500 text-sm">
                        Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default TermsAndConditions;


