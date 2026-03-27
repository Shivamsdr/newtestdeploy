import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getAvailability, createBooking } from '../../services/api';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const summary = state?.bookingSummary ?? null;

  useEffect(() => {
    if (!summary) {
      navigate('/tours', { replace: true });
    }
  }, [summary, navigate]);

  const handleProceedToPayment = async () => {
    setError(null);

    if (!termsAccepted) {
      setError('Please accept the terms and conditions to proceed with payment.');
      return;
    }

    setLoading(true);
    try {
      // Final availability check before creating payment order
      try {
        const availabilityCheck = await getAvailability(summary.tourId, summary.bookingDate);
        const availableSlots = availabilityCheck?.data?.availableSlots ?? availabilityCheck?.availableSlots ?? 0;

        if (availableSlots < summary.peopleCount) {
          setError(
            `Sorry, only ${availableSlots} spot${availableSlots === 1 ? '' : 's'} ${availableSlots === 0 ? 'are' : 'is'} now available for this date. Please go back and select another date or reduce the number of guests.`
          );
          setLoading(false);
          return;
        }
      } catch (availabilityErr) {
        // If availability check fails, still try to proceed (backend will validate)
        console.warn('Availability check failed, proceeding with payment:', availabilityErr);
      }

      // Create the booking directly (backend instantly confirms it @ ₹0)
      const bookingResponse = await createBooking({
        tourId: summary.tourId,
        bookingDate: summary.bookingDate,
        peopleCount: summary.peopleCount,
        customerName: summary.customerDetails?.customerName || '',
        customerEmail: summary.customerDetails?.customerEmail || '',
        customerPhone: summary.customerDetails?.customerPhone || '',
        bookingTime: summary.bookingTime || undefined,
        bookingType: summary.bookingType || 'group',
      });

      const { booking } = bookingResponse.data;

      // Navigate to success page
      navigate('/book/success', {
        replace: true,
        state: {
          bookingId: booking._id,
          tourName: summary.tour?.name,
          bookingDate: summary.bookingDate,
          peopleCount: summary.peopleCount,
        },
      });

    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!summary) {
    return null;
  }

  const totalPrice = (summary.tour?.price ?? 0) * (summary.peopleCount ?? 1);
  const dateDisplay = summary.bookingDate
    ? new Date(summary.bookingDate + 'T12:00:00').toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : summary.bookingDate;

  return (
    <div className="min-h-screen bg-black py-8 md:py-12 overflow-x-hidden">
      <LoadingOverlay show={loading} message="Confirming your booking..." />
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-satisfy text-2xl md:text-3xl font-bold text-white mb-2">
          Booking summary
        </h1>
        <p className="text-white/60 mb-6">
          Review your details and confirm your booking.
        </p>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5B400] text-black font-bold shadow-[0_0_10px_rgba(245,180,0,0.4)]">
                1
              </div>
              <div className="w-24 h-1 bg-[#F5B400] mx-2"></div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5B400] text-black font-bold shadow-[0_0_10px_rgba(245,180,0,0.4)]">
                2
              </div>
              <div className="w-24 h-1 bg-[#F5B400] mx-2"></div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5B400] text-black font-bold shadow-[0_0_10px_rgba(245,180,0,0.4)]">
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>Select Tour</span>
            <span>Your Details</span>
            <span className="font-medium text-[#F5B400]">Confirm</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden mb-6">
          <div className="p-6 space-y-4">
            {/* Tour Info Section */}
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wide">Tour Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-white/60">Tour</span>
                  <span className="font-semibold text-white text-right max-w-xs">
                    {summary.tour?.name ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Booked for</span>
                  <span className="font-medium text-white/90">
                    {dateDisplay}
                  </span>
                </div>
                {summary.bookingTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Time</span>
                    <span className="font-medium text-white/90">
                      {summary.bookingTime}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Number of Guests</span>
                  <span className="font-medium text-white/90">
                    {summary.peopleCount ?? 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details Section */}
            {summary.customerDetails && (
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wide">Your Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Name</span>
                    <span className="font-medium text-white/90 text-right">
                      {summary.customerDetails.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Email</span>
                    <span className="font-medium text-white/90 text-right break-all">
                      {summary.customerDetails.customerEmail}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Phone</span>
                    <span className="font-medium text-white/90">
                      +91 {summary.customerDetails.customerPhone}
                    </span>
                  </div>
                  {summary.customerDetails.customerAddress && (
                    <div className="flex justify-between items-start">
                      <span className="text-white/60">Address</span>
                      <span className="font-medium text-white/90 text-right max-w-xs text-sm">
                        {summary.customerDetails.customerAddress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price Breakdown Section */}
            <div>
              <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wide">Confirmation</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">
                    {summary.peopleCount ?? 1} {summary.peopleCount === 1 ? 'person' : 'people'}
                  </span>
                  <span className="font-medium text-white/90">
                    ₹0
                  </span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Gross Amount</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[#F5B400]">
                  <span className="font-semibold">Advance Required</span>
                  <span className="font-bold">₹0</span>
                </div>
                <div className="pt-3 border-t-2 border-white/20 flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">You Pay Now</span>
                  <span className="text-3xl font-extrabold text-[#F5B400] drop-shadow-[0_0_8px_rgba(245,180,0,0.4)]">
                    ₹0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#F5B400] border-white/20 rounded focus:ring-[#F5B400] bg-black/50"
            />
            <span className="text-sm text-white/70">
              I agree to the{' '}
              <Link to="/terms" className="text-[#F5B400] hover:underline font-medium">
                Terms and Conditions
              </Link>
              {' '}and{' '}
              <Link to="/policies" className="text-[#F5B400] hover:underline font-medium">
                Privacy Policies
              </Link>
              . I understand that bookings are subject to availability and cancellation policies apply.
            </span>
          </label>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-400/10 border border-red-400/30 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <Link
            to={`/tours/${summary.tourId}`}
            state={{ refreshCalendar: true, fromBooking: true }}
            className="order-2 sm:order-1"
          >
            <Button variant="outline" size="lg" disabled={loading} className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
              Back to tour
            </Button>
          </Link>
          <Button
            variant="primary"
            size="lg"
            onClick={handleProceedToPayment}
            disabled={loading || !termsAccepted}
            className="order-1 sm:order-2 w-full sm:w-auto bg-[#F5B400] text-black hover:bg-[#ffc107] border-none border-none font-bold shadow-lg shadow-[#F5B400]/20 disabled:bg-gray-600 disabled:text-gray-400"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Booking @ ₹0
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;


