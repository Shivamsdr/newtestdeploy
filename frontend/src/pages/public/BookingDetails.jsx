import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const inputClass =
  'w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent bg-white/5 text-white placeholder-white/30';

const BookingDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerAge: '',
    customerGender: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
  });

  // Auto-format phone number as user types
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
  };
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const summary = state?.bookingSummary ?? null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!summary) navigate('/tours', { replace: true });
  }, [summary, navigate]);
  if (!summary) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number - auto-format
    if (name === 'customerPhone') {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    // Age is optional but if provided, must be valid
    if (formData.customerAge && formData.customerAge.trim()) {
      const age = Number(formData.customerAge);
      if (isNaN(age) || age < 1 || age > 120) {
        newErrors.customerAge = 'Age must be between 1 and 120';
      }
    }

    // Gender is optional - removed required validation

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else {
      const cleaned = formData.customerPhone.replace(/\D/g, '');
      if (cleaned.length !== 10) {
        newErrors.customerPhone = 'Please enter a valid 10-digit phone number';
      }
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Address is required';
    } else if (formData.customerAddress.trim().length < 10) {
      newErrors.customerAddress = 'Please provide a complete address (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Navigate to confirmation page with all details
    setSubmitting(true);
    navigate('/book/confirm', {
      state: {
        bookingSummary: {
          ...summary,
          customerDetails: {
            customerName: formData.customerName.trim(),
            customerAge: Number(formData.customerAge),
            customerGender: formData.customerGender,
            customerEmail: formData.customerEmail.trim().toLowerCase(),
            customerPhone: formData.customerPhone.trim(),
            customerAddress: formData.customerAddress.trim(),
          },
        },
      },
    });
  };

  const bookedForDisplay = summary.bookingDate
    ? new Date(summary.bookingDate + 'T12:00:00').toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : summary.bookingDate;

  const totalPrice = (summary.tour?.price ?? 0) * (summary.peopleCount ?? 1);

  return (
    <div className="min-h-screen bg-black py-8 md:py-12 overflow-x-hidden">
      <LoadingOverlay show={submitting} message="Processing details…" />
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-satisfy text-2xl md:text-3xl font-bold text-white mb-2">
          Booking Details
        </h1>
        <p className="text-white/60 mb-6">
          Please provide your details to complete the booking.
        </p>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5B400] text-black font-bold shadow-[0_0_10px_rgba(245,180,0,0.4)]">
                1
              </div>
              <div className="w-24 h-1 bg-[#F5B400] mx-2"></div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5B400] text-black font-bold shadow-[0_0_10px_rgba(245,180,0,0.4)]">
                2
              </div>
              <div className="w-24 h-1 bg-white/20 mx-2"></div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/50 font-semibold border border-white/10">
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>Select Tour</span>
            <span className="font-medium text-[#F5B400]">Your Details</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Book Now, Pay Later Notice */}
        <div className="bg-[#F5B400]/10 border border-[#F5B400]/30 rounded-xl p-4 sm:p-5 mb-8 flex items-start gap-4 shadow-lg shadow-[#F5B400]/5">
          <div className="bg-[#F5B400]/20 p-2 sm:p-3 rounded-full text-[#F5B400] shrink-0">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#F5B400] mb-1">Book Now, Pay Later @ ₹0!</h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Secure your spots today with an advance payment of <strong>₹0</strong>. The full amount is to be settled at least 24 hours prior to the tour start time.
            </p>
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#F5B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Booking Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tour:</span>
              <span className="font-semibold text-white text-right">
                {summary.tour?.name ?? '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Booked for:</span>
              <span className="font-medium text-white/90">{bookedForDisplay}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Number of Guests:</span>
              <span className="font-medium text-white/90">
                {summary.peopleCount ?? 1}
              </span>
            </div>
            {summary.bookingType && (
              <div className="flex justify-between items-center">
                <span className="text-white/60">Booking type:</span>
                <span className="font-medium text-white/90 capitalize">{summary.bookingType}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-white/60">Price per person:</span>
              <span className="font-medium text-white/90">
                ₹{(summary.tour?.price ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2 border-white/10">
              <span className="text-lg font-semibold text-white">Total Amount:</span>
              <span className="text-xl font-bold text-[#F5B400]">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Details Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Your Information
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-white/80 mb-1">
                Full Name <span className="text-[#F5B400]">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`${inputClass} ${errors.customerName ? 'border-red-500/50 focus:border-red-500' : ''}`}
                placeholder="Enter your full name"
                required
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-400">{errors.customerName}</p>
              )}
            </div>

            {/* Age and Gender Row - Optional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerAge" className="block text-sm font-medium text-white/80 mb-1">
                  Age <span className="text-white/40 text-xs">(Optional)</span>
                </label>
                <input
                  type="number"
                  id="customerAge"
                  name="customerAge"
                  value={formData.customerAge}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className={`${inputClass} ${errors.customerAge ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="Enter your age"
                />
                {errors.customerAge && (
                  <p className="mt-1 text-sm text-red-400">{errors.customerAge}</p>
                )}
              </div>

              <div>
                <label htmlFor="customerGender" className="block text-sm font-medium text-white/80 mb-1">
                  Gender <span className="text-white/40 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <select
                    id="customerGender"
                    name="customerGender"
                    value={formData.customerGender}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.customerGender ? 'border-red-500/50 focus:border-red-500' : ''
                      } pr-10 cursor-pointer appearance-none`}
                  >
                    <option value="" className="bg-[#111] text-white">Select gender (optional)</option>
                    <option value="male" className="bg-[#111] text-white">Male</option>
                    <option value="female" className="bg-[#111] text-white">Female</option>
                    <option value="other" className="bg-[#111] text-white">Other</option>
                    <option value="prefer-not-to-say" className="bg-[#111] text-white">Prefer not to say</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-4 w-4 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.customerGender && (
                  <p className="mt-1 text-sm text-red-400">{errors.customerGender}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-white/80 mb-1">
                Email Address <span className="text-[#F5B400]">*</span>
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className={`${inputClass} ${errors.customerEmail ? 'border-red-500/50 focus:border-red-500' : ''}`}
                placeholder="your.email@example.com"
                required
              />
              {errors.customerEmail && (
                <p className="mt-1 text-sm text-red-400">{errors.customerEmail}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-white/80 mb-1">
                Phone Number <span className="text-[#F5B400]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-white/50 border-r border-white/10 pr-2 mr-2">+91</span>
                </div>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  maxLength="10"
                  className={`${inputClass} pl-14 ${errors.customerPhone ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="9876543210"
                  required
                />
              </div>
              {errors.customerPhone && (
                <p className="mt-1 text-sm text-red-400">{errors.customerPhone}</p>
              )}
              <p className="mt-1 text-xs text-white/40">
                We'll use this to send booking confirmation
              </p>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="customerAddress" className="block text-sm font-medium text-white/80 mb-1">
                Complete Address <span className="text-[#F5B400]">*</span>
              </label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} ${errors.customerAddress ? 'border-red-500/50 focus:border-red-500' : ''}`}
                placeholder="Street address, City, State, PIN code"
                required
              />
              {errors.customerAddress && (
                <p className="mt-1 text-sm text-red-400">{errors.customerAddress}</p>
              )}
              <p className="mt-1 text-xs text-white/40">
                Include street, city, state, and PIN code
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center mt-8 pt-6 border-t border-white/10">
            <Link to={`/tours/${summary.tourId}`} className="order-2 sm:order-1">
              <Button variant="outline" size="lg" disabled={submitting} className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                Back
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="order-1 sm:order-2 w-full sm:w-auto bg-[#F5B400] text-black hover:bg-[#ffc107] border-none border-none font-bold shadow-lg shadow-[#F5B400]/20"
            >
              {submitting ? 'Processing...' : 'Book for ₹0 (Pay Later) →'}
            </Button>
          </div>
        </form>
      </div>
    </div >
  );
};

export default BookingDetails;


