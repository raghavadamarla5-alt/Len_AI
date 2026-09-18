"use client";

import Link from 'next/link';
import { Building, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

const services = [
  { name: "Bapatla Municipal Corporation", type: "Municipality", state: "Andhra Pradesh", district: "Bapatla" },
  { name: "APEPDCL (Electricity Board)", type: "State Utility", state: "Andhra Pradesh", district: "All" },
  { name: "Gram Panchayat, ABC Village", type: "Panchayat", state: "Telangana", district: "Hyderabad" },
  { name: "Hyderabad Metro Water Supply", type: "Municipal Utility", state: "Telangana", district: "Hyderabad" },
];

import Header from '@/components/Header';

export default function GovernmentServices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All States');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const filteredServices = services.filter(svc => {
    const matchesSearch = svc.name.toLowerCase().includes(searchQuery.toLowerCase()) || svc.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'All States' || svc.state === stateFilter;
    const matchesCategory = categoryFilter === 'All Categories' || svc.type.includes(categoryFilter);
    
    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-ocean-50">
      <Header title="CivicAI Services Directory" backLink="/dashboard" />

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100">
          <h2 className="text-2xl font-bold text-ocean-900 mb-4">Find Government Services</h2>
          <p className="text-ocean-700 mb-6">Browse the directory of verified government authorities and portals.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search authorities..." 
                className="w-full pl-10 pr-4 py-3 border border-ocean-200 rounded-lg focus:ring-primary focus:border-primary" 
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-400" size={20} />
            </div>
            <select 
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
              className="px-4 py-3 border border-ocean-200 rounded-lg bg-white text-ocean-800"
            >
              <option>All States</option>
              <option>Andhra Pradesh</option>
              <option>Telangana</option>
            </select>
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-ocean-200 rounded-lg bg-white text-ocean-800"
            >
              <option>All Categories</option>
              <option>Municipality</option>
              <option>Panchayat</option>
              <option>Utility</option>
            </select>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-ocean-100 text-center text-ocean-700">
             <p className="font-bold">No services found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((svc, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg text-primary shrink-0"><Building size={24}/></div>
                  <div>
                    <h3 className="font-bold text-ocean-900">{svc.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-2">{svc.type}</p>
                    <p className="text-xs text-ocean-600 flex items-center gap-1"><MapPin size={12}/> {svc.district}, {svc.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
