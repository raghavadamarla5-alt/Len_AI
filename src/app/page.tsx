import Link from 'next/link';
import { MapPin, Megaphone, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full p-6 bg-primary text-primary-foreground shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Megaphone size={28} />
            <h1 className="text-2xl font-bold tracking-wider">AI CIVIC ASSISTANCE</h1>
          </div>
          <nav>
            <Link href="/login" className="px-4 py-2 border border-primary-foreground rounded hover:bg-primary-foreground hover:text-primary transition-colors">
              Login / Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
            Don't know which government department to contact?
          </h2>
          
          <div className="text-xl md:text-2xl text-ocean-700 space-y-2">
            <p className="flex items-center justify-center gap-2"><MapPin className="text-primary"/> Tell us your location.</p>
            <p className="flex items-center justify-center gap-2"><Megaphone className="text-primary"/> Show us your problem.</p>
            <p className="flex items-center justify-center gap-2"><CheckCircle2 className="text-primary"/> We will guide you to the appropriate official government service.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link href="/dashboard" className="px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-lg shadow-lg hover:bg-ocean-700 transition transform hover:-translate-y-1">
              GET CIVIC ASSISTANCE
            </Link>
            <button className="px-8 py-4 bg-white text-primary border-2 border-primary text-lg font-bold rounded-lg shadow hover:bg-ocean-50 transition">
              TRACK MY COMPLAINT
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full p-4 text-center text-ocean-700 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Civic Assistance Router - India</p>
      </footer>
    </div>
  );
}
