import { useState } from 'react';
import { Hero } from './components/Hero';
import { DetectionSection } from './components/DetectionSection';
import { Features } from './components/Features';
import { Chatbot } from './components/Chatbot';
import { ParticlesBackground } from './components/ParticlesBackground';
import { Navigation } from './components/Navigation';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>
      
      <ParticlesBackground />
      <Navigation />
      
      <main className="relative z-10">
        <Hero />
        <Features />
        <DetectionSection onAnalysisComplete={() => setHasAnalysis(true)} />
      </main>

      <Chatbot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} hasAnalysis={hasAnalysis} />
      
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}