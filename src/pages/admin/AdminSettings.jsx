import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, CheckCircle2, Globe, Phone, Mail, MapPin, Sparkles, Instagram, Loader2 } from 'lucide-react';
import { adminAPI, publicAPI } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useSiteData } from '../../context/SiteDataContext';

export default function AdminSettings() {
  const toast = useToast();
  const { refreshData } = useSiteData();

  const [settings, setSettings] = useState({
    company_name: '',
    company_tagline: '',
    company_description: '',
    general_email: '',
    enquiry_email: '',
    whatsapp_number: '',
    whatsapp_default_message: '',
    instagram_url: '',
    office_address: '',
    footer_developed_by: '',
    hero_eyebrow: '',
    hero_title: '',
    hero_subtitle: '',
    hero_cta_primary_text: '',
    hero_cta_primary_url: '',
    hero_cta_secondary_text: '',
    hero_cta_secondary_url: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await publicAPI.getSettings();
      if (res.data?.success) {
        setSettings((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      toast.error('Failed to load settings from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminAPI.updateSettings(settings);
      if (res.data?.success) {
        toast.success('Site configuration saved successfully!');
        refreshData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-ariso-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Website Content & Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Edit branding, contact information, social links, and hero copy across the public site.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md shadow-ariso-600/20 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. General Branding */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Globe className="w-5 h-5 text-ariso-600" />
            <h2 className="text-lg font-bold text-slate-900">General Company Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={settings.company_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Footer Tag / Developed By
              </label>
              <input
                type="text"
                name="footer_developed_by"
                value={settings.footer_developed_by}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Company Tagline
            </label>
            <input
              type="text"
              name="company_tagline"
              value={settings.company_tagline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Company Description
            </label>
            <textarea
              rows={3}
              name="company_description"
              value={settings.company_description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* 2. Hero Section Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Sparkles className="w-5 h-5 text-ariso-600" />
            <h2 className="text-lg font-bold text-slate-900">Hero Section Content</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Eyebrow Badge Text
            </label>
            <input
              type="text"
              name="hero_eyebrow"
              value={settings.hero_eyebrow}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Main Hero Heading
            </label>
            <input
              type="text"
              name="hero_title"
              value={settings.hero_title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hero Supporting Subtitle
            </label>
            <textarea
              rows={2}
              name="hero_subtitle"
              value={settings.hero_subtitle}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                name="hero_cta_primary_text"
                value={settings.hero_cta_primary_text}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Primary CTA Target URL / Anchor
              </label>
              <input
                type="text"
                name="hero_cta_primary_url"
                value={settings.hero_cta_primary_url}
                onChange={handleChange}
                placeholder="#products"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Secondary CTA Button Text
              </label>
              <input
                type="text"
                name="hero_cta_secondary_text"
                value={settings.hero_cta_secondary_text}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Secondary CTA Target URL / Anchor
              </label>
              <input
                type="text"
                name="hero_cta_secondary_url"
                value={settings.hero_cta_secondary_url}
                onChange={handleChange}
                placeholder="#contact"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* 3. Contact & Social Information */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Phone className="w-5 h-5 text-ariso-600" />
            <h2 className="text-lg font-bold text-slate-900">Contact & Social Channels</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                General Company Email
              </label>
              <input
                type="email"
                name="general_email"
                value={settings.general_email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Enquiry Recipient Email
              </label>
              <input
                type="email"
                name="enquiry_email"
                value={settings.enquiry_email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                WhatsApp Contact Number
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={settings.whatsapp_number}
                onChange={handleChange}
                placeholder="7506200067"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                WhatsApp Default Message
              </label>
              <input
                type="text"
                name="whatsapp_default_message"
                value={settings.whatsapp_default_message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Instagram Profile URL
            </label>
            <input
              type="url"
              name="instagram_url"
              value={settings.instagram_url}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Office Physical Address
            </label>
            <textarea
              rows={2}
              name="office_address"
              value={settings.office_address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 text-slate-900 text-sm outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-base shadow-lg shadow-ariso-600/20 transition-all flex items-center gap-2.5 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{saving ? 'Saving Configurations...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
