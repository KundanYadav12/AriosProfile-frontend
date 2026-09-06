import React, { useEffect, useState } from 'react';
import { 
  Package, Plus, Edit, Trash2, ExternalLink, Play, 
  Check, X, Eye, EyeOff, ArrowUpRight, Upload, Loader2, Save 
} from 'lucide-react';
import { adminAPI } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useSiteData } from '../../context/SiteDataContext';

export default function AdminProducts() {
  const toast = useToast();
  const { refreshData } = useSiteData();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initialFormState = {
    name: '',
    slug: '',
    category: 'Software Solution',
    short_description: '',
    long_description: '',
    icon: '',
    logo: '',
    hero_image: '',
    demo_video: '',
    video_thumbnail: '',
    external_url: 'https://',
    cta_text: 'Explore Product',
    display_order: 0,
    is_active: 1
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await adminAPI.getProducts();
      if (res.data?.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || '',
      short_description: product.short_description || '',
      long_description: product.long_description || '',
      icon: product.icon || '',
      logo: product.logo || '',
      hero_image: product.hero_image || '',
      demo_video: product.demo_video || '',
      video_thumbnail: product.video_thumbnail || '',
      external_url: product.external_url || '',
      cta_text: product.cta_text || 'Explore Product',
      display_order: product.display_order || 0,
      is_active: product.is_active ? 1 : 0
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploading(true);
    try {
      const res = await adminAPI.uploadMedia(data);
      if (res.data?.success) {
        setFormData((prev) => ({ ...prev, [field]: res.data.data.url }));
        toast.success(`Uploaded ${file.name}`);
      }
    } catch (err) {
      toast.error('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const res = await adminAPI.updateProduct(editingId, formData);
        if (res.data?.success) {
          toast.success('Product updated successfully!');
        }
      } else {
        const res = await adminAPI.createProduct(formData);
        if (res.data?.success) {
          toast.success('New product added successfully!');
        }
      }

      setModalOpen(false);
      fetchProducts();
      refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;

    try {
      const res = await adminAPI.deleteProduct(id);
      if (res.data?.success) {
        toast.success(`Deleted ${name}`);
        fetchProducts();
        refreshData();
      }
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Portfolio Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage Ariso POS, Ariso Retail, EventPass, and add new products seamlessly.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md shadow-ariso-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table/Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {products.map((p) => (
            <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-ariso-50 text-ariso-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      {p.category}
                    </span>
                    {p.is_active ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xl">
                    {p.short_description || p.long_description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
                    <a
                      href={p.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ariso-600 hover:underline flex items-center gap-1"
                    >
                      <span>{p.external_url}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <span>Order: {p.display_order}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-2.5 rounded-xl text-slate-600 hover:text-ariso-600 hover:bg-ariso-50 transition-colors"
                  title="Edit Product"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? `Edit Product: ${formData.name}` : 'Add New Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name,
                        slug: editingId ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      }));
                    }}
                    placeholder="e.g. Ariso POS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Slug / URL Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. ariso-pos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Restaurant Management"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order (Sorting)
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  External Destination URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.external_url}
                  onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                  placeholder="https://restrocaptain.online/"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="Explore Ariso POS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Publish Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none"
                  >
                    <option value={1}>Published (Visible on site)</option>
                    <option value={0}>Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Long Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none resize-none"
                />
              </div>

              {/* Media Attachments */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Media Attachments
                </span>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">Hero Image / Screenshot</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.hero_image}
                      onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                      placeholder="/uploads/pos-hero.png or https://..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono outline-none"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'hero_image')}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">Demo Video URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.demo_video}
                      onChange={(e) => setFormData({ ...formData, demo_video: e.target.value })}
                      placeholder="/uploads/demo.mp4 or video URL"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono outline-none"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'demo_video')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingId ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
