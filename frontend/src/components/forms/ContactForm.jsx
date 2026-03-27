import { useState } from 'react';
import Button from '../common/Button';
import { createEnquiry } from '../../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    category: 'Query',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: `${formData.countryCode} ${formData.phone.trim()}`,
        category: formData.category.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', countryCode: '+1', phone: '', category: 'Query', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-900/20 border border-green-500/30 text-green-400 px-6 py-8 rounded-xl text-center backdrop-blur-sm">
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Message Sent!</h3>
        </div>
        <p className="text-green-400/80">Thank you for reaching out. We'll get back to you shortly.</p>
        <Button
          variant="outline"
          className="mt-6 border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 hover:border-green-400"
          onClick={() => setSubmitted(false)}
        >
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs sm:text-sm font-semibold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-5 py-3.5 sm:py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#F5B400]/40 focus:bg-white/[0.08] transition-all duration-300 text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full px-5 py-3.5 sm:py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#F5B400]/40 focus:bg-white/[0.08] transition-all duration-300 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1 mb-2">
            Phone Number
          </label>
          <div className="flex gap-3">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-24 sm:w-28 px-3 py-3.5 sm:py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5B400]/40 focus:bg-white/[0.08] transition-all duration-300 text-xs sm:text-sm cursor-pointer"
            >
              <option value="+91" className="bg-gray-900 text-white">🇮🇳 +91</option>
              <option value="+1" className="bg-gray-900 text-white">🇺🇸 +1</option>
              <option value="+44" className="bg-gray-900 text-white">🇬🇧 +44</option>
              <option value="+971" className="bg-gray-900 text-white">🇦🇪 +971</option>
              <option value="+61" className="bg-gray-800 text-white">🇦🇺 +61</option>
            </select>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="flex-1 min-w-0 px-5 py-3.5 sm:py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#F5B400]/40 focus:bg-white/[0.08] transition-all duration-300 text-sm sm:text-base font-semibold"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-5 py-3.5 sm:py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5B400]/40 focus:bg-white/[0.08] transition-all duration-300 text-xs sm:text-sm cursor-pointer"
          >
            <option value="Query" className="bg-gray-900 text-white">General Query</option>
            <option value="Enquiry" className="bg-gray-900 text-white">Tour Enquiry</option>
            <option value="Assistance" className="bg-gray-900 text-white">Booking Assistance</option>
            <option value="Feedback" className="bg-gray-900 text-white">Feedback</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows="4"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help?"
          className="w-full px-5 py-3.5 sm:py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#F5B400]/40 focus:bg-white/[0.08] transition-all duration-300 resize-none min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full group relative overflow-hidden bg-[#F5B400] text-black font-black uppercase tracking-widest text-xs sm:text-sm px-6 py-4 sm:py-5 rounded-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,180,0,0.3)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
        <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Send Message
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </button>
    </form>
  );
};

export default ContactForm;
