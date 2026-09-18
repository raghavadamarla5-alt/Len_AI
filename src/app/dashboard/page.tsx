"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, MapPin, Bell, User, HelpCircle, Activity, Camera, Droplets, Zap, Train, AlertTriangle } from 'lucide-react';

const categories = [
  { name: 'Roads & Potholes', icon: Activity, color: 'bg-red-100 text-red-600' },
  { name: 'Garbage & Waste', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
  { name: 'Water Supply', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
  { name: 'Electricity', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Transport & Railways', icon: Train, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Public Cleanliness', icon: Camera, color: 'bg-emerald-100 text-emerald-600' },
];

import Header from '@/components/Header';

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch user profile for personalized greeting safely
    fetch('/api/profile')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return res.json();
        } else {
          throw new Error("Response is not JSON");
        }
      })
      .then(data => {
        if (data.success && data.profile) {
          setUserName(data.profile.name);
        }
      })
      .catch(e => {
        console.error("Dashboard profile fetch error:", e);
      });
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a civic problem to search.");
      return;
    }
    router.push(`/report?category=Custom&problem=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/report?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showSearch showLocation />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Welcome Greeting */}
        <div className="text-center md:text-left mb-2 animate-fade-in">
          <h1 className="text-3xl font-bold text-ocean-900">
            Welcome back{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-ocean-600">Track, report, and resolve civic issues instantly.</p>
        </div>
        
        {/* Smart Search */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 text-center space-y-4">
          <h2 className="text-2xl font-bold text-ocean-800">What government service do you need?</h2>
          <div className="max-w-2xl mx-auto relative">
            <input 
              id="search-input"
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. My streetlight is not working..." 
              className="w-full pl-4 pr-12 py-3 rounded-lg border-2 border-ocean-200 focus:outline-none focus:border-primary text-lg"
            />
            <button onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-md hover:bg-ocean-700 transition">
              <Search size={20} />
            </button>
          </div>
        </section>

        {/* Problem Categories */}
        <section>
          <h3 className="text-xl font-bold mb-4 text-ocean-900 border-b border-ocean-100 pb-2">Common Civic Problems</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button 
                  key={idx} 
                  onClick={() => handleCategoryClick(cat.name)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-ocean-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition hover:-translate-y-1"
                >
                  <div className={`p-3 rounded-full ${cat.color}`}>
                    <Icon size={28} />
                  </div>
                  <span className="font-semibold text-sm text-center">{cat.name}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="flex justify-center">
           <button onClick={() => router.push('/report')} className="px-6 py-3 bg-ocean-100 text-primary font-bold rounded-lg shadow-sm hover:bg-ocean-200 transition flex items-center gap-2">
             <Camera size={20} />
             Describe My Problem with Photo
           </button>
        </section>
      </main>
    </div>
  );
}
