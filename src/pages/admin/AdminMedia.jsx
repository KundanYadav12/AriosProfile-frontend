import React, { useEffect, useState } from 'react';
import { Image, Upload, Trash2, Copy, Check, Film, File, Loader2 } from 'lucide-react';
import { adminAPI } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminMedia() {
  const toast = useToast();
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await adminAPI.getMedia();
      if (res.data?.success) {
        setMediaList(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load media.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);

      try {
        await adminAPI.uploadMedia(formData);
      } catch (err) {
        toast.error(`Failed to upload ${files[i].name}`);
      }
    }

    toast.success('Upload complete.');
    setUploading(false);
    fetchMedia();
  };

  const copyToClipboard = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    try {
      const res = await adminAPI.deleteMedia(id);
      if (res.data?.success) {
        toast.success('Media removed.');
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete media file.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Media Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Centralized repository for product screenshots, hero imagery, and demo video files.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md transition-all">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
          <input
            type="file"
            multiple
            accept="image/*,video/mp4,video/webm"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-ariso-600" />
        </div>
      ) : mediaList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {mediaList.map((item) => {
            const isVideo = item.mime_type?.startsWith('video');
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Preview Frame */}
                <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden relative">
                  {isVideo ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Film className="w-10 h-10 text-ariso-600" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Video</span>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => copyToClipboard(item.id, item.url)}
                      className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold shadow"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.filename)}
                      className="p-2 rounded-xl bg-white/90 hover:bg-rose-50 hover:text-rose-600 text-slate-900 text-xs font-semibold shadow"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Meta info */}
                <div className="p-3 border-t border-slate-100 text-left">
                  <p className="text-xs font-bold text-slate-900 truncate" title={item.original_name}>
                    {item.original_name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {(item.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 flex flex-col items-center">
          <Image className="w-12 h-12 mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-700 mb-1">No Media Uploaded Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Upload product screenshots, user interface mockups, or demo video walkthroughs to use across the site.
          </p>
        </div>
      )}
    </div>
  );
}
