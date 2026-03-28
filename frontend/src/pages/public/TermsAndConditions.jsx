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
                        WALK WITH HISTORY LLP
                    </p>
                    <h1 className="font-satisfy text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                        Terms & <span className="text-[#F5B400]">Conditions</span>
                    </h1>
                    <div className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed space-y-1">
                        <p>Registered with Ministry of Corporate Affairs, India</p>
                        <p>Head Office: Row 17 B 404, Adora de Goa, MES College, Dabolim, Goa – 403801</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 sm:space-y-8">

                    {/* Section 1 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">1</span>
                            Acceptance of Terms
                        </h2>
                        <div className="text-gray-400 text-sm sm:text-base ml-2">
                            <p>By booking a walking or trail tour with WALK WITH HISTORY LLP ("Company"), you agree to accept these Terms & Conditions, including the Release of Liability, Waiver, Indemnification, and Assumption of Risks. Failure to accept or submit required forms will result in denial of participation.</p>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">2</span>
                            Role of the Company
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li>The Company acts solely as an agent for independent suppliers (transport, accommodation, guides, etc.).</li>
                            <li>Services are provided by third parties who are not employees or agents of the Company.</li>
                            <li>The Company is not liable for supplier negligence, breach of contract, or failure to comply with local laws.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">3</span>
                            Assumption of Risks
                        </h2>
                        <div className="text-gray-400 text-sm sm:text-base ml-2 space-y-3">
                            <p>Walking and trail tours involve inherent risks, including but not limited to:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Physical exertion, altitude, weather extremes, wildlife encounters, and terrain hazards.</li>
                                <li>Transportation delays, cancellations, or accidents.</li>
                                <li>Illness, injury, or death due to natural causes, acts of God, or participant negligence.</li>
                            </ul>
                            <p>By booking, you voluntarily assume all risks associated with participation.</p>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">4</span>
                            Participant Responsibilities
                        </h2>
                        <div className="text-gray-400 text-sm sm:text-base ml-2 space-y-3">
                            <p>Participants must:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Select tours appropriate to their fitness and interests.</li>
                                <li>Disclose relevant medical conditions in writing before booking.</li>
                                <li>Prepare adequately with proper clothing, gear, and personal hygiene.</li>
                                <li>Follow instructions of guides and respect local customs.</li>
                                <li>Act responsibly toward fellow participants and the environment.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">5</span>
                            Health & Medical Care
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li>The Company and its guides are not qualified medical providers.</li>
                            <li>No liability is assumed for providing first aid or medical care.</li>
                            <li>Participants are responsible for consulting their physician before joining.</li>
                        </ul>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">6</span>
                            Insurance
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li>The Company does not provide travel or medical insurance.</li>
                            <li>Participants are strongly advised to purchase comprehensive travel insurance covering medical emergencies, evacuation, and trip cancellation.</li>
                        </ul>
                    </div>

                    {/* Section 7 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">7</span>
                            Pricing & Payment
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li>Prices are set with care but may change due to currency fluctuations, fuel surcharges, or unforeseen supplier costs.</li>
                            <li>Payment must be made in full by cheque, cash, or secure online interface at least 48 hours before the scheduled tour.</li>
                            <li>Failure to pay may result in automatic cancellation.</li>
                        </ul>
                    </div>

                    {/* Section 8 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">8</span>
                            Cancellations & Refunds
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li><strong className="text-white">Cancellation ≥24 hours before tour:</strong> Full refund.</li>
                            <li><strong className="text-white">Cancellation 12–24 hours before tour:</strong> 50% refund.</li>
                            <li><strong className="text-white">Cancellation &lt;12 hours before tour:</strong> No refund.</li>
                            <li>No refunds for cancellations due to terrorism, political unrest, health scares, or fear of travel.</li>
                            <li>If the Company cancels due to uncontrollable events (e.g., natural disasters, strikes), refunds will be limited to recoverable supplier payments.</li>
                        </ul>
                    </div>

                    {/* Section 9 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">9</span>
                            Media Release
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li>The Company may capture photos/videos during tours for promotional use.</li>
                            <li>By booking, participants consent to use of their images and testimonials.</li>
                            <li>If you prefer not to be photographed, notify the Company in writing before booking.</li>
                        </ul>
                    </div>

                    {/* Section 10 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">10</span>
                            Conduct & Disqualification
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li>The Company reserves the right to refuse or remove any participant whose behavior or health endangers others or disrupts the tour.</li>
                            <li>No refunds will be issued in such cases.</li>
                        </ul>
                    </div>

                    {/* Section 11 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">11</span>
                            Liability Waiver
                        </h2>
                        <div className="text-gray-400 text-sm sm:text-base ml-2 space-y-3">
                            <p>By booking, participants waive any claims against WALK WITH HISTORY LLP, its directors, guides, and agents for:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Injury, death, property loss, inconvenience, or delays.</li>
                                <li>Acts or omissions of suppliers or other participants.</li>
                                <li>Conditions beyond the Company's control.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 12 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">12</span>
                            Dispute Resolution
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li>Disputes will first be resolved through mediation.</li>
                            <li>If unresolved, disputes will proceed to arbitration.</li>
                            <li>Jurisdiction lies exclusively in Goa, India, at the Company's registered office.</li>
                        </ul>
                    </div>

                    {/* Section 13 */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
                        <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">13</span>
                            Additional Clauses
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
                            <li><strong className="text-white">Environmental Responsibility:</strong> Participants must respect nature, avoid littering, and follow Leave No Trace principles.</li>
                            <li><strong className="text-white">Force Majeure:</strong> The Company is not liable for delays or cancellations due to events beyond its control (natural disasters, strikes, pandemics, etc.).</li>
                            <li><strong className="text-white">Severability:</strong> If any clause is found unenforceable, the remaining terms remain valid.</li>
                            <li><strong className="text-white">Entire Agreement:</strong> These Terms & Conditions constitute the entire agreement between the participant and the Company.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;


