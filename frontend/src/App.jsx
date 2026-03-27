import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './components/layout/PublicLayout';
import Loader from './components/common/Loader';

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const FloatingBookNow = lazy(() => import('./components/forms/FloatingBookNow'));
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Tours = lazy(() => import('./pages/public/Tours'));
const TourDetails = lazy(() => import('./pages/public/TourDetails'));
const BookingDetails = lazy(() => import('./pages/public/BookingDetails'));
const BookingConfirmation = lazy(() => import('./pages/public/BookingConfirmation'));
const BookingProcessing = lazy(() => import('./pages/public/BookingProcessing'));
const PaymentSuccess = lazy(() => import('./pages/public/PaymentSuccess'));
const Policies = lazy(() => import('./pages/public/Policies'));
const TermsAndConditions = lazy(() => import('./pages/public/TermsAndConditions'));
const ExploreGoa = lazy(() => import('./pages/public/ExploreGoa'));
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'));
const Careers = lazy(() => import('./pages/public/Careers'));
const Corporate = lazy(() => import('./pages/public/Corporate'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AdminTours = lazy(() => import('./pages/admin/Tours'));
const Testimonials = lazy(() => import('./pages/admin/Testimonials'));
const Bookings = lazy(() => import('./pages/admin/Bookings'));
const TimelineEditor = lazy(() => import('./pages/admin/TimelineEditor'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const AdminBlogs = lazy(() => import('./pages/admin/Blogs'));
const AdminJobs = lazy(() => import('./pages/admin/Jobs'));
const AdminCorporateCards = lazy(() => import('./pages/admin/CorporateCards'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loader minHeightClass="min-h-[60vh]" />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<><PublicLayout /><FloatingBookNow /></>}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/book/details" element={<BookingDetails />} />
            <Route path="/book/confirm" element={<BookingConfirmation />} />
            <Route path="/book/processing" element={<BookingProcessing />} />
            <Route path="/book/success" element={<PaymentSuccess />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/explore-goa" element={<ExploreGoa />} />
            <Route path="/explore-goa/:id" element={<BlogDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/corporate" element={<Corporate />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Analytics />} />
            <Route path="dashboard" element={<Navigate to="/admin/analytics" replace />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="timeline" element={<TimelineEditor />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="corporate-cards" element={<AdminCorporateCards />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
