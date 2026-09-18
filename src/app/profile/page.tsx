"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { User, Mail, Phone, MapPin, Building, Calendar, Activity, CheckCircle, Clock, Settings, FileText } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(async res => {
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) return res.json();
        throw new Error("Invalid response");
      })
      .then(data => {
        if (data.success) {
          setProfile(data.profile);
          setStats(data.stats);
        } else {
          window.location.href = '/login';
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-50">
        <Header title="My Profile" backLink="/dashboard" />
        <div className="p-8 text-center text-ocean-700 animate-pulse font-bold">Loading your profile...</div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-ocean-50">
      <Header title="My Profile" backLink="/dashboard" />

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-ocean-100 overflow-hidden relative">
          <div className="h-32 bg-primary w-full"></div>
          
          <div className="px-6 pb-6 relative flex flex-col md:flex-row gap-6 items-center md:items-end -mt-16 text-center md:text-left">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-ocean-200 overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold text-4xl shadow-md">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="flex-1 space-y-1 mt-4 md:mt-0">
              <h2 className="text-3xl font-bold text-ocean-900">{profile.name}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-ocean-600 font-semibold">
                <CheckCircle size={16} className="text-green-600" /> Verified Citizen
              </div>
            </div>
            
            <Link 
              href="/profile/edit"
              className="px-6 py-2 bg-ocean-100 text-primary border border-ocean-200 font-bold rounded shadow-sm hover:bg-ocean-200 transition flex items-center gap-2"
            >
              <Settings size={18} /> Edit Profile
            </Link>
          </div>

          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-t border-ocean-50 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-ocean-800">
                <div className="p-2 bg-ocean-50 rounded text-primary"><Phone size={20} /></div>
                <div>
                  <p className="text-xs text-ocean-500 font-bold uppercase">Mobile Number</p>
                  <p className="font-semibold">{profile.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-ocean-800">
                <div className="p-2 bg-ocean-50 rounded text-primary"><Mail size={20} /></div>
                <div>
                  <p className="text-xs text-ocean-500 font-bold uppercase">Email Address</p>
                  <p className="font-semibold">{profile.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-ocean-800">
                <div className="p-2 bg-ocean-50 rounded text-primary"><Calendar size={20} /></div>
                <div>
                  <p className="text-xs text-ocean-500 font-bold uppercase">Account Created</p>
                  <p className="font-semibold">{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-ocean-800">
                <div className="p-2 bg-ocean-50 rounded text-primary"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-ocean-500 font-bold uppercase">Address</p>
                  <p className="font-semibold">{profile.address || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-ocean-800">
                <div className="p-2 bg-ocean-50 rounded text-primary"><Building size={20} /></div>
                <div>
                  <p className="text-xs text-ocean-500 font-bold uppercase">Location</p>
                  <p className="font-semibold">
                    {profile.municipality || "Municipality not set"} <br/>
                    {profile.district || "District not set"}, {profile.state || "State not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Civic Statistics */}
        <h3 className="text-xl font-bold text-ocean-900 mt-8 mb-4">My Civic Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-full"><FileText size={24} /></div>
            <div>
              <p className="text-sm text-ocean-600 font-bold">Total Complaints</p>
              <p className="text-3xl font-bold text-ocean-900">{stats?.total || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 flex items-center gap-4">
            <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-ocean-600 font-bold">Active / Pending</p>
              <p className="text-3xl font-bold text-ocean-900">{stats?.active || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-full"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm text-ocean-600 font-bold">Resolved</p>
              <p className="text-3xl font-bold text-ocean-900">{stats?.resolved || 0}</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
