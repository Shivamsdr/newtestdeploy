import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const BookingProcessing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If user lands here after payment, redirect to success page after a short delay
    // This page is mainly for edge cases where payment verification is delayed
    if (state?.bookingId && state?.fromPayment) {
      const timer = setTimeout(() => {
        navigate('/book/success', {
          replace: true,
          state: {
            bookingId: state.bookingId,
            paymentId: state.paymentId,
          },
        });
      }, 3000); // Wait 3 seconds then redirect

      return () => clearTimeout(timer);
    }
  }, [state, navigate]);

  return (
    <div className="min-h-screen bg-gray-50  py-12 md:py-16 overflow-x-hidden">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100  mb-6">
          <div
            className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400  border-t-transparent"
            aria-hidden
          />
        </div>
        <h1 className="font-satisfy text-2xl md:text-3xl font-bold text-gray-800  mb-4">
          Processing Your Booking
        </h1>
        <p className="text-gray-600  mb-4 leading-relaxed">
          We're verifying your payment and confirming your booking. This usually takes just a few seconds.
        </p>
        {state?.fromPayment && (
          <p className="text-sm text-gray-500  mb-8">
            You will be redirected automatically once your booking is confirmed...
          </p>
        )}
        {!state?.fromPayment && (
          <p className="text-sm text-gray-500  mb-8">
            Please wait while we process your booking request.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/tours">
            <Button variant="primary" size="lg">
              Browse More Tours
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingProcessing;

