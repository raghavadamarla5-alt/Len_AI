import Link from 'next/link';
import { Users, FileText, AlertCircle, Building, CheckCircle2, TrendingUp, Settings } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ocean-900 text-white min-h-screen p-4 flex flex-col shadow-xl z-10 hidden md:flex">
        <div className="flex items-center gap-2 mb-8">
          <Settings size={24} />
          <h2 className="font-bold text-lg tracking-wide">Admin Portal</h2>
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 bg-ocean-800 p-3 rounded-lg text-ocean-50 hover:bg-ocean-700 transition">
            <TrendingUp size={20} /> Dashboard Overview
          </Link>
          <Link href="/admin/authorities" className="flex items-center gap-3 p-3 rounded-lg text-ocean-200 hover:bg-ocean-800 hover:text-white transition">
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
          <h1 className="text-3xl font-bold text-ocean-900">Platform Overview</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-ocean-600">Admin: SuperUser</span>
            <Link href="/" className="text-sm underline text-primary">Exit Admin</Link>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24} /></div>
            <div>
              <p className="text-sm text-ocean-600 font-semibold">Total Users</p>
              <p className="text-2xl font-bold text-ocean-900">12,450</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><FileText size={24} /></div>
            <div>
              <p className="text-sm text-ocean-600 font-semibold">Total Complaints</p>
              <p className="text-2xl font-bold text-ocean-900">4,892</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle2 size={24} /></div>
            <div>
              <p className="text-sm text-ocean-600 font-semibold">Resolved</p>
              <p className="text-2xl font-bold text-ocean-900">3,105</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600"><AlertCircle size={24} /></div>
            <div>
              <p className="text-sm text-ocean-600 font-semibold">Rejected / Failed Routing</p>
              <p className="text-2xl font-bold text-ocean-900">142</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Complaints by Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100">
            <h3 className="text-lg font-bold text-ocean-900 mb-4 border-b pb-2">Complaints by Category</h3>
            <div className="space-y-4">
              {[
                { label: 'Roads & Potholes', pct: 45, count: '2,201' },
                { label: 'Garbage & Waste', pct: 30, count: '1,467' },
                { label: 'Water Supply', pct: 15, count: '733' },
                { label: 'Electricity', pct: 10, count: '491' },
              ].map(cat => (
                <div key={cat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-ocean-700">{cat.label}</span>
                    <span className="text-ocean-500">{cat.count}</span>
                  </div>
                  <div className="w-full bg-ocean-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${cat.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Failed Routings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ocean-100">
            <h3 className="text-lg font-bold text-ocean-900 mb-4 border-b pb-2 text-red-700 flex items-center gap-2">
              <AlertCircle size={20} /> Action Needed: Missing Portals
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-100 rounded text-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-red-900">Panchayat: XYZ Village</p>
                  <p className="text-red-700">Missing official portal link for Water issues</p>
                </div>
                <Link href="/admin/authorities" className="text-primary underline font-semibold">Fix</Link>
              </div>
              <div className="p-3 bg-red-50 border border-red-100 rounded text-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-red-900">Municipality: ABC Town</p>
                  <p className="text-red-700">Portal URL returning 404 Error</p>
                </div>
                <Link href="/admin/authorities" className="text-primary underline font-semibold">Fix</Link>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
