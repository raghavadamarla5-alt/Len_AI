"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MapPin, Megaphone } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [state, setState] = useState('Select State');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) return alert("Enter valid mobile number");
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, state })
      });
      const ct = res.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) throw new Error("Invalid format");
      const data = await res.json();
      if (data.success) {
        // Redirect on success
        router.push('/dashboard');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ocean-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-ocean-100">
        
        <div className="bg-primary p-6 text-center">
          <Megaphone className="mx-auto text-primary-foreground mb-2" size={48} />
          <h1 className="text-2xl font-bold text-primary-foreground tracking-wider">AI CIVIC ASSISTANCE</h1>
          <p className="text-ocean-100 text-sm mt-1">Secure Citizen Login</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold text-ocean-900 mb-1">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-ocean-200 bg-ocean-50 text-ocean-600 sm:text-sm">
                  +91
                </span>
                <input 
                  type="tel" 
                  id="mobile" 
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-ocean-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" 
                  placeholder="10-digit mobile number" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-ocean-900 mb-1">State</label>
              <select value={state} onChange={e => setState(e.target.value)} className="block w-full px-3 py-2 rounded-md border border-ocean-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
                <option>Select State</option>
                <option>Andhra Pradesh</option>
                <option>Telangana</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>Maharashtra</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-ocean-700">
              <input type="checkbox" className="rounded border-ocean-300 text-primary focus:ring-primary" />
              <span>Allow Location Access</span>
            </label>
          </div>

          <button disabled={loading} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-primary hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
            {loading ? "Sending..." : "Send OTP / Login"}
          </button>
          
          <p className="text-center text-xs text-ocean-600 mt-4">
            By logging in, you agree to the use of an authorized identity-verification service to prevent false complaints.
          </p>
        </form>
      </div>
      
      <div className="mt-8 text-center text-ocean-700 text-sm max-w-sm">
        <p className="flex items-center justify-center gap-1 mb-2 font-semibold">
          <MapPin size={16}/> Location Privacy Guaranteed
        </p>
        <p>Your location is only used to route your complaint to the correct local authority.</p>
      </div>
    </div>
  );
}
