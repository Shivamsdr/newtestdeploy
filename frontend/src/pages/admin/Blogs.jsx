import { useState, useEffect, useCallback } from 'react';
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  AuthenticationError,
} from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const emptyForm = {
  title: '',
  category: 'blog',
  excerpt: '',
  content: '',
  coverImage: '',
  isPublished: true,
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
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
      const data = await getBlogs(false);
      setBlogs(data.data?.blogs ?? []);
    } catch (err) {
      if (err instanceof AuthenticationError || err.isAuthError) return;
      setError(err.message || 'Failed to load blogs.');
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
      title: item.title || '',
      category: item.category || 'blog',
      excerpt: item.excerpt || '',
      content: item.content || '',
      coverImage: item.coverImage || '',
      isPublished: item.isPublished ?? true,
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
        category: formData.category,
        excerpt: formData.excerpt.trim() || undefined,
        content: formData.content.trim(),
        coverImage: formData.coverImage.trim() || undefined,
        isPublished: formData.isPublished,
      };
      if (editingId) {
        await updateBlog(editingId, payload);
      } else {
        await createBlog(payload);
      }
      handleCloseForm();
      await fetchData();
    } catch (err) {
      if (err instanceof AuthenticationError || err.isAuthError) return;
      setError(err.message || 'Failed to save blog.');
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
      await deleteBlog(itemToDelete._id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await fetchData();
    } catch (err) {
      if (err instanceof AuthenticationError || err.isAuthError) return;
      setError(err.message || 'Failed to delete blog.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Explore Goa – Blogs</h1>
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
        <h1 className="text-3xl font-bold text-gray-800">Explore Goa – Blogs</h1>
        <Button onClick={handleOpenCreate}>Add New Post</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            No blog posts yet. Click &quot;Add New Post&quot; to create one.
          </div>
        ) : (
          blogs.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-xl shadow border p-5 ${item.isPublished ? 'border-gray-200' : 'border-gray-300 opacity-60'
                }`}
            >
              {item.coverImage && (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-800 truncate flex-1">{item.title}</h3>
                <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.category === 'achievement' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {item.category || 'blog'}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.excerpt || item.content?.slice(0, 80) + '…'}</p>
              <span className={`inline-flex mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${item.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {item.isPublished ? 'Published' : 'Draft'}
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
              {editingId ? 'Edit Blog Post' : 'Add New Blog Post'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent bg-white"
                >
                  <option value="blog">Blog</option>
                  <option value="achievement">Achievement/Award</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (short summary)</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover image URL</label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#F5B400] border-gray-300 rounded focus:ring-[#F5B400]"
                />
                <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">Published (visible on Explore Goa)</label>
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
        title="Delete blog post?"
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

export default Blogs;
