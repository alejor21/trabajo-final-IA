import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageDetection } from './ImageDetection';
import { VideoDetection } from './VideoDetection';
import { Image, Video, Scan } from 'lucide-react';

interface DetectionSectionProps {
  onAnalysisComplete?: () => void;
}

export function DetectionSection({ onAnalysisComplete }: DetectionSectionProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  return (
    <section id="detección" className="py-32 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 mb-6"
          >
            <Scan className="size-4 text-orange-400" />
            <span className="text-orange-400">Detección en Vivo</span>
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Prueba el Sistema
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Sube una imagen o video para detectar equipos de protección personal en tiempo real
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-black/40 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-1.5">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-400 hover:text-orange-400'
              }`}
            >
              <Image className="size-5" />
              <span>Imagen</span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-400 hover:text-orange-400'
              }`}
            >
              <Video className="size-5" />
              <span>Video</span>
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'image' ? (
            <motion.div
              key="image"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <ImageDetection onAnalysisComplete={onAnalysisComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <VideoDetection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}