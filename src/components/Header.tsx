"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Bell, User as UserIcon, HelpCircle, LogOut, Settings, History, Search, Bot } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showLocation?: boolean;
  backLink?: string;
  backText?: string;
}

export default function Header({ 
  title = "AI CIVIC ASSISTANCE", 
  showSearch = false, 
  showLocation = false,
  backLink,
  backText = "Back to Dashboard"
}: HeaderProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          {backLink ? <Bot size={24} /> : null}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        {/* Center: Location (Dashboard only usually) */}
        {showLocation && (
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
            <MapPin size={16} />
            <span>Bapatla, Andhra Pradesh</span>
            <button className="text-xs underline ml-2 hover:text-ocean-200">Change</button>
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {backLink && (
            <Link href={backLink} className="text-sm underline hover:text-ocean-200 mr-2">
              {backText}
            </Link>
          )}

          {showSearch && (
             <button aria-label="Search" onClick={() => document.getElementById('search-input')?.focus()}>
               <Search size={20} />
             </button>
          )}
          
          <button aria-label="Notifications" onClick={() => alert("No new notifications")}>
            <Bell size={20} />
          </button>
          
          <button aria-label="Help" onClick={() => alert("Help Center coming soon.")}>
            <HelpCircle size={20} />
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              aria-label="Profile" 
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-1 rounded-full hover:bg-white/10 transition"
            >
              <UserIcon size={20} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-ocean-900 border border-ocean-100 z-50">
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 px-4 py-2 hover:bg-ocean-50 transition"
                  onClick={() => setProfileOpen(false)}
                >
                  <UserIcon size={16} /> My Profile
                </Link>
                <Link 
                  href="/profile/edit" 
                  className="flex items-center gap-2 px-4 py-2 hover:bg-ocean-50 transition"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={16} /> Edit Profile
                </Link>
                <Link 
                  href="/tracking" 
                  className="flex items-center gap-2 px-4 py-2 hover:bg-ocean-50 transition"
                  onClick={() => setProfileOpen(false)}
                >
                  <History size={16} /> My Complaints
                </Link>
                <div className="h-px bg-ocean-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
