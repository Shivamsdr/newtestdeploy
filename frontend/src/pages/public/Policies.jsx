import { smoothScrollToTop } from '../../utils/smoothScroll';

const Policies = () => {
  // Ensure page starts at top when this route loads
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
            Cancellation & <span className="text-[#F5B400]">Refund Policy</span>
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
              General Terms
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>All bookings require 100% advance payment to confirm participation.</li>
              <li>Once payment is made, no refunds will be issued under any circumstances.</li>
              <li>Cancellations, rescheduling, or non-attendance will not entitle participants to any refund.</li>
              <li>This policy applies equally to group tours, corporate tours, and private tours.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">2</span>
              Rescheduling
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>Rescheduling requests must be made in writing and are subject to availability and Company discretion.</li>
              <li>Rescheduling requests made less than 48 hours before the scheduled start time will incur a 50% service charge.</li>
              <li>Delay in arrival beyond 30 minutes from the scheduled start time will be treated as a cancellation without refund.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">3</span>
              Group Tours
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>If a participant cancels or fails to attend, no refund will be provided.</li>
              <li>Reduction in group size after booking will not entitle participants to any refund or adjustment.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">4</span>
              Private & Corporate Tours
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>For private or corporate tours booked more than one month in advance, a 50% advance payment secures the booking.</li>
              <li>The balance must be paid at least 30 days before the tour date.</li>
              <li>If cancelled at any time, all payments made are non-refundable.</li>
              <li>Reduction in group size after booking will not entitle participants to any refund or adjustment.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">5</span>
              Partnered / Handpicked Experiences
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>Some experiences may be operated in collaboration with trusted travel partners.</li>
              <li>In such cases, the partner's cancellation policy will apply.</li>
              <li>Participants must review the specific cancellation terms listed on the product page before booking.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">6</span>
              Service Disruptions & Force Majeure
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>Tours may be disrupted or cancelled due to events beyond the Company's control (e.g., natural disasters, strikes, political unrest, pandemics, extreme weather).</li>
              <li>In such cases, WALK WITH HISTORY LLP will attempt to reschedule the tour.</li>
              <li>No refunds will be issued for cancellations due to force majeure events.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">7</span>
              Authority & Amendments
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>WALK WITH HISTORY LLP reserves the right to make the final decision in all matters concerning cancellations, rescheduling, and refunds.</li>
              <li>The Company may amend this policy from time to time. Any substantial changes will be communicated via email or announced on the website.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Policies;


