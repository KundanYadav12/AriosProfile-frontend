import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Mail, Image, MessageSquare, ArrowUpRight, 
  CheckCircle2, Clock, Eye, Settings, ShieldCheck, Sparkles 
} from 'lucide-react';
import { adminAPI } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalEnquiries: 0,
    unreadEnquiries: 0,
    totalMedia: 0,
    activeTestimonials: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    Promise.allSettled([
      adminAPI.getStats(),
      adminAPI.getEnquiries('all')
    ]).then(([statsRes, enquiriesRes]) => {
      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        setStats(statsRes.value.data.data);
      }
      if (enquiriesRes.status === 'fulfilled' && enquiriesRes.value.data?.success) {
        setRecentEnquiries(enquiriesRes.value.data.data.slice(0, 5));
      }
      setLoading(false);
    });
  }, []);

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      subtext: `${stats.activeProducts} active on site`,
      icon: Package,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      link: '/superadmin/products'
    },
    {
      label: 'Unread Enquiries',
      value: stats.unreadEnquiries,
      subtext: `${stats.totalEnquiries} total received`,
      icon: Mail,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      link: '/superadmin/enquiries'
    },
    {
      label: 'Media Assets',
      value: stats.totalMedia,
      subtext: 'Uploaded images & videos',
      icon: Image,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      link: '/superadmin/media'
    },
    {
      label: 'Active Reviews',
      value: stats.activeTestimonials,
      subtext: 'Published customer stories',
      icon: MessageSquare,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      link: '/superadmin/testimonials'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time management for ARISO official digital ecosystem
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/superadmin/settings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white text-xs font-semibold shadow-md shadow-ariso-600/20 transition-all"
          >
            <span>Preview Website</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-ariso-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-950 block mb-1">
                  {card.value}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {card.subtext}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recent Enquiries */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Customer Enquiries</h2>
              <p className="text-xs text-slate-500">Latest submissions from website forms</p>
            </div>
            <Link
              to="/superadmin/enquiries"
              className="text-xs font-semibold text-ariso-600 hover:text-ariso-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 truncate">{enq.name}</span>
                      {enq.status === 'unread' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{enq.email} {enq.phone ? `• ${enq.phone}` : ''}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">"{enq.message}"</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              No customer enquiries received yet.
            </div>
          )}
        </div>

        {/* Right: Quick Product Links & Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Live Product Targets</h2>
            <p className="text-xs text-slate-500 mb-6">Current external destinations</p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Ariso POS</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
                <a
                  href="https://restrocaptain.online/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-ariso-600 font-mono truncate block hover:underline"
                >
                  restrocaptain.online
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Ariso Retail</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
                <a
                  href="https://arisoretail.duckdns.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-ariso-600 font-mono truncate block hover:underline"
                >
                  arisoretail.duckdns.org
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">EventPass</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
                <a
                  href="https://eventgen.duckdns.org/login"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-ariso-600 font-mono truncate block hover:underline"
                >
                  eventgen.duckdns.org/login
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Database Synced
            </span>
            <Link to="/superadmin/products" className="font-semibold text-ariso-600 hover:text-ariso-700">
              Manage Products →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
