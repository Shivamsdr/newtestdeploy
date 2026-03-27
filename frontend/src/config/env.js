/**
 * Centralized environment configuration.
 * Vite loads .env, .env.local, .env.[mode] from project root.
 * All values come from import.meta.env; no secrets hardcoded.
 *
 * Fallback handling:
 * - VITE_API_BASE_URL: defaults to http://localhost:5000/api/v1 when missing.
 * - VITE_EMAILJS_*: empty string when missing; use isEmailJsConfigured() before send.
 */

const getEnv = (key, fallback = '') => {
  const v = import.meta.env[key];
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
};

/** API base URL. Fallback for local dev when .env is missing. */
export const VITE_API_BASE_URL =
  getEnv('VITE_API_BASE_URL') || 'http://localhost:3000/api/v1';
  console.log("API BASE URL =", VITE_API_BASE_URL);

/** EmailJS Service ID. Empty if not set. */
export const VITE_EMAILJS_SERVICE_ID = getEnv('VITE_EMAILJS_SERVICE_ID');

/** EmailJS Template ID. Empty if not set. */
export const VITE_EMAILJS_TEMPLATE_ID = getEnv('VITE_EMAILJS_TEMPLATE_ID');

/** EmailJS User ID (public key). Required for EmailJS; empty if not set. */
export const VITE_EMAILJS_USER_ID = getEnv('VITE_EMAILJS_USER_ID');

/** EmailJS Service ID for booking confirmation emails. Separate from contact form. */
export const VITE_EMAILJS_SERVICE_ID_BOOKING = getEnv('VITE_EMAILJS_SERVICE_ID_BOOKING');

/** EmailJS Template ID for booking confirmation emails. */
export const VITE_EMAILJS_TEMPLATE_ID_BOOKING = getEnv('VITE_EMAILJS_TEMPLATE_ID_BOOKING');

/** Whether EmailJS is fully configured (all three vars non-empty). */
export const isEmailJsConfigured = () =>
  !!(VITE_EMAILJS_USER_ID && VITE_EMAILJS_SERVICE_ID && VITE_EMAILJS_TEMPLATE_ID);

/** Whether booking confirmation EmailJS is configured (user + booking service + booking template). */
export const isBookingEmailConfigured = () =>
  !!(VITE_EMAILJS_USER_ID && VITE_EMAILJS_SERVICE_ID_BOOKING && VITE_EMAILJS_TEMPLATE_ID_BOOKING);

/** OpenWeatherMap API Key (optional). If not set, uses free Open-Meteo API. */
export const VITE_WEATHER_API_KEY = getEnv('VITE_WEATHER_API_KEY');
