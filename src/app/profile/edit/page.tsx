"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Camera, Save, X } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>({
    name: '',
    email: '',
    address: '',
    state: '',
    district: '',
    municipality: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(async res => {
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) return res.json();
        throw new Error("Invalid response");
      })
      .then(data => {
        if (data.success) {
          setProfile({
            name: data.profile.name || '',
            email: data.profile.email || '',
            address: data.profile.address || '',
            state: data.profile.state || '',
            district: data.profile.district || '',
            municipality: data.profile.municipality || '',
            avatarUrl: data.profile.avatarUrl || ''
          });
        } else {
          router.push('/login');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File is too large. Please upload an image under 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev: any) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!profile.name.trim()) return setError('Name is required');
    if (profile.name.length < 3) return setError('Name must be at least 3 characters');
    
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const ct = res.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) {
        throw new Error("Server returned invalid response format");
      }
      const data = await res.json();
      
      if (data.success) {
        router.push('/profile');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (e) {
      setError('Connection failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading...</div>;

  return (
    <div className="min-h-screen bg-ocean-50">
      <Header title="Edit Profile" backLink="/profile" backText="Cancel" />

      <main className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-ocean-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded font-bold text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-32 h-32 rounded-full border-4 border-ocean-100 bg-ocean-50 flex items-center justify-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-ocean-300">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
                
                <div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="text-white" />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-bold text-primary hover:underline"
              >
                Change Photo
              </button>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload}
                className="hidden" 
              />
              <p className="text-xs text-ocean-500">Max size 2MB. Stored locally for this demo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-ocean-800">Full Name *</label>
                <input 
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-ocean-200 rounded focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-ocean-800">Email Address</label>
                <input 
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-ocean-200 rounded focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-bold text-ocean-800">Full Address</label>
                <input 
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-ocean-200 rounded focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-ocean-800">State</label>
                <input 
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  className="w-full p-3 border border-ocean-200 rounded focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-ocean-800">District</label>
                <input 
                  name="district"
                  value={profile.district}
                  onChange={handleChange}
                  className="w-full p-3 border border-ocean-200 rounded focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-bold text-ocean-800">Municipality / Panchayat</label>
                <input 
                  name="municipality"
                  value={profile.municipality}
                  onChange={handleChange}
                  className="w-full p-3 border border-ocean-200 rounded focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-ocean-100">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="flex-1 py-3 bg-white border border-ocean-200 font-bold text-ocean-700 rounded shadow-sm hover:bg-ocean-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="flex-1 py-3 bg-primary text-white font-bold rounded shadow hover:bg-ocean-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
