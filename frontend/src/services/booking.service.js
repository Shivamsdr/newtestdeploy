import { getAvailability, createBooking as apiCreateBooking } from './api.js';

/**
 * Normalize API errors into a single Error with a clear message.
 * @param {Error} err
 * @param {string} context - e.g. 'Availability check' or 'Booking'
 * @returns {never}
 */
function handleError(err, context) {
  const message = err?.message ?? 'Something went wrong';
  throw new Error(`${context}: ${message}`);
}

/**
 * Check availability for a tour on a given date.
 * Uses VITE_API_BASE_URL from environment via the shared API client.
 *
 * @param {string} tourId - Tour ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<{ availableSlots: number, totalSlots: number }>} Availability data
 * @throws {Error} When the request fails or validation fails
 */
export async function checkAvailability(tourId, date) {
  try {
    const response = await getAvailability(tourId, date);
    return response?.data ?? response;
  } catch (err) {
    handleError(err, 'Availability check failed');
  }
}

/**
 * Create a new booking.
 * Uses VITE_API_BASE_URL from environment via the shared API client.
 *
 * @param {Object} payload - Booking payload
 * @param {string} payload.tourId - Tour ID
 * @param {string} payload.bookingDate - Date in YYYY-MM-DD format
 * @param {number} payload.peopleCount - Number of people
 * @param {string} [payload.userId] - Optional user ID
 * @returns {Promise<Object>} Created booking from API (e.g. response.data.booking or response)
 * @throws {Error} When the request fails or validation fails
 */
export async function createBooking(payload) {
  try {
    const response = await apiCreateBooking(payload);
    return response?.data ?? response;
  } catch (err) {
    handleError(err, 'Booking failed');
  }
}
