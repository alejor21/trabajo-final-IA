import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface Detection {
  class: string;
  confidence: number;
  color?: string;
}

interface MissingItem {
  person_id: number;
  missing: string[];
}

interface ImageDetectionProps {
  onAnalysisComplete?: () => void;
}

export function ImageDetection({ onAnalysisComplete }: ImageDetectionProps) {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [missingItems, setMissingItems] = useState<MissingItem[]>([]);
  const [compliance, setCompliance] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFile = useRef<File | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      currentFile.current = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setDetections([]);
        setMissingItems([]);
        setProcessedImage(null);
        setCompliance(null);
      };
      reader.readAsDataURL(file);
      
      // Procesar automáticamente
      await processImage(file);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const result = await api.detectImage(file);
      
      setDetections(result.detections || []);
      setCompliance(result.compliance);
      setMissingItems(result.compliance?.missing_items || []);
      
      // Cargar imagen procesada
      if (result.processed_image_path) {
        setProcessedImage(api.getProcessedImage(result.processed_image_path));
      }
      
      // Notificar que el análisis está completo
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getDetectionColor = (className: string) => {
    const lowerClass = className.toLowerCase();
    if (lowerClass.includes('helmet') || lowerClass.includes('casco')) return 'from-orange-500 to-amber-500';
    if (lowerClass.includes('vest') || lowerClass.includes('chaleco')) return 'from-amber-500 to-yellow-500';
    if (lowerClass.includes('gloves') || lowerClass.includes('guantes')) return 'from-orange-600 to-red-600';
    if (lowerClass.includes('boots') || lowerClass.includes('botas')) return 'from-red-500 to-orange-500';
    if (lowerClass.includes('goggles') || lowerClass.includes('gafas')) return 'from-yellow-500 to-amber-500';
    return 'from-orange-500 to-amber-500';
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border-2 border-dashed border-orange-500/30 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {!image ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center h-96 cursor-pointer group"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-30"></div>
                  <Upload className="size-20 text-orange-400 relative group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xl text-gray-300 group-hover:text-orange-400 transition-colors mb-2">
                  Haz clic para subir una imagen
                </p>
                <p className="text-sm text-gray-500">PNG, JPG hasta 10MB</p>
                <div className="mt-6 flex items-center gap-2 text-orange-400">
                  <Sparkles className="size-4" />
                  <span className="text-sm">Detección instantánea con YOLO</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={image}
                    alt="Original"
                    className="w-full h-96 object-contain rounded-lg"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="size-12 text-orange-400 animate-spin mx-auto mb-4" />
                        <p className="text-orange-400">Analizando imagen...</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm hover:bg-orange-500/20 border border-orange-500/30 text-orange-400"
                >
                  Cambiar Imagen
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Comparison: Original vs Processed */}
      {processedImage && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl mb-4 flex items-center gap-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            <CheckCircle className="size-6 text-orange-400" />
            Comparación: Original vs Analizada
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6">
                <h4 className="text-lg text-orange-400 mb-4 font-semibold">📷 Imagen Original</h4>
                <img
                  src={image}
                  alt="Original"
                  className="w-full h-80 object-contain rounded-lg bg-black/30"
                />
              </div>
            </div>

            {/* Processed Image */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
                <h4 className="text-lg text-green-400 mb-4 font-semibold">🔍 Imagen Analizada</h4>
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full h-80 object-contain rounded-lg bg-black/30"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 h-full">
            <h3 className="text-2xl mb-6 flex items-center gap-3">
              {isProcessing ? (
                <>
                  <Loader2 className="size-7 animate-spin text-orange-400" />
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Procesando...
                  </span>
                </>
              ) : detections.length > 0 ? (
                <>
                  <CheckCircle className="size-7 text-orange-400" />
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Resultados
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="size-7 text-gray-600" />
                  <span className="text-gray-500">Sin Resultados</span>
                </>
            )}
          </h3>

            {compliance && (
              <div className="space-y-4 mb-6">
                {/* Compliance Status */}
                <div className={`p-4 rounded-lg border ${compliance.compliant ? 'bg-green-500/10 border-green-500/50' : 'bg-yellow-500/10 border-yellow-500/50'}`}>
                  <div className="flex items-center gap-3">
                    {compliance.compliant ? (
                      <CheckCircle className="size-6 text-green-400" />
                    ) : (
                      <AlertCircle className="size-6 text-yellow-400" />
                    )}
                    <p className={compliance.compliant ? 'text-green-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                      {compliance.message}
                    </p>
                  </div>
                </div>

                {/* Missing Items Section - More Prominent */}
                {missingItems.length > 0 && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-lg border-2 border-red-500/60 bg-gradient-to-br from-red-500/20 to-orange-500/10 shadow-lg shadow-red-500/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <AlertCircle className="size-6 text-red-400" />
                      </div>
                      <h4 className="text-xl font-bold text-red-400">
                        ⚠️ Implementos Faltantes por Persona
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {missingItems.map((item) => (
                        <motion.div
                          key={item.person_id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: item.person_id * 0.1 }}
                          className="p-4 bg-black/60 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 size-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                              <span className="text-orange-400 font-bold">{item.person_id}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-orange-400 font-semibold mb-2">Persona {item.person_id}</p>
                              <div className="flex flex-wrap gap-2">
                                {item.missing.map((epp, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-full text-red-300 text-sm font-medium"
                                  >
                                    {epp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Detections removed from here - will be shown separately below */}

            {/* Detections removed from here - will be shown separately below */}

            {detections.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2 mb-4">
                  <Sparkles className="size-5" />
                  Objetos Detectados
                </h4>
                {detections.map((detection, index) => {
                  const color = detection.color || getDetectionColor(detection.class);
                  return (
                    <motion.div
                      key={`${detection.class}-${index}`}
                      initial={{ x: 20, opacity: 0, scale: 0.9 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/40 rounded-xl p-5 border border-orange-500/20 hover:border-orange-500/40 transition-all hover:shadow-lg hover:shadow-orange-500/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg text-white">{detection.class}</span>
                        <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${color} text-white shadow-lg`}>
                          {(detection.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${detection.confidence * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${color} shadow-lg`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}            {!isProcessing && detections.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle className="size-16 mb-4 opacity-30" />
                <p className="text-center">Sube una imagen para comenzar<br/>la detección de EPP</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}