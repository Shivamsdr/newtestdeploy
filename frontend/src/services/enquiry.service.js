import { createEnquiry } from './api.js';

/**
 * Submit an enquiry (uses createEnquiry from API service layer)
 * @param {Object} enquiryData - The enquiry data
 * @param {string} enquiryData.name - Customer name
 * @param {string} enquiryData.phone - Customer phone
 * @param {string} enquiryData.email - Customer email
 * @param {string} enquiryData.preferredDate - Preferred date
 * @param {string} enquiryData.preferredTime - Preferred time
 * @param {number} enquiryData.peopleCount - Number of people
 * @returns {Promise<Object>} Response from the API
 */
export const submitEnquiry = async (enquiryData) => {
  return createEnquiry(enquiryData);
};
