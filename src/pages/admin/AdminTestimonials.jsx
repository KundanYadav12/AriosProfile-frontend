import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Star, Check, X, Loader2, Save } from 'lucide-react';
import { adminAPI } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useSiteData } from '../../context/SiteDataContext';

export default function AdminTestimonials() {
  const toast = useToast();
  const { refreshData } = useSiteData();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: '',
    company: '',
    designation: '',
    avatar: '',
    content: '',
    rating: 5,
    display_order: 0,
    is_active: 1
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await adminAPI.getTestimonials();
      if (res.data?.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      company: t.company || '',
      designation: t.designation || '',
      avatar: t.avatar || '',
      content: t.content,
      rating: t.rating || 5,
      display_order: t.display_order || 0,
      is_active: t.is_active ? 1 : 0
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminAPI.updateTestimonial(editingId, formData);
        toast.success('Testimonial updated.');
      } else {
        await adminAPI.createTestimonial(formData);
        toast.success('Testimonial added.');
      }
      setModalOpen(false);
      fetchTestimonials();
      refreshData();
    } catch (err) {
      toast.error('Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from ${name}?`)) return;
    try {
      await adminAPI.deleteTestimonial(id);
      toast.success('Testimonial removed.');
      fetchTestimonials();
      refreshData();
    } catch (err) {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Client Reviews & Testimonials
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish authentic stories and reviews from businesses using Ariso POS, Retail, and EventPass.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-ariso-600" />
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.is_active ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500">
                    {t.designation} {t.company ? `• ${t.company}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-2 rounded-lg text-slate-600 hover:text-ariso-600 hover:bg-ariso-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
          No testimonials added yet. Once added, they will appear dynamically in the homepage carousel.
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 z-10 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rating (1 to 5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Testimonial Review *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white text-sm font-bold shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
