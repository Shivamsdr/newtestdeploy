import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getTours,
  createTour,
  updateTour,
  deleteTour,
  getTourAvailabilityAdmin,
  setTourAvailabilityTimesAdmin,
  AuthenticationError,
} from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const emptyForm = {
  name: '',
  price: '',
  duration: '',
  difficulty: 'easy',
  maxGroupSize: '',
  summary: '',
  shortDescription: '',
  imageCover: '',
  images: [], // Array of strings (URLs)
  tags: '',
  category: '',
  dayType: 'full-day',
  locationName: '',
  googleMapLink: '',
  allowedBookingTypes: ['group', 'private'],
  faqs: [], // Array of { question: '', answer: '' }
};

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Availability management (admin)
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [availabilityTour, setAvailabilityTour] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [availabilityRows, setAvailabilityRows] = useState([]); // [{date, times:[]}]
  const [selectedDate, setSelectedDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const dateRange = useMemo(() => {
    // Use local date instead of UTC ISO to avoid off-by-one issues
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 3);

    const toLocalYMD = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return { start: toLocalYMD(start), end: toLocalYMD(end) };
  }, []);

  const allDatesInRange = useMemo(() => {
    const dates = [];
    const startDate = new Date(dateRange.start + 'T00:00:00');
    const endDate = new Date(dateRange.end + 'T00:00:00');

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().slice(0, 10));
    }

    return dates;
  }, [dateRange]);

  const availabilityMap = useMemo(() => {
    const map = {};
    availabilityRows.forEach((r) => {
      map[r.date] = Array.isArray(r.times) ? r.times : [];
    });
    return map;
  }, [availabilityRows]);

  const openAvailability = async (tour) => {
    setAvailabilityTour(tour);
    setAvailabilityOpen(true);
    setAvailabilityError(null);
    setAvailabilityRows([]);
    setSelectedDate('');
    setNewTime('');
    try {
      setAvailabilityLoading(true);
      const res = await getTourAvailabilityAdmin(tour._id, dateRange.start, dateRange.end);
      const rows = res.data?.availability ?? [];
      setAvailabilityRows(rows);
      setSelectedDate(rows[0]?.date || dateRange.start);
    } catch (err) {
      if (err instanceof AuthenticationError || err.isAuthError) return;
      setAvailabilityError(err.message || 'Failed to load availability.');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const closeAvailability = () => {
    setAvailabilityOpen(false);
    setAvailabilityTour(null);
    setAvailabilityError(null);
    setAvailabilityRows([]);
    setSelectedDate('');
    setNewTime('');
  };

  const saveTimesForSelectedDate = async (times) => {
    if (!availabilityTour?._id || !selectedDate) return;
    try {
      setAvailabilityError(null);
      await setTourAvailabilityTimesAdmin(availabilityTour._id, selectedDate, times);
      setAvailabilityRows((prev) =>
        prev.map((r) => (r.date === selectedDate ? { ...r, times } : r))
      );
    } catch (err) {
      if (err instanceof AuthenticationError || err.isAuthError) return;
      setAvailabilityError(err.message || 'Failed to save times.');
    }
  };

  const handleAddTime = async () => {
    const t = (newTime || '').trim();
    if (!/^\d{2}:\d{2}$/.test(t) || !selectedDate) return;
    const current = availabilityMap[selectedDate] || [];
    const next = Array.from(new Set([...current, t])).sort();
    setNewTime('');
    await saveTimesForSelectedDate(next);
  };

  const handleDeleteTime = async (t) => {
    if (!selectedDate) return;
    const current = availabilityMap[selectedDate] || [];
    const next = current.filter((x) => x !== t);
    await saveTimesForSelectedDate(next);
  };

  const handleClearDate = async (date) => {
    if (!date) return;
    if (!window.confirm(`Are you sure you want to clear all times for ${date}?`)) return;
    try {
      setAvailabilityError(null);
      await setTourAvailabilityTimesAdmin(availabilityTour._id, date, []);
      setAvailabilityRows((prev) =>
        prev.map((r) => (r.date === date ? { ...r, times: [] } : r))
      );
      if (selectedDate === date) {
        // Optionally clear selected date or just leave it
      }
    } catch (err) {
      if (err instanceof AuthenticationError || err.isAuthError) return;
      setAvailabilityError(err.message || 'Failed to clear date.');
    }
  };

  const activeDates = useMemo(() => {
    return Object.entries(availabilityMap)
      .filter(([_, times]) => times && times.length > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [availabilityMap]);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTours();
      setTours(data.data?.tours ?? []);
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to load tours.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (tour) => {
    const allowed = Array.isArray(tour.allowedBookingTypes) && tour.allowedBookingTypes.length
      ? tour.allowedBookingTypes
      : ['group', 'private'];
    setFormData({
      name: tour.name || '',
      price: tour.price?.toString() || '',
      duration: tour.duration?.toString() || '',
      difficulty: tour.difficulty || 'easy',
      maxGroupSize: tour.maxGroupSize?.toString() || '',
      summary: tour.summary || '',
      shortDescription: tour.shortDescription || '',
      imageCover: tour.imageCover || '',
      images: Array.isArray(tour.images) ? tour.images : [],
      tags: Array.isArray(tour.tags) ? tour.tags.join(', ') : '',
      category: tour.category || '',
      dayType: tour.dayType || 'full-day',
      locationName: tour.location?.name || '',
      googleMapLink: tour.location?.googleMapLink || '',
      allowedBookingTypes: allowed,
      faqs: Array.isArray(tour.faqs) ? tour.faqs : [],
    });
    setEditingId(tour._id);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const allowed = Array.isArray(formData.allowedBookingTypes) && formData.allowedBookingTypes.length
        ? formData.allowedBookingTypes
        : ['group', 'private'];
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        duration: Number(formData.duration),
        difficulty: formData.difficulty,
        maxGroupSize: Number(formData.maxGroupSize),
        summary: formData.summary.trim(),
        shortDescription: formData.shortDescription.trim(),
        imageCover: formData.imageCover.trim() || undefined,
        images: Array.isArray(formData.images) ? formData.images.filter(img => img.trim()) : [],
        tags: (formData.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        category: formData.category.trim(),
        dayType: formData.dayType,
        location: {
          name: formData.locationName.trim(),
          googleMapLink: formData.googleMapLink.trim(),
        },
        allowedBookingTypes: allowed,
        faqs: Array.isArray(formData.faqs)
          ? formData.faqs.filter(f => f.question.trim() && f.answer.trim())
          : [],
      };

      if (editingId) {
        await updateTour(editingId, payload);
      } else {
        await createTour(payload);
      }

      handleCloseForm();
      await fetchTours();
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to save tour.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (tour) => {
    setTourToDelete(tour);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tourToDelete) return;
    try {
      setDeleting(true);
      setError(null);
      await deleteTour(tourToDelete._id);
      setDeleteModalOpen(false);
      setTourToDelete(null);
      await fetchTours();
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to delete tour.');
    } finally {
      setDeleting(false);
    }
  };

  const isInitialLoad = loading && tours.length === 0;

  if (isInitialLoad) {
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
          Tours Management
        </h1>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100  border border-red-400  text-red-700  px-4 py-3 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-2">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 ">
          Tours Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tours by name, summary, or tags..."
            className="w-full sm:w-80 px-4 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button onClick={handleOpenCreate}>Add New Tour</Button>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white  rounded-xl shadow overflow-hidden border border-gray-200 ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 ">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Day Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Difficulty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Max Group
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Tags
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600  uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500 ">
                    No tours yet. Click "Add New Tour" to create one.
                  </td>
                </tr>
              ) : (
                tours
                  .filter((tour) => {
                    const q = searchQuery.trim().toLowerCase();
                    if (!q) return true;
                    const tags = Array.isArray(tour.tags) ? tour.tags.join(' ') : '';
                    return (
                      (tour.name || '').toLowerCase().includes(q) ||
                      (tour.summary || '').toLowerCase().includes(q) ||
                      tags.toLowerCase().includes(q)
                    );
                  })
                  .map((tour) => (
                    <tr key={tour._id} className="hover:bg-gray-50 ">
                      <td className="px-4 py-3 text-sm text-gray-800  font-medium">
                        {tour.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 ">
                        ₹{tour.price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 ">
                        {tour.duration} {tour.duration === 1 ? 'hour' : 'hours'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                        {tour.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                        {tour.dayType?.replace('-', ' ')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full capitalize ${tour.difficulty === 'easy'
                            ? 'bg-green-100  text-green-800 '
                            : tour.difficulty === 'medium'
                              ? 'bg-amber-100  text-amber-800 '
                              : 'bg-red-100  text-red-800 '
                            }`}
                        >
                          {tour.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 ">
                        {tour.maxGroupSize}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 ">
                        {Array.isArray(tour.tags) && tour.tags.length > 0 ? tour.tags.join(', ') : '—'}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openAvailability(tour)}>
                          Availability
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(tour)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleOpenDelete(tour)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 " onClick={handleCloseForm} />
          <div className="relative bg-white  rounded-xl shadow-xl max-w-lg w-full p-6 border border-gray-200  max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800  mb-4">
              {editingId ? 'Edit Tour' : 'Add New Tour'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Difficulty *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-base sm:text-sm cursor-pointer appearance-none bg-white "
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Luxury, Premium"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Day Type *
                  </label>
                  <select
                    name="dayType"
                    value={formData.dayType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-base sm:text-sm cursor-pointer appearance-none bg-white "
                  >
                    <option value="half-day">Half Day</option>
                    <option value="full-day">Full Day</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Max Group Size *
                  </label>
                  <input
                    type="number"
                    name="maxGroupSize"
                    value={formData.maxGroupSize}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Google Map Link *
                  </label>
                  <input
                    type="url"
                    name="googleMapLink"
                    value={formData.googleMapLink}
                    onChange={handleInputChange}
                    required
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Summary *
                </label>
                <p className="text-xs text-gray-500  mb-2">
                  Use <strong>**bold**</strong> for emphasis. Start a line with <code className="px-1 py-0.5 bg-gray-100 rounded">-</code> or <code className="px-1 py-0.5 bg-gray-100 rounded">*</code> for bullet points. Example:
                </p>
                <pre className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2 mb-2 overflow-x-auto">
                  {`**Highlight this.** Normal text.

- First bullet
- Second bullet
* Another point`}
                </pre>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Describe the tour. Use **bold** and - or * for bullets."
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent   resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Short Description (for Cards) *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  This text will appear on the tour cards (Home/Experiences pages). Keep it concise (max 160 characters).
                </p>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  maxLength={160}
                  placeholder="A brief, catchy summary for the tour card."
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent   resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  name="imageCover"
                  value={formData.imageCover}
                  onChange={handleInputChange}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Gallery Images
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, images: [...(prev.images || []), ''] }))}
                  >
                    + Add Image URL
                  </Button>
                </div>
                {(!formData.images || formData.images.length === 0) && (
                  <p className="text-sm text-gray-500 italic mb-2">No gallery images added yet.</p>
                )}
                <div className="space-y-2">
                  {(formData.images || []).map((img, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://ik.imagekit.io/..."
                        value={img}
                        onChange={(e) => {
                          const next = [...formData.images];
                          next[index] = e.target.value;
                          setFormData(prev => ({ ...prev, images: next }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...formData.images];
                          next.splice(index, 1);
                          setFormData(prev => ({ ...prev, images: next }));
                        }}
                        className="text-gray-400 hover:text-red-500 px-2"
                        title="Remove Image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Booking types
                </label>
                <p className="text-xs text-gray-500  mb-2">Choose which booking types are available for this tour on the website.</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Array.isArray(formData.allowedBookingTypes) && formData.allowedBookingTypes.includes('group')}
                      onChange={(e) => {
                        const arr = Array.isArray(formData.allowedBookingTypes) ? [...formData.allowedBookingTypes] : ['group', 'private'];
                        if (e.target.checked) {
                          if (!arr.includes('group')) arr.push('group');
                        } else {
                          const next = arr.filter((t) => t !== 'group');
                          setFormData((prev) => ({ ...prev, allowedBookingTypes: next.length ? next : ['private'] }));
                          return;
                        }
                        setFormData((prev) => ({ ...prev, allowedBookingTypes: arr }));
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Group</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Array.isArray(formData.allowedBookingTypes) && formData.allowedBookingTypes.includes('private')}
                      onChange={(e) => {
                        const arr = Array.isArray(formData.allowedBookingTypes) ? [...formData.allowedBookingTypes] : ['group', 'private'];
                        if (e.target.checked) {
                          if (!arr.includes('private')) arr.push('private');
                        } else {
                          const next = arr.filter((t) => t !== 'private');
                          setFormData((prev) => ({ ...prev, allowedBookingTypes: next.length ? next : ['group'] }));
                          return;
                        }
                        setFormData((prev) => ({ ...prev, allowedBookingTypes: arr }));
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Private</span>
                  </label>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    FAQs
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, faqs: [...(prev.faqs || []), { question: '', answer: '' }] }))}
                  >
                    + Add Question
                  </Button>
                </div>
                {(!formData.faqs || formData.faqs.length === 0) && (
                  <p className="text-sm text-gray-500 italic mb-2">No FAQs added yet.</p>
                )}
                <div className="space-y-4">
                  {(formData.faqs || []).map((faq, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...formData.faqs];
                          next.splice(index, 1);
                          setFormData(prev => ({ ...prev, faqs: next }));
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        title="Remove FAQ"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <div className="mb-2 pr-6">
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) => {
                            const next = [...formData.faqs];
                            next[index] = { ...next[index], question: e.target.value };
                            setFormData(prev => ({ ...prev, faqs: next }));
                          }}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Answer"
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const next = [...formData.faqs];
                            next[index] = { ...next[index], answer: e.target.value };
                            setFormData(prev => ({ ...prev, faqs: next }));
                          }}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. heritage, food, sunset"
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="secondary" onClick={handleCloseForm} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Tour' : 'Create Tour'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Tour?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTourToDelete(null);
        }}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        confirmVariant="danger"
        confirmDisabled={deleting}
      >
        <p>
          Are you sure you want to delete <strong>{tourToDelete?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>

      {/* Availability Modal */}
      <Modal
        isOpen={availabilityOpen}
        title={availabilityTour ? `Availability — ${availabilityTour.name}` : 'Availability'}
        onCancel={closeAvailability}
        cancelLabel="Close"
        confirmLabel={null}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage available time slots for the next 3 months. You can add/remove times anytime.
          </p>

          {availabilityError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {availabilityError}
            </div>
          )}

          {availabilityLoading ? (
            <div className="py-6">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {allDatesInRange.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Range: {dateRange.start} → {dateRange.end}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add time (HH:mm)</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button type="button" onClick={handleAddTime}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Times for {selectedDate || '—'}</h3>
                  <span className="text-xs text-gray-500">
                    {selectedDate ? (availabilityMap[selectedDate]?.length ?? 0) : 0} time(s)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(availabilityMap[selectedDate] || []).length === 0 ? (
                    <span className="text-sm text-gray-500">No times yet. Add one above.</span>
                  ) : (
                    (availabilityMap[selectedDate] || []).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => handleDeleteTime(t)}
                          className="text-blue-700 hover:text-blue-900 font-bold"
                          aria-label={`Remove ${t}`}
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* Active Dates List */}
          {!availabilityLoading && activeDates.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Scheduled Dates ({activeDates.length})</h3>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {activeDates.map(([date, times]) => (
                  <div key={date} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${selectedDate === date ? 'text-blue-600' : 'text-gray-700'}`}>
                          {date}
                        </span>
                        <span className="text-xs text-gray-500">
                          {times.length} slot{times.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                        {times.join(', ')}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClearDate(date)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                      title="Clear all times for this date"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Tours;
