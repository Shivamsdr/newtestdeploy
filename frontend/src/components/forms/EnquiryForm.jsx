import { useState } from 'react';
import { submitEnquiry } from '../../services/enquiry.service';
import Button from '../common/Button';

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    peopleCount: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'preferredDate':
        if (!value) {
          error = 'Preferred date is required';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            error = 'Preferred date cannot be in the past';
          }
        }
        break;
      case 'preferredTime':
        if (!value) {
          error = 'Preferred time is required';
        }
        break;
      case 'peopleCount':
        if (!value) {
          error = 'Number of people is required';
        } else {
          const count = parseInt(value, 10);
          if (isNaN(count) || count < 1) {
            error = 'Please enter a valid number (minimum 1)';
          } else if (count > 50) {
            error = 'Maximum 50 people allowed';
          }
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number (remove non-digits)
    let processedValue = value;
    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear general error
    if (error) {
      setError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const enquiryData = {
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email.trim(),
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        peopleCount: parseInt(formData.peopleCount, 10),
      };

      await submitEnquiry(enquiryData);

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        preferredDate: '',
        preferredTime: '',
        peopleCount: '',
      });
      setErrors({});

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-100  border border-green-400  text-green-700  px-6 py-4 rounded-lg">
        <div className="flex items-center">
          <span className="text-2xl mr-3">✓</span>
          <div>
            <h3 className="font-semibold mb-1">Enquiry Submitted Successfully!</h3>
            <p>We'll get back to you soon with tour details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100  border border-red-400  text-red-700  px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent    ${
            errors.name
              ? 'border-red-500 '
              : 'border-gray-300 '
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 ">{errors.name}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          maxLength="10"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent    ${
            errors.phone
              ? 'border-red-500 '
              : 'border-gray-300 '
          }`}
          placeholder="10-digit phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 ">{errors.phone}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent    ${
            errors.email
              ? 'border-red-500 '
              : 'border-gray-300 '
          }`}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 ">{errors.email}</p>
        )}
      </div>

      {/* Preferred Date Field */}
      <div>
        <label
          htmlFor="preferredDate"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Preferred Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="preferredDate"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent    ${
            errors.preferredDate
              ? 'border-red-500 '
              : 'border-gray-300 '
          }`}
        />
        {errors.preferredDate && (
          <p className="mt-1 text-sm text-red-600 ">
            {errors.preferredDate}
          </p>
        )}
      </div>

      {/* Preferred Time Field */}
      <div>
        <label
          htmlFor="preferredTime"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Preferred Time <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          id="preferredTime"
          name="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent    ${
            errors.preferredTime
              ? 'border-red-500 '
              : 'border-gray-300 '
          }`}
        />
        {errors.preferredTime && (
          <p className="mt-1 text-sm text-red-600 ">
            {errors.preferredTime}
          </p>
        )}
      </div>

      {/* People Count Field */}
      <div>
        <label
          htmlFor="peopleCount"
          className="block text-sm font-medium text-gray-700  mb-2"
        >
          Number of People <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="peopleCount"
          name="peopleCount"
          value={formData.peopleCount}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          min="1"
          max="50"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent    ${
            errors.peopleCount
              ? 'border-red-500 '
              : 'border-gray-300 '
          }`}
          placeholder="Enter number of people"
        />
        {errors.peopleCount && (
          <p className="mt-1 text-sm text-red-600 ">
            {errors.peopleCount}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Enquiry'}
      </Button>
    </form>
  );
};

export default EnquiryForm;
