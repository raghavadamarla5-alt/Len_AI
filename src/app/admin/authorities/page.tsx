"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Building, Settings, TrendingUp, FileText, Users, Search, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';

const mockAuthorities = [
  { id: 1, name: "Bapatla Municipal Corporation", state: "Andhra Pradesh", district: "Bapatla", level: "Municipality", status: "Active" },
  { id: 2, name: "APEPDCL", state: "Andhra Pradesh", district: "All", level: "State Utility", status: "Active" },
  { id: 3, name: "XYZ Village Panchayat", state: "Telangana", district: "Hyderabad", level: "Panchayat", status: "Missing URL" },
];

export default function ManageAuthorities() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ocean-900 text-white min-h-screen p-4 flex flex-col shadow-xl z-10 hidden md:flex">
        <div className="flex items-center gap-2 mb-8">
          <Settings size={24} />
          <h2 className="font-bold text-lg tracking-wide">Admin Portal</h2>
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg text-ocean-200 hover:bg-ocean-800 hover:text-white transition">
            <TrendingUp size={20} /> Dashboard Overview
          </Link>
          <Link href="/admin/authorities" className="flex items-center gap-3 bg-ocean-800 p-3 rounded-lg text-ocean-50 hover:bg-ocean-700 transition">
            <Building size={20} /> Manage Authorities
          </Link>
          <button className="flex items-center gap-3 p-3 rounded-lg text-ocean-200 hover:bg-ocean-800 hover:text-white transition w-full text-left">
            <FileText size={20} /> All Complaints
          </button>
          <button className="flex items-center gap-3 p-3 rounded-lg text-ocean-200 hover:bg-ocean-800 hover:text-white transition w-full text-left">
            <Users size={20} /> User Management
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-ocean-900">Government Authority Directory</h1>
          <button className="px-4 py-2 bg-primary text-white font-bold rounded shadow hover:bg-ocean-700 transition">
            + Add New Authority
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-ocean-100 overflow-hidden">
          <div className="p-4 border-b border-ocean-100 flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search Authorities..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-ocean-200 rounded-lg focus:ring-primary focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-400" size={18} />
            </div>
            <select className="p-2 border border-ocean-200 rounded-lg bg-white text-ocean-800 focus:ring-primary">
              <option>All States</option>
              <option>Andhra Pradesh</option>
              <option>Telangana</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ocean-50 text-ocean-800 text-sm">
                  <th className="p-4 border-b border-ocean-100 font-bold">Authority Name</th>
                  <th className="p-4 border-b border-ocean-100 font-bold">Level</th>
                  <th className="p-4 border-b border-ocean-100 font-bold">State / District</th>
                  <th className="p-4 border-b border-ocean-100 font-bold">Status</th>
                  <th className="p-4 border-b border-ocean-100 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAuthorities.map(auth => (
                  <tr key={auth.id} className="border-b border-ocean-50 hover:bg-ocean-50/50 transition">
                    <td className="p-4 font-semibold text-ocean-900">{auth.name}</td>
                    <td className="p-4 text-sm text-ocean-700">{auth.level}</td>
                    <td className="p-4 text-sm text-ocean-700">{auth.state} / {auth.district}</td>
                    <td className="p-4">
                      {auth.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                          <AlertCircle size={12} /> Missing URL
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button className="text-primary hover:text-ocean-700 p-2 border border-ocean-200 rounded hover:bg-ocean-100 transition" aria-label="Edit">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
