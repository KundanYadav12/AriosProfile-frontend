import React, { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckCircle2, RefreshCw, MessageSquare, Loader2 } from 'lucide-react';
import { adminAPI } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminEnquiries() {
  const toast = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEnquiries();
  }, [filter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getEnquiries(filter);
      if (res.data?.success) {
        setEnquiries(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await adminAPI.updateEnquiryStatus(id, newStatus);
      if (res.data?.success) {
        toast.success(`Marked as ${newStatus}`);
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    try {
      const res = await adminAPI.deleteEnquiry(id);
      if (res.data?.success) {
        toast.success('Enquiry deleted.');
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete enquiry.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Enquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Inbound leads, partnerships, and product quote requests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
          {['all', 'unread', 'read', 'replied'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-ariso-600" />
        </div>
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className={`p-6 rounded-2xl bg-white border transition-all duration-200 flex flex-col md:flex-row md:items-start justify-between gap-6 shadow-sm ${
                enq.status === 'unread' ? 'border-ariso-300 bg-ariso-50/20' : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-950 text-base">{enq.name}</h3>
                  {enq.company && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {enq.company}
                    </span>
                  )}
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      enq.status === 'unread'
                        ? 'bg-emerald-100 text-emerald-800'
                        : enq.status === 'replied'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 text-ariso-600 hover:underline">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{enq.email}</span>
                  </a>
                  {enq.phone && (
                    <a
                      href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-emerald-600 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{enq.phone}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(enq.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-800 leading-relaxed mt-2 whitespace-pre-wrap">
                  {enq.message}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start flex-shrink-0">
                {enq.status === 'unread' && (
                  <button
                    onClick={() => handleStatusChange(enq.id, 'read')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Mark Read
                  </button>
                )}
                {enq.status !== 'replied' && (
                  <button
                    onClick={() => handleStatusChange(enq.id, 'replied')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold"
                  >
                    Mark Replied
                  </button>
                )}
                <button
                  onClick={() => handleDelete(enq.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete Enquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          No enquiries matching this filter.
        </div>
      )}
    </div>
  );
}
