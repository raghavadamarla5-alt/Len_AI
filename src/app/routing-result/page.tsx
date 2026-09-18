"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, MapPin, Building2, ExternalLink, FileText, CheckCircle, Edit3 } from 'lucide-react';

import Header from '@/components/Header';

export default function RoutingResult() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");

  useEffect(() => {
    const data = localStorage.getItem('routingResult');
    if (data) {
      const parsed = JSON.parse(data);
      setAnalysis(parsed);
      // Support both old and new schema fields
      setEditableText(parsed.formalComplaint || parsed.suggestedComplaintText || "");
    }
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/complaints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          complaintData: {
            ...analysis,
            finalComplaintText: editableText
          } 
        })
      });
      const ct = res.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) throw new Error("Invalid format");
      const data = await res.json();
      if (data.success) {
        alert(`Complaint submitted successfully! Your tracking ID is ${data.complaint.id}`);
        router.push('/tracking');
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (e) {
      alert("Submission failed to connect.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!analysis) return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-50">
      <div className="p-8 text-center text-ocean-700 animate-pulse font-bold">Loading AI Result...</div>
    </div>
  );

  const problemText = analysis.problemSummary || analysis.identifiedProblem || "Uncategorized Problem";
  const authorityText = analysis.recommendedAuthority || analysis.responsibleAuthority || "Local Municipal Authority";
  const locationText = analysis.location ? `${analysis.location.town}, ${analysis.location.district}, ${analysis.location.state}` : "Unknown Location";

  return (
    <div className="min-h-screen bg-ocean-50 text-foreground">
      <Header title="AI Civic Assistant" backLink="/dashboard" backText="Cancel & Go Home" />

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* AI Identified Problem */}
        <div className="bg-white rounded-xl shadow border border-ocean-200 overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-blue-600 text-white p-4 font-bold flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Problem Identified: {problemText}</span>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex gap-2 text-ocean-800">
              <MapPin className="shrink-0 text-primary" />
              <div>
                <p className="font-semibold">Verified Location</p>
                <p className="text-sm">{locationText}</p>
              </div>
            </div>

            <div className="flex gap-2 text-ocean-800">
              <Building2 className="shrink-0 text-primary" />
              <div>
                <p className="font-semibold">Responsible Authority</p>
                <p className="text-sm font-bold text-primary">{authorityText}</p>
                <p className="text-xs text-ocean-600">Based on your location and jurisdiction rules.</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-ocean-100">
              <p className="font-semibold text-ocean-800 mb-2">Official Portal Action Required:</p>
              <div className="flex justify-between items-center bg-ocean-50 p-3 rounded border border-ocean-200">
                <span className="text-sm font-bold">State Grievance Portal</span>
                <button className="flex items-center gap-1 px-4 py-2 bg-white text-primary border border-primary rounded shadow-sm hover:bg-ocean-100 text-sm font-bold">
                  Open Official Portal <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggested Complaint */}
        <div className="bg-white rounded-xl shadow border border-ocean-200 overflow-hidden animate-in slide-in-from-bottom-8 delay-150">
          <div className="bg-ocean-800 text-white p-4 font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={20} />
              <span>Formal Complaint Draft</span>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-sm bg-ocean-700 px-3 py-1 rounded hover:bg-ocean-600 transition">
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>
          <div className="p-6 space-y-4">
            {isEditing ? (
              <textarea 
                value={editableText}
                onChange={e => setEditableText(e.target.value)}
                className="w-full h-48 bg-gray-50 p-4 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm font-serif text-gray-800"
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm font-serif text-gray-800 whitespace-pre-wrap">
                {editableText}
              </div>
            )}

            {isEditing ? (
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="px-6 py-2 bg-primary text-white font-bold rounded shadow hover:bg-ocean-700 transition"
                >
                  Save Draft
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(editableText);
                    alert("Copied to clipboard!");
                  }}
                  className="flex-1 py-3 bg-white text-ocean-700 border border-ocean-300 font-bold rounded shadow-sm hover:bg-ocean-50 transition"
                >
                  Copy Message
                </button>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 bg-white text-ocean-700 border border-ocean-300 font-bold rounded shadow-sm hover:bg-ocean-50 transition"
                >
                  Edit Message
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-ocean-600 mb-4">
            The AI acts as an assistant. You are in full control of the final message submitted to the government.
          </p>
          <button 
            onClick={handleSubmit} 
            disabled={submitting || isEditing}
            className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition w-full md:w-auto disabled:opacity-50"
          >
            {submitting ? "Submitting securely..." : "Confirm & Submit Complaint"}
          </button>
        </div>

      </main>
    </div>
  );
}
