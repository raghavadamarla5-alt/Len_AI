"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Camera, Upload, AlertTriangle, CheckCircle2, Navigation, Trash } from 'lucide-react';

import Header from '@/components/Header';

function ReportProblemForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [locationVerified, setLocationVerified] = useState(false);
  const [verifiedLocationData, setVerifiedLocationData] = useState<any>(null);
  
  const [addressInput, setAddressInput] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  
  // Real file picker state
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);

  useEffect(() => {
    // Pre-fill from query params if coming from dashboard
    const cat = searchParams.get('category');
    const prob = searchParams.get('problem');
    if (prob) {
      setProblemDescription(`[Category: ${cat}] ${prob}`);
    } else if (cat && cat !== 'Custom') {
      setProblemDescription(`Category: ${cat}\n\nProblem details: `);
    }
  }, [searchParams]);

  const handleVerifyLocation = async (useGps = false) => {
    setLoadingLoc(true);
    try {
      const res = await fetch('/api/location/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useGps ? { lat: 15.9, lng: 80.4 } : { address: addressInput })
      });
      const ct = res.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) throw new Error("Invalid format");
      const data = await res.json();
      if (data.success) {
        setVerifiedLocationData(data.verifiedLocation);
        setLocationVerified(true);
      }
    } catch(e) {
      alert("Location verification failed");
    } finally {
      setLoadingLoc(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3); // Max 3 files
      setEvidenceFiles(files);
      const urls = files.map(f => URL.createObjectURL(f));
      setPreviewUrls(urls);
    }
  };

  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!problemDescription.trim()) {
      return alert("Please enter a description of the problem.");
    }
    setLoadingAnalyze(true);
    try {
      const res = await fetch('/api/complaints/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          problemDescription, 
          location: verifiedLocationData, 
          hasEvidence: evidenceFiles.length > 0 
        })
      });
      const ct = res.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) throw new Error("Invalid format");
      const data = await res.json();
      if (data.success) {
        // Pass data via localStorage for the routing-result page
        localStorage.setItem('routingResult', JSON.stringify({
          ...data.analysis,
          problemDescription,
          evidenceCount: evidenceFiles.length,
          location: verifiedLocationData
        }));
        router.push('/routing-result');
      } else {
        alert(data.error || "Analysis failed");
      }
    } catch(e) {
      alert("Analysis failed to connect.");
    } finally {
      setLoadingAnalyze(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title="Report a Problem" backLink="/dashboard" backText="Cancel" />

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 border-b border-ocean-100 pb-4">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-ocean-300'}`}>
            <MapPin size={24} />
            <span className="text-xs mt-1 font-bold">1. Location</span>
          </div>
          <div className={`flex-grow border-t-2 mx-4 ${step >= 2 ? 'border-primary' : 'border-ocean-100'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-ocean-300'}`}>
            <Camera size={24} />
            <span className="text-xs mt-1 font-bold">2. Evidence</span>
          </div>
          <div className={`flex-grow border-t-2 mx-4 ${step >= 3 ? 'border-primary' : 'border-ocean-100'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-ocean-300'}`}>
            <AlertTriangle size={24} />
            <span className="text-xs mt-1 font-bold">3. Details</span>
          </div>
        </div>

        {/* Step 1: Location Verification */}
        {step === 1 && (
          <section className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-ocean-900">Where is the problem?</h2>
            
            <div className="bg-ocean-50 p-4 rounded-xl border border-ocean-200 flex gap-4 items-start">
              <Navigation className="text-primary mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-ocean-800">Use My Current Location</p>
                <p className="text-sm text-ocean-600 mb-3">Allow GPS access to pinpoint the exact authority responsible.</p>
                <button 
                  onClick={() => handleVerifyLocation(true)}
                  disabled={loadingLoc}
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded shadow hover:bg-ocean-700 transition disabled:opacity-50"
                >
                  {loadingLoc ? "Locating..." : "Locate Me"}
                </button>
              </div>
            </div>

            {locationVerified && verifiedLocationData && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-3">
                <div className="flex items-center gap-2 text-green-700 font-bold">
                  <CheckCircle2 size={20} />
                  <span>Location Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-900">
                  <p><strong>State:</strong> {verifiedLocationData.state}</p>
                  <p><strong>District:</strong> {verifiedLocationData.district}</p>
                  <p><strong>Town:</strong> {verifiedLocationData.town}</p>
                  <p><strong>PIN:</strong> {verifiedLocationData.pincode}</p>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full mt-2 px-4 py-3 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700 transition"
                >
                  Confirm Location & Continue
                </button>
              </div>
            )}
            
            <div className="text-center text-sm text-ocean-600 font-semibold my-4">OR</div>
            
            <div className="bg-white p-4 rounded-xl border border-ocean-200 shadow-sm space-y-4">
              <p className="font-semibold text-ocean-800">Search Address Manually</p>
              <input 
                type="text" 
                value={addressInput}
                onChange={e => setAddressInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addressInput && handleVerifyLocation(false)}
                placeholder="Enter Village / Town / Landmark..." 
                className="w-full p-3 border border-ocean-200 rounded focus:ring-primary focus:border-primary" 
              />
              <button 
                onClick={() => handleVerifyLocation(false)}
                disabled={loadingLoc || !addressInput}
                className="w-full py-2 bg-ocean-100 text-primary font-bold border border-ocean-200 rounded hover:bg-ocean-200 transition disabled:opacity-50"
              >
                Search & Verify Location
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Evidence */}
        {step === 2 && (
          <section className="space-y-6 animate-in fade-in zoom-in duration-300">
             <h2 className="text-2xl font-bold text-ocean-900">Upload Evidence</h2>
             <p className="text-ocean-700">Providing clear photos or videos helps the authority understand the severity.</p>
             
             <div className="border-2 border-dashed border-ocean-300 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 bg-ocean-50">
               <Upload size={48} className="text-ocean-400" />
               <div>
                 <p className="font-bold text-ocean-800">Tap to upload photos or videos</p>
                 <p className="text-sm text-ocean-600 mt-1">Maximum 3 files (JPG, PNG, MP4)</p>
               </div>
               <input 
                 type="file" 
                 accept="image/*,video/mp4" 
                 multiple 
                 className="hidden" 
                 ref={fileInputRef}
                 onChange={handleFileChange}
               />
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="px-6 py-2 bg-white border border-ocean-300 rounded shadow-sm text-ocean-700 font-semibold hover:bg-ocean-100 transition"
               >
                 Select Files
               </button>
             </div>

             {previewUrls.length > 0 && (
               <div className="flex gap-4 overflow-x-auto py-2">
                 {previewUrls.map((url, idx) => (
                   <div key={idx} className="relative shrink-0">
                     <img src={url} alt="Preview" className="h-24 w-24 object-cover rounded border border-ocean-200" />
                     <button 
                       onClick={() => removeFile(idx)}
                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                     >
                       <Trash size={12} />
                     </button>
                   </div>
                 ))}
               </div>
             )}

             <div className="flex gap-4">
               <button onClick={() => setStep(1)} className="px-6 py-3 bg-white border border-ocean-200 text-ocean-700 font-bold rounded shadow-sm hover:bg-ocean-50 flex-1">
                 Back
               </button>
               <button onClick={() => setStep(3)} className="px-6 py-3 bg-primary text-white font-bold rounded shadow hover:bg-ocean-700 flex-1">
                 Continue to Details
               </button>
             </div>
          </section>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <section className="space-y-6 animate-in fade-in zoom-in duration-300">
             <h2 className="text-2xl font-bold text-ocean-900">Describe the Problem</h2>
             <p className="text-ocean-700">Write a short description or use your voice to describe what happened.</p>
             
             <textarea 
               rows={5} 
               value={problemDescription}
               onChange={e => setProblemDescription(e.target.value)}
               placeholder="e.g. There is a large pothole on the main road causing issues for vehicles..."
               className="w-full p-4 rounded-xl border border-ocean-200 focus:ring-primary focus:border-primary resize-none"
             ></textarea>

             <div className="flex justify-center my-4">
                <button 
                  onClick={() => {
                    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                    if (SpeechRecognition) {
                      const recognition = new SpeechRecognition();
                      recognition.onresult = (event: any) => {
                        setProblemDescription(prev => prev + " " + event.results[0][0].transcript);
                      };
                      recognition.start();
                    } else {
                      alert("Voice input is not supported in this browser.");
                    }
                  }}
                  className="px-6 py-3 bg-ocean-100 text-primary font-bold rounded-full shadow-sm hover:bg-ocean-200 transition flex items-center gap-2"
                >
                  🎙️ Speak Your Problem
                </button>
             </div>

             <div className="bg-blue-50 p-4 border border-blue-200 rounded-xl">
               <p className="text-sm text-blue-800 font-semibold mb-2">AI Analysis will identify the responsible authority.</p>
               <button 
                 onClick={handleAnalyze}
                 disabled={loadingAnalyze || !problemDescription.trim()}
                 className="w-full py-4 bg-primary text-white font-bold rounded shadow-lg hover:bg-ocean-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {loadingAnalyze ? "Analyzing..." : <><Navigation size={18} /> Analyze & Find Authority</>}
               </button>
             </div>
             
             <button onClick={() => setStep(2)} className="w-full py-3 bg-white border border-ocean-200 text-ocean-700 font-bold rounded shadow-sm hover:bg-ocean-50">
               Back to Evidence
             </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default function ReportProblem() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportProblemForm />
    </Suspense>
  );
}
