import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getBookingById } from '../../services/api';
const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state?.bookingId) {
      navigate('/tours', { replace: true });
      return;
    }

    const fetchDetails = async () => {
      try {
        const bookingRes = await getBookingById(state.bookingId).catch(() => null);
        const booking = bookingRes?.data?.booking ?? null;

        if (booking) {
          setBookingDetails(booking);
        }

      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [state, navigate]);

  if (!state?.bookingId) {
    return null;
  }

  const dateDisplay = state.bookingDate
    ? new Date(state.bookingDate + 'T12:00:00').toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : state.bookingDate;

  const bookedOnDisplay = bookingDetails?.createdAt
    ? new Date(bookingDetails.createdAt).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : null;

  return (
    <div className="min-h-screen bg-gray-50  py-12 md:py-16 overflow-x-hidden">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100  mb-6">
          <svg
            className="w-12 h-12 text-green-600 "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="font-satisfy text-3xl md:text-4xl font-bold text-gray-800  mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-gray-600  mb-8">
          Your reservation has been confirmed. You will receive an email confirmation shortly.
        </p>

        {loading && (
          <div className="mb-6 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-500 ">Loading booking details...</p>
          </div>
        )}

        {/* Booking Details Card */}
        <div className="bg-white  rounded-xl shadow-lg border border-gray-200  p-6 mb-6 text-left">
          <h2 className="text-xl font-bold text-gray-800  mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Booking Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 ">Booking ID</span>
              <span className="font-medium text-gray-800  font-mono text-sm bg-gray-100  px-2 py-1 rounded">
                {state.bookingId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 ">Tour</span>
              <span className="font-medium text-gray-800  text-right">
                {state.tourName || bookingDetails?.tourId?.name || '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 ">Booked for</span>
              <span className="font-medium text-gray-800 ">
                {dateDisplay}
              </span>
            </div>
            {bookedOnDisplay && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 ">Booked on</span>
                <span className="font-medium text-gray-800  text-right">
                  {bookedOnDisplay}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500 ">Number of Guests</span>
              <span className="font-medium text-gray-800 ">
                {state.peopleCount || bookingDetails?.peopleCount || 1}
              </span>
            </div>
            {bookingDetails?.customerName && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 ">
                <span className="text-gray-500 ">Booked by</span>
                <span className="font-medium text-gray-800 ">
                  {bookingDetails.customerName}
                </span>
              </div>
            )}
            {bookingDetails?.customerEmail && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 ">Email</span>
                <span className="font-medium text-gray-800  text-right break-all">
                  {bookingDetails.customerEmail}
                </span>
              </div>
            )}
            {bookingDetails?.totalAmount && (
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300 ">
                <span className="text-lg font-semibold text-gray-800 ">Amount to be Paid</span>
                <span className="text-xl font-bold text-green-600 ">
                  ₹{bookingDetails.totalAmount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50  rounded-lg p-4 mb-6 border border-blue-200 ">
          <h3 className="font-semibold text-gray-800  mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Information
          </h3>
          <ul className="text-sm text-gray-700  space-y-2 list-disc list-inside">
            <li>Please arrive 15 minutes before the scheduled tour time</li>
            <li>Carry a valid ID proof for verification</li>
            <li>For cancellations, please contact us at least 24 hours before the tour date</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              // Print or download detailed receipt (use \"Save as PDF\" in your browser)
              window.print();
            }}
            className="print:hidden"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Detailed Receipt
            </span>
          </Button>
          <Link to="/tours">
            <Button variant="primary" size="lg">
              Browse More Tours
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg">
              Go to Home
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500 ">
          Need help? <Link to="/contact" className="text-blue-600  hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

