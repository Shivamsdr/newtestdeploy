import axios from 'axios';
import { VITE_API_BASE_URL } from '../config/env.js';

// Store logout callback to be set by AuthContext
let logoutCallback = null;

/**
 * Set the logout callback function from AuthContext
 * @param {Function} callback - Function to call on 401 errors
 */
export function setLogoutCallback(callback) {
  logoutCallback = callback;
}

export const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ========================================================
   SPEED UX OPTIMIZATION: IN-MEMORY RESPONSE CACHING 
   ========================================================
   This eliminates the "always loading" spinner entirely in React
   by immediately returning data from RAM without firing a network
   fetch if it was downloaded recently.
*/
const API_CACHE = new Map();
/**
 * Clear the in-memory API cache.
 * Call this when a mutation (create/update/delete) occurs to ensure next fetch gets fresh data.
 */
export const clearApiCache = () => {
  API_CACHE.clear();
};

export const cachedApiGet = async (url, config = {}, ttlSeconds = 300) => {
  const key = url + JSON.stringify(config.params || {});

  if (API_CACHE.has(key)) {
    const cached = API_CACHE.get(key);
    if (Date.now() < cached.expiry) {
      return cached.data; // Instantaneous load time
    }
    API_CACHE.delete(key);
  }

  const { data } = await api.get(url, config);
  API_CACHE.set(key, { data, expiry: Date.now() + (ttlSeconds * 1000) });
  return data;
};

/**
 * Set or clear the JWT for authenticated requests.
 * Call with token on login, null on logout.
 * @param {string | null} token
 */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Initialize token from localStorage if available (for page refreshes)
const TOKEN_KEY = 'goa_admin_jwt';
const savedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
if (savedToken) {
  setAuthToken(savedToken);
}

// Custom error class for authentication errors
export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.isAuthError = true;
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      // Don't trigger logout for login endpoint - those are expected 401s
      const isLoginEndpoint = requestUrl.includes('/auth/login');

      // Only trigger logout for authenticated endpoints (not during login attempts)
      if (!isLoginEndpoint && logoutCallback) {
        logoutCallback();
      }
      // Return a special authentication error that can be identified
      return Promise.reject(new AuthenticationError('Authentication required'));
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

/**
 * Fetch all tours
 * @returns {Promise<{ status: string, data: { tours: Array } }>}
 */
export const getTours = async (params = {}) => {
  return cachedApiGet('/tours', { params }, 300);
};

/**
 * Fetch a single tour by ID
 * @param {string} id - Tour ID
 * @returns {Promise<{ status: string, data: { tour: Object } }>}
 */
export const getTour = async (id) => {
  return cachedApiGet(`/tours/${id}`, {}, 300);
};

// HELPER: Mutation wrapper to clear cache after success
const mutate = async (method, url, data) => {
  const response = await api[method](url, data);
  clearApiCache();
  return response.data;
};

/**
 * Create an enquiry
 * @param {Object} enquiryData - The enquiry payload
 * @param {string} enquiryData.name - Customer name
 * @param {string} enquiryData.phone - Customer phone
 * @param {string} enquiryData.email - Customer email
 * @param {string} enquiryData.preferredDate - Preferred date
 * @param {string} enquiryData.preferredTime - Preferred time
 * @param {number} enquiryData.peopleCount - Number of people
 * @returns {Promise<Object>} API response data
 */
export const createEnquiry = async (enquiryData) => {
  return mutate('post', '/enquiries', enquiryData);
};

/**
 * Fetch all enquiries (admin). Requires auth.
 * @returns {Promise<{ status: string, data: { enquiries: Array } }>}
 */
export const getEnquiries = async () => {
  const { data } = await api.get('/enquiries');
  return data;
};

/**
 * Delete all completed enquiries (admin). Requires auth.
 * @returns {Promise<{ status: string, data: { deletedCount: number } }>}
 */
export const clearCompletedEnquiries = async () => {
  return mutate('delete', '/enquiries/completed');
};

/**
 * Update enquiry status (admin). Requires auth.
 * @param {string} id - Enquiry ID
 * @param {string} status - 'pending' | 'completed'
 * @returns {Promise<{ status: string, data: { enquiry: Object } }>}
 */
export const updateEnquiryStatus = async (id, status) => {
  return mutate('patch', `/enquiries/${id}/status`, { status });
};

/**
 * Admin login. Backend expects username; pass email (or username) as first arg.
 * @param {string} emailOrUsername - Email or admin username
 * @param {string} password
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const login = async (emailOrUsername, password) => {
  return api.post('/auth/login', {
    username: emailOrUsername,
    password,
  });
};

// ============================================
// TOURS (Admin CRUD)
// ============================================

export const createTour = async (tourData) => {
  return mutate('post', '/tours', tourData);
};

export const updateTour = async (id, tourData) => {
  return mutate('patch', `/tours/${id}`, tourData);
};

export const deleteTour = async (id) => {
  return mutate('delete', `/tours/${id}`);
};

/**
 * Get admin availability (with times[]) for a tour over a date range.
 * Constrained by backend to today..today+3 months.
 * @param {string} tourId
 * @param {string} start - YYYY-MM-DD
 * @param {string} end - YYYY-MM-DD
 */
export const getTourAvailabilityAdmin = async (tourId, start, end) => {
  const { data } = await api.get(`/tours/${tourId}/availability`, { params: { start, end } });
  return data;
};

/**
 * Set times[] for a tour on a specific date (admin).
 * @param {string} tourId
 * @param {string} date - YYYY-MM-DD
 * @param {string[]} times - HH:mm strings
 */
export const setTourAvailabilityTimesAdmin = async (tourId, date, times) => {
  return mutate('put', `/tours/${tourId}/availability/${date}`, { times });
};

// ============================================
// TESTIMONIALS
// ============================================

export const getTestimonials = async (activeOnly = false) => {
  const params = activeOnly ? '?active=true' : '';
  return cachedApiGet(`/testimonials${params}`, {}, 300);
};

export const getTestimonial = async (id) => {
  const { data } = await api.get(`/testimonials/${id}`);
  return data;
};

export const createTestimonial = async (testimonialData) => {
  return mutate('post', '/testimonials', testimonialData);
};

export const updateTestimonial = async (id, testimonialData) => {
  return mutate('patch', `/testimonials/${id}`, testimonialData);
};

export const deleteTestimonial = async (id) => {
  return mutate('delete', `/testimonials/${id}`);
};

// ============================================
// BLOGS (Explore Goa – Public list + Admin CRUD)
// ============================================

/** @param {boolean} [publishedOnly] - If true, only returns published blogs (for public page) */
export const getBlogs = async (publishedOnly = false) => {
  const params = publishedOnly ? '?published=true' : '';
  return cachedApiGet(`/blogs${params}`, {}, 300);
};

export const getBlog = async (id) => {
  return cachedApiGet(`/blogs/${id}`, {}, 300);
};

export const getBlogBySlug = async (slug) => {
  return cachedApiGet(`/blogs/slug/${slug}`, {}, 300);
};

export const createBlog = async (blogData) => {
  return mutate('post', '/blogs', blogData);
};

export const updateBlog = async (id, blogData) => {
  return mutate('patch', `/blogs/${id}`, blogData);
};

export const deleteBlog = async (id) => {
  return mutate('delete', `/blogs/${id}`);
};

// ============================================
// JOBS / CAREERS (Public list + Admin CRUD)
// ============================================

/** @param {boolean} [publishedOnly] - If true, only returns published jobs (for public Careers page) */
export const getJobs = async (publishedOnly = false) => {
  const params = publishedOnly ? '?published=true' : '';
  return cachedApiGet(`/jobs${params}`, {}, 300);
};

export const getJob = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

export const createJob = async (jobData) => {
  return mutate('post', '/jobs', jobData);
};

export const updateJob = async (id, jobData) => {
  return mutate('patch', `/jobs/${id}`, jobData);
};

export const deleteJob = async (id) => {
  return mutate('delete', `/jobs/${id}`);
};

// ============================================
// TIMELINE STEPS
// ============================================

export const getTimelineSteps = async () => {
  return cachedApiGet('/timeline', {}, 300);
};

export const getTimelineStepsByTour = async (tourId) => {
  const { data } = await api.get(`/timeline/tour/${tourId}`);
  return data;
};

export const getTimelineStep = async (id) => {
  const { data } = await api.get(`/timeline/${id}`);
  return data;
};

export const createTimelineStep = async (stepData) => {
  return mutate('post', '/timeline', stepData);
};

export const updateTimelineStep = async (id, stepData) => {
  return mutate('patch', `/timeline/${id}`, stepData);
};

export const deleteTimelineStep = async (id) => {
  return mutate('delete', `/timeline/${id}`);
};

export const reorderTimelineSteps = async (tourId, steps) => {
  return mutate('put', `/timeline/tour/${tourId}/reorder`, { steps });
};

// ============================================
// DASHBOARD STATS
// ============================================

export const getDashboardStats = async () => {
  const { data } = await api.get('/stats/dashboard');
  return data;
};

// ============================================
// BOOKINGS
// ============================================

/**
 * Check availability for a tour on a date. Public.
 * @param {string} tourId
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<{ status: string, data: { availableSlots: number, totalSlots: number } }>}
 */
export const getAvailability = async (tourId, date) => {
  const { data } = await api.get('/bookings/availability', {
    params: {
      tourId,
      date
    }
  });
  return data;
};

/**
 * Get availability for a range of dates. Public.
 * @param {string} tourId
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {Promise<{ status: string, data: { availability: Array } }>}
 */
export const getAvailabilityForRange = async (tourId, startDate, endDate) => {
  const { data } = await api.get('/bookings/availability/range', {
    params: {
      tourId,
      startDate,
      endDate
    }
  });
  return data;
};

/**
 * Get explicit future availability dates for a tour (customer-facing).
 * Returns an array like:
 * [
 *   { date: "2026-02-10", remainingSlots: 5 },
 *   ...
 * ]
 * Backed directly by TourAvailability without generating dates.
 * @param {string} tourId
 */
export const getTourAvailability = async (tourId) => {
  const { data } = await api.get(`/availability/${tourId}`);
  return data;
};

/**
 * Create a booking. Public.
 * @param {Object} payload - { tourId, bookingDate (YYYY-MM-DD), peopleCount, userId?, customerName?, customerAge?, customerGender?, customerEmail?, customerPhone?, customerAddress? }
 * @returns {Promise<{ status: string, data: { booking: Object } }>}
 */
export const createBooking = async (payload) => {
  return mutate('post', '/bookings', payload);
};

/**
 * Get all bookings (admin). Requires auth.
 * @param {{ tour?: string, status?: string }} params - optional filters
 * @returns {Promise<{ status: string, data: { bookings: Array } }>}
 */
export const getBookings = async (params = {}) => {
  const { data } = await api.get('/bookings', { params });
  return data;
};

/**
 * Get booking by ID. Public (for viewing own booking).
 * @param {string} id - Booking ID
 * @returns {Promise<{ status: string, data: { booking: Object } }>}
 */
export const getBookingById = async (id) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
};

/**
 * Update booking status (admin). Requires auth.
 * @param {string} id - Booking ID
 * @param {string} status - 'pending' | 'confirmed' | 'cancelled'
 * @returns {Promise<{ status: string, data: { booking: Object } }>}
 */
export const updateBookingStatus = async (id, status) => {
  return mutate('patch', `/bookings/${id}/status`, { status });
};

/**
 * Delete booking (admin). Requires auth.
 * @param {string} id - Booking ID
 * @returns {Promise<{ status: string, data: null, message: string }>}
 */
export const deleteBooking = async (id) => {
  return mutate('delete', `/bookings/${id}`);
};

/**
 * Create a completely offline booking (admin only). Not linked to website — e.g. phone/walk-in.
 * @param {Object} payload - { tourId, bookingDate (YYYY-MM-DD), peopleCount, amount, customerName, customerEmail?, customerPhone?, customerAddress? }
 * @returns {Promise<{ status: string, data: { booking: Object, payment: Object } }>}
 */
export const createOfflineBooking = async (payload) => {
  return mutate('post', '/bookings/offline', payload);
};

// ============================================
// PAYMENTS
// ============================================

/**
 * Create a Razorpay order for booking payment
 * @param {Object} orderData - { tourId, bookingDate, peopleCount, customerName, customerEmail, customerPhone, ... }
 * @returns {Promise<{ status: string, data: { orderId, amount, currency, keyId, bookingId, paymentId } }>}
 */
export const createPaymentOrder = async (orderData) => {
  const { data } = await api.post('/payments/create-order', orderData);
  return data;
};

/**
 * Verify payment after Razorpay checkout
 * @param {Object} paymentData - { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId }
 * @returns {Promise<{ status: string, data: { bookingId, paymentId } }>}
 */
export const verifyPayment = async (paymentData) => {
  const { data } = await api.post('/payments/verify', paymentData);
  return data;
};

/**
 * Get payment details
 * @param {string} paymentId - Payment ID
 * @returns {Promise<{ status: string, data: { payment: Object } }>}
 */
export const getPaymentDetails = async (paymentId) => {
  const { data } = await api.get(`/payments/${paymentId}`);
  return data;
};

// ============================================
// SETTINGS
// ============================================

/**
 * Get current settings (admin). Requires auth.
 * @returns {Promise<{ status: string, data: { settings: Object } }>}
 */
export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return data;
};

/**
 * Update settings (admin). Requires auth.
 * @param {Object} settingsData - {
 *   bookingsEnabled?: boolean,
 *   trustHeading?: string,
 *   trustSubheading?: string,
 *   yearsOld?: number,
 *   explorersCount?: number,
 *   storytellerExperienceYears?: number,
 *   airbnbLogoUrl?: string,
 *   getYourGuideLogoUrl?: string,
 *   tripadvisorLogoUrl?: string
 * }
 * @returns {Promise<{ status: string, data: { settings: Object } }>}
 */
export const updateSettings = async (settingsData) => {
  return mutate('patch', '/settings', settingsData);
};

/**
 * Get public-facing settings for homepage (no auth).
 * @returns {Promise<{ status: string, data: { settings: Object } }>}
 */
export const getPublicSettings = async () => {
  return cachedApiGet('/settings/public', {}, 300);
};

// ============================================
// ANALYTICS (Admin)
// ============================================

/**
 * Get analytics data for admin dashboard.
 * @param {{
 *  start?: string, // YYYY-MM-DD
 *  end?: string, // YYYY-MM-DD
 *  groupBy?: 'day'|'week'|'month',
 *  tour?: string,
 *  bookingStatus?: 'pending'|'confirmed'|'cancelled',
 *  paymentStatus?: 'created'|'pending'|'captured'|'failed'|'refunded',
 * }} params
 */
export const getAnalytics = async (params = {}) => {
  const { data } = await api.get('/stats/analytics', { params });
  return data;
};

// ============================================
// CORPORATE CARDS
// ============================================

export const getCorporateCards = async (activeOnly = false) => {
  const params = activeOnly ? '?active=true' : '';
  const { data } = await api.get(`/corporate-cards${params}`);
  return data;
};

export const getCorporateCard = async (id) => {
  const { data } = await api.get(`/corporate-cards/${id}`);
  return data;
};

export const createCorporateCard = async (cardData) => {
  return mutate('post', '/corporate-cards', cardData);
};

export const updateCorporateCard = async (id, cardData) => {
  return mutate('patch', `/corporate-cards/${id}`, cardData);
};

export const deleteCorporateCard = async (id) => {
  return mutate('delete', `/corporate-cards/${id}`);
};

