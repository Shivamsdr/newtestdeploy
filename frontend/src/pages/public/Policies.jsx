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
            Essential Info
          </p>
          <h1 className="font-satisfy text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-[#F5B400]">Policies</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            A concise overview of how bookings, payments, cancellations, and your personal
            information are handled when you travel with Walk with History.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 sm:space-y-8">

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">1</span>
              Booking & Confirmation
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>Bookings are confirmed only after full or specified advance payment is received.</li>
              <li>You will receive a confirmation email / WhatsApp message with tour details.</li>
              <li>Please review your booking details carefully and contact us immediately for any corrections.</li>
            </ul>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">2</span>
              Cancellations & Refunds
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>Cancellations made <strong className="text-white">48 hours or more</strong> before the tour start time are eligible for a refund or credit, minus any non‑refundable charges.</li>
              <li>Cancellations made <strong className="text-white">within 48 hours</strong> of the tour start time are generally non‑refundable.</li>
              <li>No‑shows or late arrivals are not eligible for refunds.</li>
              <li>If we cancel a tour (for safety, weather, or operational reasons), you will be offered a full refund or an alternative date.</li>
            </ul>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">3</span>
              Payments
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>Payments are processed through trusted payment gateways using secure encryption.</li>
              <li>All prices are displayed in INR unless stated otherwise and may be subject to applicable taxes.</li>
              <li>Any bank or payment gateway charges are the responsibility of the customer.</li>
            </ul>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">4</span>
              Guest Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>Guests are responsible for arriving at the meeting point on time.</li>
              <li>Please follow the instructions of your guide at all times for your safety.</li>
              <li>Inform us in advance of any medical conditions or special requirements.</li>
            </ul>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">5</span>
              Liability & Changes
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>While we take utmost care in planning and operating tours, itineraries may be adjusted due to weather, safety, or local conditions.</li>
              <li>Walk with History is not responsible for loss of personal belongings, injury, or delays caused by factors beyond our control.</li>
            </ul>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">6</span>
              Privacy
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base ml-2">
              <li>We collect only the information needed to manage your booking and communicate with you.</li>
              <li>Your personal details are not sold or shared with third parties for marketing purposes.</li>
              <li>We may use anonymised data to improve our services and guest experience.</li>
            </ul>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#F5B400]/30 transition-colors duration-300">
            <h2 className="font-satisfy text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center text-sm mr-3 border border-[#F5B400]/20">7</span>
              Contact
            </h2>
            <p className="text-gray-400 mb-4 text-sm sm:text-base ml-2">
              For any questions about these policies or your booking, please reach out:
            </p>
            <ul className="space-y-2 text-gray-300 ml-2">
              <li className="flex items-center gap-2">
                <span className="text-[#F5B400]">Email:</span>
                <a href="mailto:hello@walkwithhistory.com" className="hover:text-white transition-colors">hello@walkwithhistory.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F5B400]">Phone:</span>
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Policies;


