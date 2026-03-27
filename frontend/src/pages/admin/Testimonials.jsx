import { useState, useEffect, useCallback } from 'react';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  AuthenticationError,
} from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const emptyForm = {
  name: '',
  message: '',
  image: '',
  rating: '5',
  isActive: true,
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestimonials();
      setTestimonials(data.data?.testimonials ?? []);
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOpenCreate = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      name: item.name || '',
      message: item.message || '',
      image: item.image || '',
      rating: item.rating?.toString() || '5',
      isActive: item.isActive ?? true,
    });
    setEditingId(item._id);
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

      const payload = {
        name: formData.name.trim(),
        message: formData.message.trim(),
        image: formData.image.trim() || undefined,
        rating: Number(formData.rating),
        isActive: formData.isActive,
      };

      if (editingId) {
        await updateTestimonial(editingId, payload);
      } else {
        await createTestimonial(payload);
      }

      handleCloseForm();
      await fetchData();
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to save testimonial.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      setError(null);
      await deleteTestimonial(itemToDelete._id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await fetchData();
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to delete testimonial.');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      setError(null);
      await updateTestimonial(item._id, { isActive: !item.isActive });
      await fetchData();
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to update testimonial.');
    }
  };

  const isInitialLoad = loading && testimonials.length === 0;

  if (isInitialLoad) {
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
          Testimonials
        </h1>
        <Loader />
      </div>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300 '}>
        ★
      </span>
    ));
  };

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
          Testimonials
        </h1>
        <Button onClick={handleOpenCreate}>Add New Testimonial</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500  bg-white  rounded-xl border border-gray-200 ">
            No testimonials yet. Click "Add New Testimonial" to create one.
          </div>
        ) : (
          testimonials.map((item) => (
            <div
              key={item._id}
              className={`bg-white  rounded-xl shadow border p-5 ${
                item.isActive
                  ? 'border-gray-200 '
                  : 'border-gray-300  opacity-60'
              }`}
            >
              <div className="flex items-start gap-4 mb-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100  flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600  font-semibold text-lg">
                      {item.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800  truncate">
                    {item.name}
                  </h3>
                  <div className="text-sm">{renderStars(item.rating)}</div>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    item.isActive
                      ? 'bg-green-100  text-green-800 '
                      : 'bg-gray-100  text-gray-600 '
                  }`}
                >
                  {item.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="text-sm text-gray-600  mb-4 line-clamp-3">
                "{item.message}"
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => handleToggleActive(item)}>
                  {item.isActive ? 'Hide' : 'Show'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleOpenDelete(item)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 " onClick={handleCloseForm} />
          <div className="relative bg-white  rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200  max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800  mb-4">
              {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Customer Name *
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
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent   resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Rating *
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-base sm:text-sm cursor-pointer appearance-none bg-white "
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 ">
                  Show on website
                </label>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="secondary" onClick={handleCloseForm} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Testimonial?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        confirmVariant="danger"
        confirmDisabled={deleting}
      >
        <p>
          Are you sure you want to delete the testimonial from <strong>{itemToDelete?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default Testimonials;
