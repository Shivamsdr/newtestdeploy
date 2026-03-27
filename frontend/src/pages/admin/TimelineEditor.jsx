import { useState, useEffect, useCallback } from 'react';
import {
  getTours,
  getTimelineStepsByTour,
  createTimelineStep,
  updateTimelineStep,
  deleteTimelineStep,
  AuthenticationError,
} from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const emptyForm = {
  title: '',
  description: '',
  duration: '',
  order: '',
  image: '',
};

const TimelineEditor = () => {
  const [tours, setTours] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const fetchSteps = useCallback(async (tourId) => {
    if (!tourId) {
      setSteps([]);
      return;
    }
    try {
      setStepsLoading(true);
      setError(null);
      const data = await getTimelineStepsByTour(tourId);
      setSteps(data.data?.steps ?? []);
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to load timeline steps.');
    } finally {
      setStepsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  useEffect(() => {
    fetchSteps(selectedTourId);
  }, [selectedTourId, fetchSteps]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    const nextOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.order)) + 1 : 1;
    setFormData({ ...emptyForm, order: nextOrder.toString() });
    setEditingId(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      duration: item.duration || '',
      order: item.order?.toString() || '',
      image: item.image || '',
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
    if (!selectedTourId) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        tour: selectedTourId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        duration: formData.duration.trim() || undefined,
        order: Number(formData.order),
        image: formData.image.trim() || undefined,
      };

      if (editingId) {
        await updateTimelineStep(editingId, payload);
      } else {
        await createTimelineStep(payload);
      }

      handleCloseForm();
      await fetchSteps(selectedTourId);
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to save timeline step.');
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
      await deleteTimelineStep(itemToDelete._id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await fetchSteps(selectedTourId);
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to delete timeline step.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
          Timeline Editor
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
          Timeline Editor
        </h1>
      </div>

      {/* Tour Selector */}
      <div className="bg-white  rounded-xl shadow border border-gray-200  p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700  mb-2">
          Select a Tour to Edit Timeline
        </label>
        <div className="relative w-full max-w-md">
          <select
            value={selectedTourId}
            onChange={(e) => setSelectedTourId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-sm cursor-pointer appearance-none bg-white  shadow-sm"
          >
            <option value="">-- Select a tour --</option>
            {tours.map((tour) => (
              <option key={tour._id} value={tour._id}>
                {tour.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-4 w-4 text-gray-500 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {tours.length === 0 && (
        <div className="bg-amber-100  border border-amber-400  text-amber-700  px-4 py-3 rounded-lg">
          Please create tours first before editing timelines.
        </div>
      )}

      {/* Timeline Steps */}
      {selectedTourId && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 ">
              Timeline Steps
            </h2>
            <Button onClick={handleOpenCreate}>Add Step</Button>
          </div>

          {stepsLoading ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {steps.length === 0 ? (
                <div className="bg-white  rounded-xl border border-gray-200  p-8 text-center text-gray-500 ">
                  No timeline steps yet. Click &quot;Add Step&quot; to create the first step.
                </div>
              ) : (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 " aria-hidden="true" />

                  {steps.map((step) => (
                    <div key={step._id} className="relative flex gap-4 pb-6">
                      {/* Step number circle - flex child */}
                      <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        {step.order}
                      </div>

                      {/* Step content card */}
                      <div className="flex-1 bg-white  rounded-xl border border-gray-200  p-4 shadow-sm min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800 ">
                              {step.title}
                            </h3>
                            {step.duration && (
                              <span className="text-sm text-blue-600 ">
                                {step.duration}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(step)}>
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleOpenDelete(step)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                        {step.description && (
                          <p className="text-sm text-gray-600 ">
                            {step.description}
                          </p>
                        )}
                        {step.image && (
                          <img
                            src={step.image}
                            alt={step.title}
                            className="mt-3 w-full max-w-xs h-32 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 " onClick={handleCloseForm} aria-hidden="true" />
          <div className="relative bg-white  rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200  max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800  mb-4">
              {editingId ? 'Edit Timeline Step' : 'Add New Step'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Arrival at Fort Aguada"
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description of this stop..."
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent   resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 30 mins"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Order *
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  "
                  />
                </div>
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
        title="Delete Timeline Step?"
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
          Are you sure you want to delete <strong>{itemToDelete?.title}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default TimelineEditor;
