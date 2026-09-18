"use client";

import Link from 'next/link';
import { Search, History, Clock, CheckCircle2, XCircle, ChevronRight, MessageSquareWarning } from 'lucide-react';
import { useState, useEffect } from 'react';

type Complaint = {
  id: string;
  problem: string;
  location: string;
  authority: string;
  status: string;
  date: string;
};

import Header from '@/components/Header';

export default function TrackingDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch('/api/complaints');
        const ct = res.headers.get("content-type");
        if (!ct || !ct.includes("application/json")) throw new Error("Invalid format");
        const data = await res.json();
        if (data.success) {
          setComplaints(data.complaints);
        }
      } catch (e) {
        console.error("Failed to fetch", e);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === 'Resolved') return CheckCircle2;
    if (status === 'Rejected') return XCircle;
    return Clock;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Resolved') return { color: 'text-green-600', bg: 'bg-green-50' };
    if (status === 'Rejected') return { color: 'text-red-600', bg: 'bg-red-50' };
    return { color: 'text-blue-600', bg: 'bg-blue-50' };
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.problem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title="My Complaints" backLink="/dashboard" />

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-ocean-100">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Complaint ID or Problem..." 
              className="w-full pl-10 pr-4 py-2 border border-ocean-200 rounded-lg focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-400" size={18} />
          </div>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 border border-ocean-200 rounded-lg bg-white text-ocean-800 focus:ring-primary"
          >
            <option>All Statuses</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-ocean-600 animate-pulse font-bold">Loading your complaints...</div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-ocean-200 shadow-sm text-ocean-700">
              <p className="font-bold">No complaints found.</p>
              <p className="text-sm mt-2">Try adjusting your filters or go back to the dashboard to report a problem.</p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => {
              const StatusIcon = getStatusIcon(complaint.status);
              const { color: statusColor, bg: bgColor } = getStatusColor(complaint.status);
              
              return (
                <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-ocean-200 overflow-hidden hover:shadow-md transition">
                  <div className="p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold bg-ocean-100 text-ocean-800 px-2 py-1 rounded">
                          {complaint.id}
                        </span>
                        <span className="text-xs text-ocean-500">{complaint.date}</span>
                        <span className="text-[10px] uppercase font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-2">DEMO</span>
                      </div>
                      <h3 className="font-bold text-lg text-ocean-900">{complaint.problem}</h3>
                      <p className="text-sm text-ocean-600">{complaint.location}</p>
                      <p className="text-xs font-semibold text-primary mt-1">{complaint.authority}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${bgColor} ${statusColor}`}>
                        <StatusIcon size={16} />
                        {complaint.status}
                      </div>
                      <button className="flex items-center gap-1 text-sm font-bold text-primary hover:text-ocean-700 w-full md:w-auto justify-end">
                        View Details <ChevronRight size={16} />
                      </button>
                    </div>

                  </div>
                  
                  {/* AI Escalation Assistant for Rejected Complaints */}
                  {complaint.status === "Rejected" && (
                    <div className="bg-red-50 border-t border-red-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex gap-2">
                        <MessageSquareWarning className="text-red-600 shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm font-bold text-red-900">AI Escalation Assistant</p>
                          <p className="text-xs text-red-700 mt-1">This complaint was rejected due to "Insufficient Evidence". You can appeal or re-submit with better photos.</p>
                        </div>
                      </div>
                      <button className="whitespace-nowrap px-4 py-2 bg-white text-red-700 border border-red-200 font-bold text-sm rounded shadow-sm hover:bg-red-100 transition">
                        View Appeal Options
                      </button>
                    </div>
                  )}

                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  );
}
