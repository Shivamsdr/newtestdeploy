import { useState, useEffect, useCallback } from 'react';
import {
    getCorporateCards,
    createCorporateCard,
    updateCorporateCard,
    deleteCorporateCard,
    getSettings,
    updateSettings,
    AuthenticationError,
} from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const emptyForm = {
    title: '',
    description: '',
    image: '',
    isActive: true,
};

const CorporateCards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [settings, setSettings] = useState(null);
    const [updatingSettings, setUpdatingSettings] = useState(false);
    const [settingsSuccess, setSettingsSuccess] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [cardsData, settingsData] = await Promise.all([
                getCorporateCards(false),
                getSettings()
            ]);
            setCards(cardsData.data?.corporateCards ?? []);
            setSettings(settingsData.data?.settings ?? null);
        } catch (err) {
            if (err instanceof AuthenticationError || err.isAuthError) return;
            setError(err.message || 'Failed to load corporate cards.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFieldChange = (field, value) => {
        setSettings((prev) => ({
            ...(prev || {}),
            [field]: value,
        }));
    };

    const handleAddFaq = () => {
        const currentFaqs = settings?.corporateFaqs || [];
        handleFieldChange('corporateFaqs', [...currentFaqs, { q: '', a: '' }]);
    };

    const handleRemoveFaq = (index) => {
        const currentFaqs = settings?.corporateFaqs || [];
        handleFieldChange('corporateFaqs', currentFaqs.filter((_, i) => i !== index));
    };

    const handleFaqChange = (index, field, value) => {
        const currentFaqs = [...(settings?.corporateFaqs || [])];
        currentFaqs[index] = { ...currentFaqs[index], [field]: value };
        handleFieldChange('corporateFaqs', currentFaqs);
    };

    const handleAddHeaderImage = () => {
        const currentImages = settings?.corporateHeaderImages || [];
        handleFieldChange('corporateHeaderImages', [...currentImages, '']);
    };

    const handleRemoveHeaderImage = (index) => {
        const currentImages = settings?.corporateHeaderImages || [];
        handleFieldChange('corporateHeaderImages', currentImages.filter((_, i) => i !== index));
    };

    const handleHeaderImageChange = (index, value) => {
        const currentImages = [...(settings?.corporateHeaderImages || [])];
        currentImages[index] = value;
        handleFieldChange('corporateHeaderImages', currentImages);
    };

    const handleSaveCorporateSettings = async () => {
        if (!settings) return;

        try {
            setUpdatingSettings(true);
            setError(null);
            setSettingsSuccess(false);

            const payload = {
                corporateHeaderImages: settings.corporateHeaderImages,
                corporateFaqs: settings.corporateFaqs,
            };

            const data = await updateSettings(payload);
            setSettings(data.data?.settings);
            setSettingsSuccess(true);

            setTimeout(() => setSettingsSuccess(false), 3000);
        } catch (err) {
            if (err instanceof AuthenticationError || err.isAuthError) return;
            setError(err.message || 'Failed to update corporate settings.');
        } finally {
            setUpdatingSettings(false);
        }
    };

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
            title: item.title || '',
            description: item.description || '',
            image: item.image || '',
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
                title: formData.title.trim(),
                description: formData.description.trim(),
                image: formData.image.trim() || undefined,
                isActive: formData.isActive,
            };
            if (editingId) {
                await updateCorporateCard(editingId, payload);
            } else {
                await createCorporateCard(payload);
            }
            handleCloseForm();
            await fetchData();
        } catch (err) {
            if (err instanceof AuthenticationError || err.isAuthError) return;
            setError(err.message || 'Failed to save corporate card.');
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
            await deleteCorporateCard(itemToDelete._id);
            setDeleteModalOpen(false);
            setItemToDelete(null);
            await fetchData();
        } catch (err) {
            if (err instanceof AuthenticationError || err.isAuthError) return;
            setError(err.message || 'Failed to delete corporate card.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading && cards.length === 0) {
        return (
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Corporate Cards</h1>
                <Loader />
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-2">
                    <span>{error}</span>
                    <Button variant="outline" size="sm" onClick={() => setError(null)}>Dismiss</Button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Corporate Page Management</h1>
            </div>

            {settingsSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                    Corporate page settings updated successfully!
                </div>
            )}

            {/* Corporate Page Settings Section */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Corporate Page Header & FAQs
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                    Manage the header images (carousel) and frequently asked questions for the public Corporate Team Building page.
                </p>

                <div className="space-y-8">
                    {/* Header Images */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Header Images URLs
                            </label>
                            <button
                                onClick={handleAddHeaderImage}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                + Add Image
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(!settings?.corporateHeaderImages || settings.corporateHeaderImages.length === 0) && (
                                <p className="text-gray-500 text-sm italic">No images added. Click "+ Add Image" to add one.</p>
                            )}
                            {settings?.corporateHeaderImages?.map((url, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={url}
                                        onChange={(e) => handleHeaderImageChange(idx, e.target.value)}
                                        placeholder="https://images.unsplash.com/photo-..."
                                    />
                                    <button
                                        onClick={() => handleRemoveHeaderImage(idx)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                        title="Remove Image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQs */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Frequently Asked Questions
                            </label>
                            <button
                                onClick={handleAddFaq}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                + Add FAQ
                            </button>
                        </div>
                        <div className="space-y-4">
                            {(!settings?.corporateFaqs || settings.corporateFaqs.length === 0) && (
                                <p className="text-gray-500 text-sm italic">No FAQs added. Click "+ Add FAQ" to add one.</p>
                            )}
                            {settings?.corporateFaqs?.map((faq, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                                    <button
                                        onClick={() => handleRemoveFaq(idx)}
                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-white p-1.5 rounded-full shadow-sm"
                                        title="Remove FAQ"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                    <div className="space-y-3 pr-10">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Question {idx + 1}</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                                value={faq.q}
                                                onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                                                placeholder="e.g. What is the ideal group size?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Answer</label>
                                            <textarea
                                                rows={2}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={faq.a}
                                                onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                                                placeholder="Provide the answer here..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button onClick={handleSaveCorporateSettings} disabled={updatingSettings}>
                            {updatingSettings ? 'Saving...' : 'Save Corporate Settings'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Corporate Event Cards</h2>
                <Button onClick={handleOpenCreate}>Add New Card</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                        No corporate cards yet. Click &quot;Add New Card&quot; to create one.
                    </div>
                ) : (
                    cards.map((item) => (
                        <div
                            key={item._id}
                            className={`bg-white rounded-xl shadow border p-5 ${item.isActive ? 'border-gray-200' : 'border-gray-300 opacity-60'
                                }`}
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                />
                            )}
                            <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-3 mt-1">{item.description}</p>
                            <span className={`inline-flex mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <div className="flex gap-2 flex-wrap mt-4">
                                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleOpenDelete(item)}>Delete</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-black/50" onClick={handleCloseForm} />
                    <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingId ? 'Edit Corporate Card' : 'Add New Corporate Card'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent resize-y"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Image URL *</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[#F5B400] border-gray-300 rounded focus:ring-[#F5B400]"
                                />
                                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active (visible on public page)</label>
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <Button type="button" variant="secondary" onClick={handleCloseForm} disabled={submitting}>Cancel</Button>
                                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Modal
                isOpen={deleteModalOpen}
                title="Delete Corporate Card?"
                onConfirm={handleConfirmDelete}
                onCancel={() => { setDeleteModalOpen(false); setItemToDelete(null); }}
                confirmLabel={deleting ? 'Deleting...' : 'Delete'}
                cancelLabel="Cancel"
                confirmVariant="danger"
                confirmDisabled={deleting}
            >
                <p>Are you sure you want to delete <strong>{itemToDelete?.title}</strong>? This cannot be undone.</p>
            </Modal>
        </div>
    );
};

export default CorporateCards;
